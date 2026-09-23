import { cookies } from "next/headers";
import { DEFAULT_THEME_ID, isThemeId, THEME_COOKIE } from "@/themes";

/** The app theme chosen in Settings, from its cookie. */
export async function getThemeId() {
  const value = (await cookies()).get(THEME_COOKIE)?.value;
  return isThemeId(value) ? value : DEFAULT_THEME_ID;
}
