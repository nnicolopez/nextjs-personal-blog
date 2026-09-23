import type { MantineColorsTuple, MantineThemeOverride } from "@mantine/core";

/** Colors for one color scheme (day = light, night = dark). */
export interface SchemeTokens {
  accent1: string;
  accent2: string;
  danger: string;
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  onAccent: string;
  chipBg: string;
  chipText: string;
  shadow: string;
  // Landing hero scene
  sky: string;
  starsOpacity: number;
  orb: string;
  orbGlow: string;
  toggleGlow: string;
  mountainFar: string;
  mountainNear: string;
  heroScrim: string;
  heroText: string;
  heroTextMuted: string;
}

export interface ThemeDefinition {
  /** Stable id, stored in the "app-theme" cookie */
  id: string;
  label: { es: string; en: string };
  /** Main and secondary colors, shown in the theme picker */
  swatches: [string, string];
  /**
   * Main and secondary colors for Mantine components: a hex color (its
   * 10-shade palette is generated) or a hand-made 10-shade tuple.
   */
  primary: string | MantineColorsTuple;
  secondary: string | MantineColorsTuple;
  /** Mantine's dark palette: dark[0] is text, dark[7] is the page background */
  dark: MantineColorsTuple;
  tokens: { light: SchemeTokens; dark: SchemeTokens };
  /** Anything else a theme wants to change: fonts, radius, component defaults */
  overrides?: MantineThemeOverride;
}
