"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  db,
  DEMO_KINDS,
  ENTRY_KINDS,
  entries,
  INSTRUMENT_KINDS,
  INSTRUMENT_STATUSES,
  instruments,
  pages,
  PRACTICE_COLORS,
  practices,
  type DemoKind,
  type EntryKind,
  type InstrumentDemo,
  type InstrumentImage,
  type InstrumentKind,
  type InstrumentLink,
  type InstrumentStatus,
  type PracticeColor,
} from "@/db";
import { fail, refresh, text, type FormState } from "@/lib/action-helpers";
import { requireAccount, type Account } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { slugify } from "@/lib/practices";
import { isIsoDate, isSlug, isUniqueViolation, LIMITS, normalizeUrl } from "@/lib/validation";

/**
 * Practices, instruments and journal entries. Like app/actions.ts, every
 * action resolves the account from the session and only touches its rows;
 * ids that arrive from the client are checked against the account first.
 */

const touchPage = (account: Account) => db.update(pages).set({ updatedAt: new Date() }).where(eq(pages.id, account.page.id));

const oneOf = <T extends string>(list: readonly T[], value: string, fallback: T): T =>
  (list as readonly string[]).includes(value) ? (value as T) : fallback;

/** JSON sent by the instrument form for its list fields; anything malformed becomes an empty list. */
function jsonList(formData: FormData, key: string): unknown[] {
  try {
    const value = JSON.parse(text(formData, key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/* Practices */

export async function createPracticeAction() {
  const account = await requireAccount();
  const { t } = await getDictionary();
  const used = new Set(account.practices.map((p) => p.color));
  const color = PRACTICE_COLORS.find((c) => !used.has(c)) ?? PRACTICE_COLORS[account.practices.length % PRACTICE_COLORS.length];
  const order = Math.max(-1, ...account.practices.map((p) => p.order)) + 1;
  await db.batch([
    db.insert(practices).values({ pageId: account.page.id, name: t.newPractice, color, order }),
    touchPage(account),
  ]);
  refresh();
}

export async function savePracticeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const account = await requireAccount();
  const { t } = await getDictionary();
  const practice = account.practices.find((p) => p.id === text(formData, "id"));
  if (!practice) return {};

  const name = text(formData, "name");
  const description = text(formData, "description");
  const color = oneOf<PracticeColor>(PRACTICE_COLORS, text(formData, "color"), practice.color);
  const showInSequencer = formData.get("showInSequencer") === "on";

  const errors: Record<string, string> = {};
  if (!name) errors.name = t.errors.nameRequired;
  else if (name.length > LIMITS.name) errors.name = t.errors.tooLong;
  if (description.length > LIMITS.description) errors.description = t.errors.tooLong;
  if (Object.keys(errors).length) return fail(errors, formData);

  await db.batch([
    db.update(practices)
      .set({ name, description, color, showInSequencer })
      .where(and(eq(practices.id, practice.id), eq(practices.pageId, account.page.id))),
    touchPage(account),
  ]);
  refresh();
  return { ok: true };
}

/** Swaps a practice with its neighbor; the order sets the sequencer rows. */
export async function movePracticeAction(practiceId: string, direction: -1 | 1) {
  const account = await requireAccount();
  const list = account.practices;
  const index = list.findIndex((p) => p.id === practiceId);
  const other = list[index + (direction === 1 ? 1 : -1)];
  if (index < 0 || !other) return;
  // Rewrite every order so equal values from older rows can't make the swap a no-op
  const reordered = [...list];
  [reordered[index], reordered[index + (direction === 1 ? 1 : -1)]] = [other, list[index]];
  await db.batch([
    touchPage(account),
    ...reordered.map((p, order) =>
      db.update(practices).set({ order }).where(and(eq(practices.id, p.id), eq(practices.pageId, account.page.id))),
    ),
  ]);
  refresh();
}

export async function deletePracticeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const account = await requireAccount();
  const { t } = await getDictionary();
  const practice = account.practices.find((p) => p.id === text(formData, "id"));
  if (!practice) return {};
  const inUse =
    account.instruments.some((i) => i.practiceId === practice.id) || account.entries.some((e) => e.practiceId === practice.id);
  if (inUse) return { errors: { delete: t.errors.practiceInUse } };

  await db.batch([
    db.delete(practices).where(and(eq(practices.id, practice.id), eq(practices.pageId, account.page.id))),
    touchPage(account),
  ]);
  refresh();
  return { ok: true };
}

/* Instruments */

export async function saveInstrumentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const account = await requireAccount();
  const { t } = await getDictionary();
  const id = text(formData, "id");
  const existing = id ? account.instruments.find((i) => i.id === id) : undefined;
  if (id && !existing) return {};

  const name = text(formData, "name");
  const slug = text(formData, "slug") || slugify(name);
  const practiceId = text(formData, "practiceId");
  const kind = oneOf<InstrumentKind>(INSTRUMENT_KINDS, text(formData, "kind"), "app");
  const status = oneOf<InstrumentStatus>(INSTRUMENT_STATUSES, text(formData, "status"), "building");
  const summary = text(formData, "summary");
  const problem = text(formData, "problem");
  const byMe = text(formData, "byMe");
  const byAi = text(formData, "byAi");
  const featured = formData.get("featured") === "on";
  const isVisible = formData.get("isVisible") === "on";

  const errors: Record<string, string> = {};
  if (!name) errors.name = t.errors.nameRequired;
  else if (name.length > LIMITS.name) errors.name = t.errors.tooLong;
  if (!isSlug(slug)) errors.slug = t.errors.slugFormat;
  else if (account.instruments.some((i) => i.slug === slug && i.id !== existing?.id)) errors.slug = t.errors.slugTaken;
  if (!account.practices.some((p) => p.id === practiceId)) errors.practiceId = t.errors.practiceRequired;
  if (summary.length > LIMITS.summary) errors.summary = t.errors.tooLong;
  if (problem.length > LIMITS.longText) errors.problem = t.errors.tooLong;
  if (byMe.length > LIMITS.lines) errors.byMe = t.errors.tooLong;
  if (byAi.length > LIMITS.lines) errors.byAi = t.errors.tooLong;

  const materials = [...new Set(jsonList(formData, "materials").map(str).filter(Boolean))];
  if (materials.length > LIMITS.materials || materials.some((m) => m.length > LIMITS.material)) errors.materials = t.errors.tooLong;

  let demo: InstrumentDemo | null = null;
  const demoKind = oneOf<DemoKind>(DEMO_KINDS, text(formData, "demoKind"), "video");
  const demoUrl = normalizeUrl(text(formData, "demoUrl"));
  if (demoUrl === null) errors.demoUrl = t.errors.badUrl;
  else if (demoUrl || demoKind === "images") demo = { kind: demoKind, url: demoKind === "images" ? "" : demoUrl };

  const images: InstrumentImage[] = [];
  for (const item of jsonList(formData, "images").slice(0, LIMITS.images)) {
    const raw = item as Record<string, unknown>;
    const url = normalizeUrl(str(raw?.url));
    if (url === null) errors.images = t.errors.badUrl;
    else if (url) images.push({ url, caption: str(raw?.caption).slice(0, LIMITS.caption) });
  }

  const links: InstrumentLink[] = [];
  for (const item of jsonList(formData, "links").slice(0, LIMITS.links)) {
    const raw = item as Record<string, unknown>;
    const label = str(raw?.label).slice(0, LIMITS.linkLabel);
    const url = normalizeUrl(str(raw?.url));
    if (url === null) errors.links = t.errors.badUrl;
    else if (url && label) links.push({ label, url });
  }

  if (Object.keys(errors).length) return fail(errors, formData);

  const values = { name, slug, practiceId, kind, status, summary, problem, byMe, byAi, materials, demo, images, links, featured, isVisible };
  let newId: string | null = null;
  try {
    if (existing) {
      await db.batch([
        db.update(instruments).set(values).where(and(eq(instruments.id, existing.id), eq(instruments.pageId, account.page.id))),
        touchPage(account),
      ]);
    } else {
      newId = crypto.randomUUID();
      const order = Math.max(-1, ...account.instruments.map((i) => i.order)) + 1;
      await db.batch([db.insert(instruments).values({ ...values, id: newId, pageId: account.page.id, order }), touchPage(account)]);
    }
  } catch (error) {
    if (isUniqueViolation(error)) return fail({ slug: t.errors.slugTaken }, formData);
    throw error;
  }

  refresh();
  if (newId) redirect(`/dashboard/instruments?i=${newId}`);
  return { ok: true };
}

export async function deleteInstrumentAction(instrumentId: string) {
  const account = await requireAccount();
  const instrument = account.instruments.find((i) => i.id === instrumentId);
  if (!instrument) return;
  // Journal entries that pointed to it stay, unlinked (ON DELETE SET NULL)
  await db.batch([
    db.delete(instruments).where(and(eq(instruments.id, instrument.id), eq(instruments.pageId, account.page.id))),
    touchPage(account),
  ]);
  refresh();
  redirect("/dashboard/instruments");
}

/* Journal */

export async function saveEntryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const account = await requireAccount();
  const { t } = await getDictionary();
  const id = text(formData, "id");
  const existing = id ? account.entries.find((e) => e.id === id) : undefined;
  if (id && !existing) return {};

  const practiceId = text(formData, "practiceId");
  const instrumentId = text(formData, "instrumentId") || null;
  const date = text(formData, "date");
  const kind = oneOf<EntryKind>(ENTRY_KINDS, text(formData, "kind"), "note");
  const title = text(formData, "title");
  const body = text(formData, "body");
  const mediaUrl = normalizeUrl(text(formData, "mediaUrl"));

  const errors: Record<string, string> = {};
  if (!account.practices.some((p) => p.id === practiceId)) errors.practiceId = t.errors.practiceRequired;
  if (instrumentId && !account.instruments.some((i) => i.id === instrumentId)) errors.instrumentId = t.errors.practiceRequired;
  if (!isIsoDate(date)) errors.date = t.errors.dateRequired;
  if (!title) errors.title = t.errors.entryTitleRequired;
  else if (title.length > LIMITS.entryTitle) errors.title = t.errors.tooLong;
  if (body.length > LIMITS.longText) errors.body = t.errors.tooLong;
  if (mediaUrl === null) errors.mediaUrl = t.errors.badUrl;
  if (Object.keys(errors).length) return fail(errors, formData);

  const values = { practiceId, instrumentId, date, kind, title, body, mediaUrl: mediaUrl || null };
  if (existing) {
    await db.batch([
      db.update(entries).set(values).where(and(eq(entries.id, existing.id), eq(entries.pageId, account.page.id))),
      touchPage(account),
    ]);
  } else {
    await db.batch([db.insert(entries).values({ ...values, pageId: account.page.id }), touchPage(account)]);
  }
  refresh();
  return { ok: true };
}

export async function toggleEntryAction(entryId: string) {
  const account = await requireAccount();
  const entry = account.entries.find((e) => e.id === entryId);
  if (!entry) return;
  await db.batch([
    db.update(entries).set({ isVisible: !entry.isVisible }).where(and(eq(entries.id, entry.id), eq(entries.pageId, account.page.id))),
    touchPage(account),
  ]);
  refresh();
}

export async function deleteEntryAction(entryId: string) {
  const account = await requireAccount();
  const entry = account.entries.find((e) => e.id === entryId);
  if (!entry) return;
  await db.batch([
    db.delete(entries).where(and(eq(entries.id, entry.id), eq(entries.pageId, account.page.id))),
    touchPage(account),
  ]);
  refresh();
}
