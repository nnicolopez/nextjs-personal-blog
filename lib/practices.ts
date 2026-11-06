import type { InstrumentDemo, PracticeColor } from "@/db/schema";

/**
 * Helpers for practices, instruments and the journal that both the server and
 * the browser use (the dashboard preview renders the same public components).
 * Only type imports from the schema, so drizzle stays out of client bundles.
 */

/** Practice palette from design v2. Text never uses these colors, only marks. */
export const PRACTICE_HEX: Record<PracticeColor, string> = {
  brass: "#A97C1F",
  iron: "#2E6B57",
  blueprint: "#2F57C4",
  plum: "#8B3D8F",
  teal: "#24727A",
  graphite: "#55615F",
};

export const SEQUENCER_WEEKS = 16;

/** Monday of the week that contains the date, as YYYY-MM-DD (UTC). */
export function weekStart(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  const day = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** The Mondays of the last `count` weeks, oldest first, ending with the current week. */
export function lastWeeks(today: string, count = SEQUENCER_WEEKS) {
  const end = new Date(`${weekStart(today)}T00:00:00Z`);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - (count - 1 - i) * 7);
    return d.toISOString().slice(0, 10);
  });
}

/**
 * Cells for the public sequencer: for each practice, how many entries it has
 * in each of the last weeks, capped at level 3 (0 = empty).
 */
export function sequencerRows(
  practiceIds: string[],
  entries: { practiceId: string; date: string }[],
  today: string,
) {
  const weeks = lastWeeks(today);
  const index = new Map(weeks.map((week, i) => [week, i]));
  const counts = new Map(practiceIds.map((id) => [id, weeks.map(() => 0)]));
  for (const entry of entries) {
    const row = counts.get(entry.practiceId);
    const col = index.get(weekStart(entry.date));
    if (row && col !== undefined) row[col] += 1;
  }
  return {
    weeks,
    rows: practiceIds.map((id) => {
      const values = counts.get(id)!;
      return { practiceId: id, total: values.reduce((a, b) => a + b, 0), levels: values.map((n) => Math.min(n, 3)) };
    }),
  };
}

/** "Cortina enrollable inteligente" → "cortina-enrollable-inteligente". */
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Text with one item per line → the non-empty items. */
export function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Where to point the demo iframe. YouTube and Vimeo watch links become their
 * embed URLs; anything else is embedded as given (it is already a safe http(s)
 * URL, checked when saved).
 */
export function embedUrl(demo: InstrumentDemo | null) {
  if (!demo || demo.kind === "images" || !demo.url) return null;
  try {
    const url = new URL(demo.url);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`;
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = url.searchParams.get("v") ?? url.pathname.split("/").pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") return `https://player.vimeo.com/video/${url.pathname.split("/").filter(Boolean)[0]}`;
    return url.toString();
  } catch {
    return null;
  }
}
