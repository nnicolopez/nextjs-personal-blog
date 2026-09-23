"use server";

import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, requireUserEmail, signOut } from "@/auth";
import { db, pages, sections, users, SECTION_TYPES, TEMPLATES, type Template } from "@/db";
import { getAccount, requireAccount } from "@/lib/data";
import { getDictionary, type Lang } from "@/lib/i18n";
import { isUniqueViolation, LIMITS, normalizeUrl, normalizeUsername, usernameProblem } from "@/lib/validation";

/**
 * Every action resolves the account from the session (never from form data)
 * and scopes its queries to that account's rows.
 */

export type FormState = { ok?: boolean; errors?: Record<string, string>; values?: Record<string, string> };

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

// React resets a form after its action runs; sending the submitted values
// back lets the form show them again next to the errors.
function fail(errors: Record<string, string>, formData: FormData): FormState {
  const values: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  });
  return { errors, values };
}

function refresh() {
  revalidatePath("/", "layout");
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function setLangAction(lang: Lang) {
  (await cookies()).set("lang", lang === "en" ? "en" : "es", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  refresh();
}

export async function createAccountAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = await requireUserEmail();
  if (await getAccount()) redirect("/dashboard");

  const { t } = await getDictionary();
  const fullName = text(formData, "fullName");
  const username = normalizeUsername(text(formData, "username"));

  const errors: Record<string, string> = {};
  if (!fullName) errors.fullName = t.errors.fullNameRequired;
  else if (fullName.length > LIMITS.fullName) errors.fullName = t.errors.tooLong;
  const problem = usernameProblem(username);
  if (problem) errors.username = problem === "reserved" ? t.errors.usernameReserved : t.errors.usernameFormat;
  if (Object.keys(errors).length) return fail(errors, formData);

  const session = await auth();
  const userId = crypto.randomUUID();
  const pageId = crypto.randomUUID();
  const defaultVisible = new Set(["about", "projects", "skills", "contact"]);

  try {
    // Runs as a single transaction on Neon
    await db.batch([
      db.insert(users).values({ id: userId, email, username }),
      db.insert(pages).values({ id: pageId, userId, fullName, avatarUrl: session?.user?.image ?? null }),
      db.insert(sections).values(
        SECTION_TYPES.map((type, order) => ({
          pageId,
          type,
          order,
          title: t.sectionDefaults[type],
          isVisible: defaultVisible.has(type),
        })),
      ),
    ]);
  } catch (error) {
    if (isUniqueViolation(error)) return fail({ username: t.errors.usernameTaken }, formData);
    throw error;
  }

  refresh();
  redirect("/dashboard");
}

export async function saveProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const account = await requireAccount();
  const { t } = await getDictionary();
  const fullName = text(formData, "fullName");
  const username = normalizeUsername(text(formData, "username"));
  const bio = text(formData, "bio");

  const errors: Record<string, string> = {};
  if (!fullName) errors.fullName = t.errors.fullNameRequired;
  else if (fullName.length > LIMITS.fullName) errors.fullName = t.errors.tooLong;
  const problem = usernameProblem(username);
  if (problem) errors.username = problem === "reserved" ? t.errors.usernameReserved : t.errors.usernameFormat;
  if (bio.length > LIMITS.bio) errors.bio = t.errors.tooLong;
  if (Object.keys(errors).length) return fail(errors, formData);

  try {
    await db.batch([
      db.update(users).set({ username }).where(eq(users.id, account.user.id)),
      db.update(pages).set({ fullName, bio }).where(eq(pages.id, account.page.id)),
    ]);
  } catch (error) {
    if (isUniqueViolation(error)) return fail({ username: t.errors.usernameTaken }, formData);
    throw error;
  }

  refresh();
  return { ok: true };
}

export async function saveSocialAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const account = await requireAccount();
  const { t } = await getDictionary();

  const socialLinks: Record<string, string> = {};
  const errors: Record<string, string> = {};
  for (const key of ["linkedin", "github", "instagram"] as const) {
    const url = normalizeUrl(text(formData, key));
    if (url === null) errors[key] = t.errors.badUrl;
    else if (url) socialLinks[key] = url;
  }
  if (Object.keys(errors).length) return fail(errors, formData);

  await db.update(pages).set({ socialLinks }).where(eq(pages.id, account.page.id));
  refresh();
  return { ok: true };
}

export async function saveSectionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const account = await requireAccount();
  const { t } = await getDictionary();
  const section = account.sections.find((s) => s.id === text(formData, "sectionId"));
  if (!section) return {};
  const title = text(formData, "title");
  const content = text(formData, "content");

  const errors: Record<string, string> = {};
  if (!title) errors.title = t.errors.titleRequired;
  else if (title.length > LIMITS.title) errors.title = t.errors.tooLong;
  if (content.length > LIMITS.content) errors.content = t.errors.tooLong;
  if (Object.keys(errors).length) return fail(errors, formData);

  await db.batch([
    db.update(sections)
      .set({ title, content })
      .where(and(eq(sections.id, section.id), eq(sections.pageId, account.page.id))),
    db.update(pages).set({ updatedAt: new Date() }).where(eq(pages.id, account.page.id)),
  ]);
  refresh();
  return { ok: true };
}

export async function toggleSectionAction(sectionId: string) {
  const account = await requireAccount();
  const section = account.sections.find((s) => s.id === sectionId);
  if (!section) return;

  await db.batch([
    db.update(sections)
      .set({ isVisible: !section.isVisible })
      .where(and(eq(sections.id, section.id), eq(sections.pageId, account.page.id))),
    db.update(pages).set({ updatedAt: new Date() }).where(eq(pages.id, account.page.id)),
  ]);
  refresh();
}

// Bound arguments arrive from the client and can be tampered with, so each
// action below re-checks them against the signed-in account.
export async function setPublishedAction(value: boolean) {
  const account = await requireAccount();
  const isPublished = value === true;
  await db
    .update(pages)
    .set({ isPublished, publishedAt: isPublished ? (account.page.publishedAt ?? new Date()) : account.page.publishedAt })
    .where(eq(pages.id, account.page.id));
  refresh();
}

export async function setTemplateAction(template: Template) {
  const account = await requireAccount();
  if (!TEMPLATES.includes(template)) return;
  await db.update(pages).set({ template }).where(eq(pages.id, account.page.id));
  refresh();
}

export async function deleteAccountAction() {
  const account = await requireAccount();
  // pages and sections go with it (ON DELETE CASCADE)
  await db.delete(users).where(eq(users.id, account.user.id));
  await signOut({ redirectTo: "/login" });
}
