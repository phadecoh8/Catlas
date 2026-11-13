"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "next-themes";
import { themeStorageKey } from "@/hooks/use-theme";
import { recordSiteActivity } from "@/lib/site-activity";

function MigrateLightTheme() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (theme === "light") {
      setTheme("sepia");
    }
  }, [setTheme, theme]);

  return null;
}

function SiteActivityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordSiteActivity({ type: "PAGE_VIEW", route: pathname, detail: "Page opened" });
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest(
        'a, button, [role="button"], [data-audit-action]',
      );
      if (!target || target.hasAttribute("disabled")) return;

      const label = (
        target.getAttribute("aria-label") ||
        target.getAttribute("data-audit-action") ||
        target.textContent ||
        target.getAttribute("title") ||
        "Interactive element"
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 100);

      recordSiteActivity({
        type: "CLICK",
        route: window.location.pathname,
        detail: label || "Interactive element",
      });
    }

    function handleSubmit(event: SubmitEvent) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const label =
        form.getAttribute("aria-label") ||
        form.getAttribute("name") ||
        form.id ||
        "Form";

      recordSiteActivity({
        type: "FORM_SUBMIT",
        route: window.location.pathname,
        detail: `${label.slice(0, 80)} submitted`,
      });
    }

    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
    };
  }, []);

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
      <SiteActivityTracker />
      {children}
    </ThemeProvider>
  );
}
