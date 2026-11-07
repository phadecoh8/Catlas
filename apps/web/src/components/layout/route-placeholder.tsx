import Link from "next/link";

type RoutePlaceholderProps = {
  title: string;
};

export function RoutePlaceholder({ title }: RoutePlaceholderProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-5 py-12 text-[var(--color-text)]">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
        Catlas
      </p>
      <h1 className="mt-3 font-[var(--font-heading)] text-3xl font-bold">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-[var(--color-muted)]">
        This page is not implemented yet.
      </p>
      <Link
        className="mt-6 w-fit rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--color-surface)]"
        href="/home"
      >
        Back to Catlas
      </Link>
    </main>
  );
}
