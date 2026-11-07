"use client";

import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

export type AppTheme = "dark" | "sepia" | "amoled" | "midnight";

export const appThemes: AppTheme[] = [
  "dark",
  "sepia",
  "amoled",
  "midnight",
];

export const themeStorageKey = "catlas-theme";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => unknown;
};

export function useAppTheme() {
  const { theme: storedTheme, setTheme } = useTheme();
  const theme = appThemes.includes(storedTheme as AppTheme)
    ? (storedTheme as AppTheme)
    : "dark";

  function setAppTheme(nextTheme: AppTheme) {
    const transitionDocument = document as ViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function applyTheme() {
      try {
        localStorage.setItem(themeStorageKey, nextTheme);
      } catch {
        // Theme selection still works for this page if storage is unavailable.
      }

      flushSync(() => {
        setTheme(nextTheme);
      });

      document.documentElement.setAttribute("data-theme", nextTheme);
    }

    if (!transitionDocument.startViewTransition || prefersReducedMotion) {
      applyTheme();
      return;
    }

    transitionDocument.startViewTransition(applyTheme);
  }

  function toggleTheme() {
    const currentIndex = appThemes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % appThemes.length;

    setAppTheme(appThemes[nextIndex]);
  }

  return {
    theme,
    setAppTheme,
    toggleTheme,
  };
}
