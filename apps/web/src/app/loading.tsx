import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main
      aria-live="polite"
      className="flex min-h-screen items-center justify-center gap-3 bg-[var(--color-bg)] text-[var(--color-text)]"
      role="status"
    >
      <LoaderCircle
        aria-hidden="true"
        className="animate-spin text-[var(--color-primary)]"
        size={22}
      />
      <span>Loading...</span>
    </main>
  );
}
