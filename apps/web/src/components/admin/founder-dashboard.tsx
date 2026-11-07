"use client";

import {
  useEffect,
  useState,
} from "react";
import { signOut as authSignOut } from "next-auth/react";
import { FounderAdminShell } from "@/components/admin/founder-admin-shell";

type WaitlistEntry = {
  id: string;
  name: string;
  school: string;
  faculty: string;
  department: string;
  level: string;
  email: string;
  created_at: string;
};

type DashboardState =
  | {
      kind: "loading";
    }
  | {
      kind: "sign-in";
    }
  | {
      kind: "error";
      message: string;
    }
  | {
      kind: "ready";
      entries: WaitlistEntry[];
    };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(new Date(value));
}

export function FounderDashboard({
  previewMode = false,
}: {
  previewMode?: boolean;
}) {
  const [state, setState] = useState<DashboardState>({
    kind: "loading",
  });

  useEffect(() => {
    if (previewMode) {
      setState({
        kind: "ready",
        entries: [],
      });
      return;
    }

    let isMounted = true;

    async function loadWaitlist() {
      try {
        const response = await fetch("/api/founder/waitlist", {
          cache: "no-store",
        });
        const result = (await response.json()) as {
          entries?: WaitlistEntry[];
          message?: string;
        };

        if (!isMounted) {
          return;
        }

        if (response.status === 401 || response.status === 403) {
          setState({
            kind: "sign-in",
          });
          return;
        }

        if (!response.ok) {
          setState({
            kind: "error",
            message: result.message ?? "We could not load waitlist entries.",
          });
          return;
        }

        setState({
          kind: "ready",
          entries: result.entries ?? [],
        });
      } catch {
        if (isMounted) {
          setState({
            kind: "error",
            message: "We could not load waitlist entries.",
          });
        }
      }
    }

    void loadWaitlist();

    return () => {
      isMounted = false;
    };
  }, [previewMode]);

  async function signOut() {
    await authSignOut({
      redirectTo: "/admin/login",
    });
  }

  if (state.kind === "loading") {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] text-[var(--color-muted)]"
        role="status"
      >
        Loading waitlist...
      </main>
    );
  }

  if (state.kind === "sign-in") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] px-5 text-center text-[var(--color-text)]">
        <h1 className="font-[var(--font-heading)] text-3xl font-bold">
          Founder sign in required
        </h1>
        <a
          className="rounded-md bg-[var(--color-primary)] px-5 py-3 font-bold text-white hover:bg-[var(--color-primary-hover)]"
          href="/admin/founder/login"
        >
          Go to sign in
        </a>
      </main>
    );
  }

  if (state.kind === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-5 text-center text-[var(--color-error-text)]">
        {state.message}
      </main>
    );
  }

  return (
    <FounderAdminShell previewMode={previewMode}>
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
                Catlas administration
              </p>
              <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-bold">
                Waitlist
              </h1>
            </div>
            {previewMode ? (
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-muted)]">
                Preview data
              </span>
            ) : (
              <button
                className="min-h-10 rounded-md border border-[var(--color-border)] px-4 text-sm font-semibold hover:bg-[var(--color-surface)]"
                onClick={signOut}
                type="button"
              >
                Sign out
              </button>
            )}
          </header>

          <section className="mt-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-[var(--font-heading)] text-2xl font-bold">
                  Sign-ups
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {state.entries.length} sign-ups
                </p>
              </div>
            </div>

            {state.entries.length === 0 ? (
              <p className="rounded-lg border border-[var(--color-border)] p-6 text-sm text-[var(--color-muted)]">
                {previewMode
                  ? "Waitlist records are not loaded in dashboard preview mode."
                  : "There are no waitlist sign-ups yet."}
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
                <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                  <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">School</th>
                      <th className="px-4 py-3 font-semibold">Faculty</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Level</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.entries.map((entry) => (
                      <tr
                        className="border-t border-[var(--color-border)]"
                        key={entry.id}
                      >
                        <td className="px-4 py-3">{entry.name}</td>
                        <td className="px-4 py-3">{entry.school}</td>
                        <td className="px-4 py-3">{entry.faculty}</td>
                        <td className="px-4 py-3">{entry.department}</td>
                        <td className="px-4 py-3">{entry.level}</td>
                        <td className="px-4 py-3">{entry.email}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          {formatDate(entry.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
    </FounderAdminShell>
  );
}
