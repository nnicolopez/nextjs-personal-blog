import { dayNeutrals, nightDark, nightNeutrals } from "./neutrals";
import type { ThemeDefinition } from "./types";

/** The design's second accent preset. */
export const magentaTeal: ThemeDefinition = {
  id: "magenta-teal",
  label: { es: "Magenta y verde azulado", en: "Magenta & teal" },
  swatches: ["#da69b9", "#00b393"],
  primary: "#af4791",
  secondary: "#008164",
  dark: nightDark,
  tokens: {
    light: { ...dayNeutrals, accent1: "#af4791", accent2: "#008164" },
    dark: { ...nightNeutrals, accent1: "#da69b9", accent2: "#00b393" },
  },
};
