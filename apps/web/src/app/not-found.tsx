import Link from "next/link";
import { CryingCat } from "@/components/cats/crying-cat";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] px-6 text-center text-[var(--color-text)]">
      <CryingCat
        size={140}
        variant="searching"
      />
      <p className="text-sm font-bold text-[var(--color-error-text)]">404</p>
      <h1 className="font-[var(--font-heading)] text-3xl font-bold">
        Page not found
      </h1>
      <p className="max-w-sm text-[var(--color-muted)]">
        The cat looked everywhere, but it could not find the page you
        requested.
      </p>
      <Link
        className="rounded-md bg-[var(--color-primary)] px-5 py-3 font-bold text-white hover:bg-[var(--color-primary-hover)]"
        href="/home"
      >
        Go to home
      </Link>
    </main>
  );
}
