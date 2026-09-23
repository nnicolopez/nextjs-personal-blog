export { auth as proxy } from "@/auth";

/**
 * Every route requires a signed-in, allowlisted user, except the login page,
 * the Auth.js endpoints, Next.js build assets and the image files in /public.
 */
export const config = {
  matcher: [
    "/((?!api/auth|login|robots.txt|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)",
  ],
};
