"use client";

import { useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { themeStorageKey } from "@/hooks/use-theme";

function MigrateLightTheme() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (theme === "light") {
      setTheme("sepia");
    }
  }, [setTheme, theme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableColorScheme={false}
      enableSystem={false}
      storageKey={themeStorageKey}
      themes={["dark", "light", "sepia", "amoled", "midnight"]}
      value={{
        dark: "dark",
        light: "sepia",
        sepia: "sepia",
        amoled: "amoled",
        midnight: "midnight",
      }}
    >
      <MigrateLightTheme />
      {children}
    </ThemeProvider>
  );
}
