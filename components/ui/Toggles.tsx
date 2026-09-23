"use client";

import { useTransition } from "react";
import { ActionIcon, Button, Group, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { setLangAction } from "@/app/actions";
import type { Lang } from "@/lib/i18n";
import classes from "./Toggles.module.css";

/** Language (ES/EN) and night/day switches from the design header. */
const Toggles = ({ lang, compact }: { lang: Lang; compact?: boolean }) => {
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme("dark");
  const [pending, startTransition] = useTransition();
  const next: Lang = lang === "es" ? "en" : "es";
  const size = compact ? 38 : 42;

  return (
    <Group gap={10} wrap="nowrap">
      <Button
        variant="default"
        size={compact ? "compact-sm" : "sm"}
        aria-label="Switch language"
        loading={pending}
        onClick={() => startTransition(() => setLangAction(next))}
      >
        {next.toUpperCase()}
      </Button>
      <ActionIcon
        size={size}
        aria-label="Toggle theme"
        onClick={() => setColorScheme(scheme === "dark" ? "light" : "dark")}
      >
        <span className={classes.orb} />
      </ActionIcon>
    </Group>
  );
};

export default Toggles;
