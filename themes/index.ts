import { magentaTeal } from "./magenta-teal";
import { violetCyan } from "./violet-cyan";
import type { ThemeDefinition } from "./types";

/**
 * Available app themes. To add one, create a file next to these that
 * exports a ThemeDefinition and add it to this list.
 */
export const THEMES: ThemeDefinition[] = [violetCyan, magentaTeal];

export const DEFAULT_THEME_ID = violetCyan.id;
export const THEME_COOKIE = "app-theme";

export function isThemeId(id: unknown): id is string {
  return typeof id === "string" && THEMES.some((theme) => theme.id === id);
}

export function getThemeDefinition(id: string) {
  return THEMES.find((theme) => theme.id === id) ?? violetCyan;
}

export type { ThemeDefinition, SchemeTokens } from "./types";
