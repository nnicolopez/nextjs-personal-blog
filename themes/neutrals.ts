import type { MantineColorsTuple } from "@mantine/core";
import type { SchemeTokens } from "./types";

/**
 * Backgrounds, text and hero scene from design/PersonalCMS.html, shared by
 * the design's accent presets. A theme can spread these and override any key.
 */

type Neutrals = Omit<SchemeTokens, "accent1" | "accent2">;

export const dayNeutrals: Neutrals = {
  danger: "#c04442",
  bg: "#e5f1f7",
  surface: "#fefcf6",
  surfaceAlt: "#c9e3ec",
  border: "#b0c9d2",
  text: "#141b24",
  textMuted: "#4d5660",
  onAccent: "#fdfcf8",
  chipBg: "rgba(234, 213, 171, 0.8)",
  chipText: "#6d3800",
  shadow: "0 30px 60px -35px rgba(1, 1, 7, 0.45)",
  sky: "linear-gradient(180deg, oklch(70% 0.09 235) 0%, oklch(80% 0.09 200) 45%, oklch(87% 0.09 85) 80%, oklch(90% 0.07 70) 100%)",
  starsOpacity: 0,
  orb: "#ffd060",
  orbGlow: "0 0 110px 40px rgba(255, 208, 96, 0.55)",
  toggleGlow: "0 0 8px rgba(255, 208, 96, 0.7)",
  mountainFar: "#799fb2",
  mountainNear: "#3f5433",
  heroScrim: "linear-gradient(180deg, transparent 0%, oklch(20% 0.03 250 / 0.1) 70%, oklch(15% 0.03 250 / 0.35) 100%)",
  heroText: "#050c13",
  heroTextMuted: "#273442",
};

export const nightNeutrals: Neutrals = {
  danger: "#ef6661",
  bg: "#080d18",
  surface: "#131824",
  surfaceAlt: "#0d1321",
  border: "#2b3342",
  text: "#e1e5eb",
  textMuted: "#9298a5",
  onAccent: "#040609",
  chipBg: "rgba(33, 45, 71, 0.7)",
  chipText: "#beceef",
  shadow: "0 30px 60px -35px rgba(1, 1, 7, 0.55)",
  sky: "linear-gradient(180deg, oklch(12% 0.03 270) 0%, oklch(18% 0.05 280) 45%, oklch(24% 0.05 285) 75%, oklch(20% 0.04 270) 100%)",
  starsOpacity: 1,
  orb: "#eae4d6",
  orbGlow: "0 0 90px 30px rgba(234, 228, 214, 0.35)",
  toggleGlow: "0 0 8px rgba(234, 228, 214, 0.6)",
  mountainFar: "#21283d",
  mountainNear: "#030713",
  heroScrim: "linear-gradient(180deg, transparent 0%, oklch(10% 0.02 265 / 0.35) 70%, oklch(8% 0.02 265 / 0.65) 100%)",
  heroText: "#eef2f9",
  heroTextMuted: "#b7becb",
};

/**
 * Mantine's dark palette built from the night neutrals. Mantine uses [7] for
 * the page, [6] for inputs and cards, [4]/[5] for borders, hovers and
 * unchecked switches (so those stay a step lighter than the cards).
 */
export const nightDark: MantineColorsTuple = [
  "#dce5f6", "#b6bece", "#9198a8", "#5c6372", "#3a4252", "#2b3342", "#131824", "#080d18", "#03050f", "#010107",
];
