"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] px-6 text-center text-[var(--color-text)]">
      <h1 className="font-[var(--font-heading)] text-3xl font-bold">
        Something went wrong
      </h1>
      <p className="max-w-sm text-[var(--color-error-text)]">
        We could not load this page. Please try again.
      </p>
      <button
        className="rounded-md bg-[var(--color-primary)] px-5 py-3 font-bold text-white hover:bg-[var(--color-primary-hover)]"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </main>
  );
}
