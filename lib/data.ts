import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireUserEmail } from "@/auth";
import { db, entries, instruments, pages, practices, sections, users } from "@/db";

export type Sections = (typeof sections.$inferSelect)[];
export type Practice = typeof practices.$inferSelect;
export type Instrument = typeof instruments.$inferSelect;
export type Entry = typeof entries.$inferSelect;
export type Account = NonNullable<Awaited<ReturnType<typeof findAccountByEmail>>>;

async function findAccountByEmail(email: string) {
  const [row] = await db
    .select({ user: users, page: pages })
    .from(users)
    .innerJoin(pages, eq(pages.userId, users.id))
    .where(eq(users.email, email))
    .limit(1);
  if (!row) return null;
  const pageId = row.page.id;
  const [pageSections, pagePractices, pageInstruments, pageEntries] = await Promise.all([
    db.select().from(sections).where(eq(sections.pageId, pageId)).orderBy(asc(sections.order)),
    db.select().from(practices).where(eq(practices.pageId, pageId)).orderBy(asc(practices.order), asc(practices.createdAt)),
    db.select().from(instruments).where(eq(instruments.pageId, pageId)).orderBy(asc(instruments.order), asc(instruments.createdAt)),
    // Newest first. A personal journal stays small; paginate here if it ever grows
    db.select().from(entries).where(eq(entries.pageId, pageId)).orderBy(desc(entries.date), desc(entries.createdAt)),
  ]);
  return { ...row, sections: pageSections, practices: pagePractices, instruments: pageInstruments, entries: pageEntries };
}

/**
 * The signed-in user's account, or null if they haven't finished onboarding.
 * Cached per request, so the dashboard layout and page share one lookup.
 */
export const getAccount = cache(async () => findAccountByEmail(await requireUserEmail()));

/** Same as getAccount, but sends users without an account to onboarding. */
export async function requireAccount(): Promise<Account> {
  const account = await getAccount();
  if (!account) redirect("/welcome");
  return account;
}

export async function getAccountByUsername(username: string) {
  const [user] = await db.select({ email: users.email }).from(users).where(eq(users.username, username)).limit(1);
  return user ? findAccountByEmail(user.email) : null;
}

/** Host of the current request, used to show the user their page link. */
export async function getSiteHost() {
  return (await headers()).get("host") ?? "localhost:3000";
}
