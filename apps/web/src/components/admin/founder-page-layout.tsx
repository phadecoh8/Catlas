"use client";

import { signOut } from "next-auth/react";
import { FounderAdminShell } from "@/components/admin/founder-admin-shell";

type FounderPageLayoutProps = {
  children: React.ReactNode;
  previewMode?: boolean;
  subtitle: string;
  title: string;
};

export function FounderPageLayout({
  children,
  previewMode = false,
  subtitle,
  title,
}: FounderPageLayoutProps) {
  async function handleSignOut() {
    await signOut({
      redirectTo: "/admin/login",
    });
  }

  return (
    <FounderAdminShell previewMode={previewMode}>
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              Founder administration
            </p>
            <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-bold">
              {title}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {subtitle}
            </p>
          </div>
          {previewMode ? (
            <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-muted)]">
              Preview data
            </span>
          ) : (
            <button
              className="min-h-10 rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--color-surface)]"
              onClick={handleSignOut}
              type="button"
            >
              Sign out
            </button>
          )}
        </header>
        {children}
      </div>
    </FounderAdminShell>
  );
}
