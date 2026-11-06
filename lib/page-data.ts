import type { PublicPageData } from "@/components/public/PublicPage";
import type { PracticesData, PublicInstrument } from "@/components/public/practices/types";
import type { Account, Instrument } from "./data";
import type { Dictionary, Lang } from "./i18n";
import { lines, PRACTICE_HEX, sequencerRows, todayIso } from "./practices";

export function toPublicInstrument(instrument: Instrument): PublicInstrument {
  return {
    id: instrument.id,
    slug: instrument.slug,
    practiceId: instrument.practiceId,
    name: instrument.name,
    kind: instrument.kind,
    status: instrument.status,
    summary: instrument.summary,
    problem: instrument.problem,
    byMe: lines(instrument.byMe),
    byAi: lines(instrument.byAi),
    materials: instrument.materials,
    demo: instrument.demo,
    images: instrument.images,
    links: instrument.links,
    featured: instrument.featured,
  };
}

/** Public data for the practices template: visible instruments and entries only. */
export function toPracticesData(
  account: Pick<Account, "user" | "practices" | "instruments" | "entries">,
  t: Dictionary,
  lang: Lang,
): PracticesData {
  const practices = account.practices.map((p) => ({
    id: p.id,
    name: p.name,
    color: PRACTICE_HEX[p.color] ?? PRACTICE_HEX.graphite,
    description: p.description,
    showInSequencer: p.showInSequencer,
  }));
  const entries = account.entries.filter((e) => e.isVisible);
  return {
    basePath: `/${account.user.username}`,
    practices,
    instruments: account.instruments.filter((i) => i.isVisible).map(toPublicInstrument),
    entries: entries.map(({ id, practiceId, instrumentId, date, kind, title, body, mediaUrl }) => ({
      id, practiceId, instrumentId, date, kind, title, body, mediaUrl,
    })),
    sequencer: sequencerRows(
      practices.filter((p) => p.showInSequencer).map((p) => p.id),
      entries,
      todayIso(),
    ),
    labels: { ...t.practicesPublic, lang },
  };
}

/** What the public page shows: visible sections that have some content. */
export function toPublicPageData(account: Account, t: Dictionary, lang: Lang): PublicPageData {
  const { page, sections } = account;
  return {
    fullName: page.fullName,
    bio: page.bio,
    headline: page.headline,
    avatarUrl: page.avatarUrl,
    socialLinks: page.socialLinks,
    template: page.template,
    sections: sections
      .filter((section) => section.isVisible && section.content.trim())
      .map(({ id, title, content }) => ({ id, title, content })),
    practices: toPracticesData(account, t, lang),
  };
}
