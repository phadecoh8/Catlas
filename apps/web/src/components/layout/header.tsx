import Link from "next/link";
import {
  Bell,
  UserRound,
} from "lucide-react";
import { connection } from "next/server";
import { CatlasLogo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { auth } from "@/lib/auth";

function getGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Africa/Lagos",
    }).format(new Date()),
  );

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export async function AppHeader() {
  await connection();
  const session = await auth();
  const greeting = getGreeting();
  const nameParts = session?.user.name?.trim().split(/\s+/) ?? [];
  const surname = nameParts.at(-1) || "there";

  return (
    <header className="app-global-header">
      <Link aria-label="Catlas home" className="app-brand" href="/home">
        <CatlasLogo className="app-brand-logo" />
        <span>Catlas</span>
      </Link>
      <nav aria-label="Account navigation" className="app-header-actions">
        <span className="app-greeting">
          {greeting}, {surname}
        </span>
        <ThemeToggle />
        <Link aria-label="Notifications" href="/notifications">
          <Bell aria-hidden="true" />
        </Link>
        <Link
          aria-label="Your account"
          className="app-profile-link"
          href="/settings/account"
        >
          <UserRound aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}
