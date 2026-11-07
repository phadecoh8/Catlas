import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  UserRound,
} from "lucide-react";
import { connection } from "next/server";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { mockUser } from "@/lib/mock-user";

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
  const greeting = getGreeting();

  return (
    <header className="app-global-header">
      <Link aria-label="Catlas home" className="app-brand" href="/home">
        <Image
          alt=""
          className="app-brand-logo"
          height={38}
          priority
          src="/logo.png"
          width={38}
        />
        <span>Catlas</span>
      </Link>
      <nav aria-label="Account navigation" className="app-header-actions">
        <span className="app-greeting">
          {greeting}, {mockUser.surname}
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
