import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeChoices } from "@/components/layout/theme-toggle";

export default function ThemeSettingsPage() {
  return (
    <main className="app-screen information-screen theme-settings-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to settings" href="/settings">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <h1>Theme</h1>
      </div>
      <p className="theme-settings-description">
        Choose the colors you prefer. Your selection is saved on this device.
      </p>
      <ThemeChoices idPrefix="settings-theme" />
    </main>
  );
}
