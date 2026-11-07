"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  Eye,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquare,
  Newspaper,
  School,
  Send,
  ScrollText,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/founder",
    Icon: LayoutDashboard,
  },
  {
    label: "Waitlist",
    href: "/admin/founder/waitlist",
    Icon: Mail,
  },
  {
    label: "Schools",
    href: "/admin/founder/schools",
    Icon: School,
  },
  {
    label: "Feedback",
    href: "/admin/founder/feedback",
    Icon: MessageSquare,
  },
  {
    label: "Reported problems",
    href: "/admin/founder/reports",
    Icon: AlertTriangle,
  },
  {
    label: "Audit log",
    href: "/admin/founder/audit-log",
    Icon: ScrollText,
  },
  {
    label: "Newsletter subscribers",
    href: "/admin/founder/newsletter",
    Icon: Newspaper,
  },
  {
    label: "Newsletter updates",
    href: "/admin/founder/newsletter-updates",
    Icon: Send,
  },
];

type FounderAdminShellProps = {
  children: React.ReactNode;
  previewMode?: boolean;
};

export function FounderAdminShell({
  children,
  previewMode = false,
}: FounderAdminShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] md:flex">
      <header className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 md:hidden">
        <button
          aria-controls="founder-sidebar"
          aria-expanded={isSidebarOpen}
          aria-label={
            isSidebarOpen ? "Close navigation menu" : "Open navigation menu"
          }
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-[var(--color-bg)]"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          type="button"
        >
          {isSidebarOpen ? (
            <X aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Menu aria-hidden="true" className="h-5 w-5" />
          )}
        </button>
        <span className="font-[var(--font-heading)] font-bold">
          Catlas administration
        </span>
      </header>

      {isSidebarOpen && (
        <button
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-transform duration-200 md:static md:min-h-screen md:w-64 md:shrink-0 md:translate-x-0 md:p-5 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        id="founder-sidebar"
      >
        <Link
          aria-label="Catlas admin home"
          className="flex items-center gap-3 px-2 py-2"
          href="/admin/founder"
        >
          <Image
            alt=""
            className="h-10 w-10 rounded-lg object-contain"
            height={40}
            priority
            src="/logo.png"
            width={40}
          />
          <span className="font-[var(--font-heading)] text-xl font-bold">
            Catlas
          </span>
        </Link>
        <div
          aria-hidden="true"
          className="my-5 border-t border-[var(--color-border)]"
        />
        <nav aria-label="Founder dashboard">
          <ul className="grid grid-cols-1 gap-2">
            {previewMode && (
              <li>
                <SidebarLink
                  active={pathname === "/admin/preview"}
                  href="/admin/preview"
                  Icon={Eye}
                  label="Dashboard previews"
                  onClick={() => setIsSidebarOpen(false)}
                />
              </li>
            )}
            {navigation.map(({ label, href, Icon }) => {
              const isActive =
                href === "/admin/founder"
                  ? pathname === href
                  : pathname === href || pathname.startsWith(`${href}/`);

              return (
                <li key={label}>
                  <SidebarLink
                    active={isActive}
                    href={href}
                    Icon={Icon}
                    label={label}
                    onClick={() => setIsSidebarOpen(false)}
                  />
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0 flex-1 px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}

function SidebarLink({
  active,
  href,
  Icon,
  label,
  onClick,
}: {
  active: boolean;
  href: string;
  Icon: typeof LayoutDashboard;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-[var(--color-primary)] text-white"
          : "text-[var(--color-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
      }`}
      href={href}
      onClick={onClick}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
