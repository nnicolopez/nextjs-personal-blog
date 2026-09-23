"use client";

import { useMemo } from "react";
import { MantineProvider } from "@mantine/core";
import { createAppTheme } from "@/themes/base";
import { getThemeDefinition } from "@/themes";

/**
 * Mantine setup. Takes the theme id (not the theme object) because the
 * CSS variables resolver is a function and can't cross from the server.
 */
export default function Providers({ themeId, children }: { themeId: string; children: React.ReactNode }) {
  const { theme, resolver } = useMemo(() => createAppTheme(getThemeDefinition(themeId)), [themeId]);
  return (
    <MantineProvider theme={theme} cssVariablesResolver={resolver} defaultColorScheme="dark">
      {children}
    </MantineProvider>
  );
}
