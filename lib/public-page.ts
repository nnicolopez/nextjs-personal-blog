import "server-only";
import { cache } from "react";
import { auth } from "@/auth";
import { getAccountByUsername } from "./data";
import { normalizeUsername } from "./validation";

/** The account behind /username, if the viewer may see it: published, or a draft seen by its owner. */
export const loadPublicAccount = cache(async (rawUsername: string) => {
  const account = await getAccountByUsername(normalizeUsername(decodeURIComponent(rawUsername)));
  if (!account) return null;
  const session = await auth();
  const isOwner = session?.user?.email?.toLowerCase() === account.user.email;
  if (!account.page.isPublished && !isOwner) return null;
  return { account, isOwner };
});
