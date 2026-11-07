import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

type AdminRolePreviewProps = {
  description: string;
  role: string;
  sections: string[];
};

export function AdminRolePreview({
  description,
  role,
  sections,
}: AdminRolePreviewProps) {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-5 py-8 text-[var(--color-text)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)]"
          href="/admin/preview"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          All dashboard previews
        </Link>
        <header className="mt-6 border-b border-[var(--color-border)] pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
            Development preview
          </p>
          <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-bold">
            {role} dashboard
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {description}
          </p>
        </header>
        <section className="mt-8">
          <h2 className="font-[var(--font-heading)] text-xl font-bold">
            Dashboard sections
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <article
                className="flex min-h-24 items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                key={section}
              >
                <h3 className="font-semibold">{section}</h3>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-[var(--color-muted)]"
                />
              </article>
            ))}
          </div>
          <p className="mt-5 rounded-lg border border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]">
            This is a layout preview. Dashboard data and actions are not
            connected yet.
          </p>
        </section>
      </div>
    </main>
  );
}
