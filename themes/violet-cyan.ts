import { dayNeutrals, nightDark, nightNeutrals } from "./neutrals";
import type { ThemeDefinition } from "./types";

/** The design's default accent preset. */
export const violetCyan: ThemeDefinition = {
  id: "violet-cyan",
  label: { es: "Violeta y cian", en: "Violet & cyan" },
  swatches: ["#a97cf0", "#00aec8"],
  primary: "#8459c3",
  secondary: "#007c95",
  dark: nightDark,
  tokens: {
    light: { ...dayNeutrals, accent1: "#8459c3", accent2: "#007c95" },
    dark: { ...nightNeutrals, accent1: "#a97cf0", accent2: "#00aec8" },
  },
};
