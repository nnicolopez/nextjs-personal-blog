import "server-only";
import { asc, eq } from "drizzle-orm";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireUserEmail } from "@/auth";
import { db, pages, sections, users } from "@/db";

export type Sections = (typeof sections.$inferSelect)[];
export type Account = NonNullable<Awaited<ReturnType<typeof findAccountByEmail>>>;

async function findAccountByEmail(email: string) {
  const [row] = await db
    .select({ user: users, page: pages })
    .from(users)
    .innerJoin(pages, eq(pages.userId, users.id))
    .where(eq(users.email, email))
    .limit(1);
  if (!row) return null;
  const pageSections = await db
    .select()
    .from(sections)
    .where(eq(sections.pageId, row.page.id))
    .orderBy(asc(sections.order));
  return { ...row, sections: pageSections };
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
