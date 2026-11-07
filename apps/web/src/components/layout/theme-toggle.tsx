"use client";

import Link from "next/link";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  appThemes,
  useAppTheme,
  type AppTheme,
} from "@/hooks/use-theme";

const themeLabels: Record<AppTheme, string> = {
  dark: "Dark",
  sepia: "Sepia",
  amoled: "AMOLED",
  midnight: "Midnight",
};

type ThemeToggleProps = {
  variant?: "icon" | "settings";
};

export function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const { theme } = useAppTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const currentTheme = mounted ? theme : "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnOutsideClick(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  if (variant === "settings") {
    return (
      <Link
        className="settings-link-row theme-settings-link"
        href="/settings/theme"
      >
        <span className="preference-icon purple">
          <Moon aria-hidden="true" />
        </span>
        <span className="preference-copy">
          <strong>Theme</strong>
          <span>{themeLabels[currentTheme]}</span>
        </span>
        <ChevronRight aria-hidden="true" className="settings-chevron" />
      </Link>
    );
  }

  return (
    <div className="theme-toggle-menu" ref={menuRef}>
      <button
        aria-controls={isOpen ? "header-theme-options" : undefined}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Choose theme. Current theme: ${
          themeLabels[currentTheme]
        }`}
        className="theme-toggle-icon"
        onClick={() => setIsOpen((open) => !open)}
        ref={buttonRef}
        title="Choose theme"
        type="button"
      >
        {currentTheme === "sepia" ? (
          <Moon aria-hidden="true" />
        ) : (
          <Sun aria-hidden="true" />
        )}
      </button>
      {isOpen ? (
        <div
          aria-label="Choose a theme"
          className="theme-popover"
          id="header-theme-options"
          role="dialog"
        >
          <ThemeChoices idPrefix="header-theme" layout="compact" />
        </div>
      ) : null}
    </div>
  );
}

type ThemeChoicesProps = {
  idPrefix: string;
  layout?: "compact" | "list";
};

export function ThemeChoices({
  idPrefix,
  layout = "list",
}: ThemeChoicesProps) {
  const { theme, setAppTheme } = useAppTheme();

  return (
    <fieldset className={`theme-choice-list ${layout}`}>
      <legend className="sr-only">Choose a theme</legend>
      {appThemes.map((option) => (
        <label
          className={`theme-choice${
            theme === option ? " is-selected" : ""
          }`}
          key={option}
        >
          <input
            checked={theme === option}
            id={`${idPrefix}-${option}`}
            name={`${idPrefix}-choice`}
            onChange={() => setAppTheme(option)}
            type="radio"
            value={option}
          />
          <span
            aria-hidden="true"
            className={`theme-choice-swatch ${option}`}
          />
          <span className="theme-choice-copy">
            <strong>{themeLabels[option]}</strong>
            <span>{getThemeDescription(option)}</span>
          </span>
          <span aria-hidden="true" className="theme-choice-indicator" />
        </label>
      ))}
    </fieldset>
  );
}

function getThemeDescription(theme: AppTheme) {
  const descriptions: Record<AppTheme, string> = {
    dark: "Balanced dark colors",
    sepia: "Coconut and softened cream",
    amoled: "True black surfaces",
    midnight: "Deep navy colors",
  };

  return descriptions[theme];
}
