import { generateColors } from "@mantine/colors-generator";
import {
  ActionIcon,
  AppShell,
  Badge,
  Button,
  Card,
  createTheme,
  darken,
  InputWrapper,
  Input,
  mergeThemeOverrides,
  NavLink,
  Paper,
  Switch,
  type CSSVariablesResolver,
  type MantineColorsTuple,
} from "@mantine/core";
import type { SchemeTokens, ThemeDefinition } from "./types";

/**
 * Client only (generateColors runs in the browser); the server only needs
 * the theme registry in themes/index.ts.
 *
 * Turns a ThemeDefinition into what MantineProvider needs: the Mantine theme
 * (palettes and component defaults shared by every theme) and a CSS variables
 * resolver that exposes the tokens as --pc-* and points Mantine's own
 * variables (body, text, borders, primary color) at them.
 */

const base = createTheme({
  primaryColor: "primary",
  fontFamily: "var(--font-work-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  headings: {
    fontFamily: "var(--font-work-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: "700",
  },
  defaultRadius: "md",
  cursorType: "pointer",
  components: {
    Button: Button.extend({
      defaultProps: { radius: "xl" },
      styles: { root: { fontWeight: 700 } },
    }),
    ActionIcon: ActionIcon.extend({ defaultProps: { radius: "xl", variant: "default" } }),
    Badge: Badge.extend({ defaultProps: { radius: "xl", variant: "light" } }),
    Paper: Paper.extend({
      defaultProps: { radius: "lg", withBorder: true },
      styles: { root: { backgroundColor: "var(--pc-surface)" } },
    }),
    Card: Card.extend({
      defaultProps: { radius: "lg", withBorder: true },
      styles: { root: { backgroundColor: "var(--pc-surface)" } },
    }),
    Input: Input.extend({
      defaultProps: { radius: "md", size: "md" },
      styles: { input: { backgroundColor: "var(--pc-bg)", borderColor: "var(--pc-border)", fontSize: 14 } },
    }),
    InputWrapper: InputWrapper.extend({
      styles: { label: { fontSize: 13, fontWeight: 600, marginBottom: 7 } },
    }),
    NavLink: NavLink.extend({
      styles: { root: { borderRadius: 10 }, label: { fontSize: 14 } },
    }),
    Switch: Switch.extend({ defaultProps: { size: "md" } }),
    AppShell: AppShell.extend({
      styles: {
        navbar: { backgroundColor: "var(--pc-bg)", borderColor: "var(--pc-border)" },
        header: { backgroundColor: "var(--pc-bg)", borderColor: "var(--pc-border)" },
      },
    }),
  },
});

function schemeVariables(t: SchemeTokens): Record<string, string> {
  return {
    "--pc-accent1": t.accent1,
    "--pc-accent2": t.accent2,
    "--pc-danger": t.danger,
    "--pc-bg": t.bg,
    "--pc-surface": t.surface,
    "--pc-surface-alt": t.surfaceAlt,
    "--pc-border": t.border,
    "--pc-text": t.text,
    "--pc-text-muted": t.textMuted,
    "--pc-on-accent": t.onAccent,
    "--pc-chip-bg": t.chipBg,
    "--pc-chip-text": t.chipText,
    "--pc-shadow": t.shadow,
    "--pc-sky": t.sky,
    "--pc-stars-opacity": String(t.starsOpacity),
    "--pc-orb": t.orb,
    "--pc-orb-glow": t.orbGlow,
    "--pc-toggle-glow": t.toggleGlow,
    "--pc-mountain-far": t.mountainFar,
    "--pc-mountain-near": t.mountainNear,
    "--pc-hero-scrim": t.heroScrim,
    "--pc-hero-text": t.heroText,
    "--pc-hero-text-muted": t.heroTextMuted,

    "--mantine-color-body": t.bg,
    "--mantine-color-text": t.text,
    "--mantine-color-dimmed": t.textMuted,
    "--mantine-color-placeholder": t.textMuted,
    "--mantine-color-anchor": t.accent1,
    "--mantine-color-error": t.danger,
    "--mantine-color-default": t.surface,
    "--mantine-color-default-hover": t.surfaceAlt,
    "--mantine-color-default-color": t.text,
    "--mantine-color-default-border": t.border,
    "--mantine-primary-color-filled": t.accent1,
    "--mantine-primary-color-filled-hover": darken(t.accent1, 0.1),
    "--mantine-primary-color-contrast": t.onAccent,
    "--mantine-primary-color-light": t.chipBg,
    "--mantine-primary-color-light-hover": t.chipBg,
    "--mantine-primary-color-light-color": t.accent1,
  };
}

const palette = (color: string | MantineColorsTuple) => (typeof color === "string" ? generateColors(color) : color);

export function createAppTheme(def: ThemeDefinition) {
  const theme = mergeThemeOverrides(
    base,
    createTheme({ colors: { primary: palette(def.primary), secondary: palette(def.secondary), dark: def.dark } }),
    def.overrides ?? {},
  );
  const resolver: CSSVariablesResolver = () => ({
    variables: {},
    light: schemeVariables(def.tokens.light),
    dark: schemeVariables(def.tokens.dark),
  });
  return { theme, resolver };
}
