"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Map,
  PawPrint,
  Presentation,
  Search,
} from "lucide-react";

const tabs = [
  { label: "Home", href: "/home", Icon: House },
  { label: "Search", href: "/search", Icon: Search },
  { label: "Classroom", href: "/classroom", Icon: Presentation },
  { label: "Map", href: "/map", Icon: Map },
  { label: "Catline", href: "/catline", Icon: PawPrint },
];

function getActiveHref(pathname: string) {
  if (pathname.startsWith("/settings") || pathname === "/help") {
    return "/settings";
  }

  if (pathname.startsWith("/map") || pathname.startsWith("/navigate")) {
    return "/map";
  }

  if (pathname.startsWith("/location")) {
    return "/search";
  }

  if (pathname.startsWith("/catline")) {
    return "/catline";
  }

  if (pathname.startsWith("/classroom")) {
    return "/classroom";
  }

  if (pathname.startsWith("/search")) {
    return "/search";
  }

  return "/home";
}

export function AppBottomNav() {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);

  return (
    <nav aria-label="Main navigation" className="app-bottom-nav">
      {tabs.map(({ label, href, Icon }) => {
        const isActive = href === activeHref;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "active" : ""}
            href={href}
            key={href}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
