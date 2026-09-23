"use client";

import { useTransition } from "react";
import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { setLangAction } from "@/app/actions";
import type { Lang } from "@/lib/i18n";
import ui from "./ui.module.css";

interface Props {
  lang: Lang;
  compact?: boolean;
}

/** Language (ES/EN) and night/day switches from the design header. */
const Toggles = ({ lang, compact }: Props) => {
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme("dark");
  const [pending, startTransition] = useTransition();
  const next: Lang = lang === "es" ? "en" : "es";

  return (
    <div className={`${ui.toggles} ${compact ? ui.compact : ""}`}>
      <button
        type="button"
        className={ui.pillToggle}
        aria-label="Switch language"
        disabled={pending}
        onClick={() => startTransition(() => setLangAction(next))}
      >
        {next.toUpperCase()}
      </button>
      <button
        type="button"
        className={ui.orbToggle}
        aria-label="Toggle theme"
        onClick={() => setColorScheme(scheme === "dark" ? "light" : "dark")}
      >
        <span />
      </button>
    </div>
  );
};

export default Toggles;
