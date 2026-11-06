// Routes that live at the top level and can't be taken as usernames
const RESERVED_USERNAMES = new Set([
  "api", "dashboard", "login", "logout", "welcome", "settings", "admin", "robots.txt", "favicon.ico", "_next",
]);

export const LIMITS = {
  fullName: 80, bio: 600, headline: 120, title: 80, content: 5000, url: 200,
  // Practices, instruments and journal
  name: 80, slug: 60, summary: 300, longText: 3000, lines: 2000, description: 300,
  material: 40, materials: 20, images: 12, caption: 120, links: 6, linkLabel: 40, entryTitle: 120,
};

export function isSlug(value: string) {
  return value.length <= LIMITS.slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

/** null when the username is fine, otherwise which rule it breaks. */
export function usernameProblem(username: string): "format" | "reserved" | null {
  if (!/^[a-z0-9](?:[a-z0-9-]{1,28})[a-z0-9]$/.test(username)) return "format";
  if (RESERVED_USERNAMES.has(username)) return "reserved";
  return null;
}

/** Turns "email@x.com" into a username suggestion like "email". */
export function suggestUsername(email: string) {
  const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return base.slice(0, 30);
}

/**
 * Accepts "github.com/user" or a full http(s) URL and returns an https URL.
 * Returns "" for an empty value and null when it isn't a safe web link
 * (so "javascript:" and friends never reach an href).
 */
export function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length > LIMITS.url) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** "https://github.com/user/" → "github.com/user", for showing links in inputs. */
export function displayUrl(url?: string) {
  return (url ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function isUniqueViolation(error: unknown) {
  const cause = (error as { cause?: { code?: string } })?.cause;
  return (error as { code?: string })?.code === "23505" || cause?.code === "23505";
}
