import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Authentication (Auth.js v5 + Google)
 *
 * While the project is private, only the emails listed in ALLOWED_EMAILS
 * (comma separated) can sign in. If the variable is empty or missing,
 * nobody gets in: it fails closed.
 */
const allowedEmails = (process.env.ALLOWED_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const isAllowed = (email?: string | null) =>
  !!email && allowedEmails.includes(email.toLowerCase());

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    signIn({ profile }) {
      return profile?.email_verified === true && isAllowed(profile.email);
    },
    // Used by proxy.ts. Checking the allowlist again (not only "is there a
    // session") means removing an email from ALLOWED_EMAILS locks it out
    // right away, even if it still has a valid session cookie.
    authorized({ auth }) {
      return isAllowed(auth?.user?.email);
    },
  },
});

/**
 * For server actions and route handlers that touch the database.
 * The proxy already blocks unauthenticated requests, this is the second lock.
 */
export async function requireUserEmail(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email || !isAllowed(email)) throw new Error("Unauthorized");
  return email;
}
