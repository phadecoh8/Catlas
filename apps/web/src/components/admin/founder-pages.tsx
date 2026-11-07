import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  FileText,
  MessageSquare,
  School,
  Users,
} from "lucide-react";
import { FounderPageLayout } from "@/components/admin/founder-page-layout";

type PreviewProps = {
  previewMode: boolean;
};

const unavailableMessage =
  "This section is ready for the dashboard data source, which has not been connected yet.";

export function FounderOverview({ previewMode }: PreviewProps) {
  const metrics = [
    {
      label: "Active users",
      value: "Not connected",
      Icon: Users,
    },
    {
      label: "Schools using Catlas",
      value: "Not connected",
      Icon: School,
    },
    {
      label: "Open feedback",
      value: "Not connected",
      Icon: MessageSquare,
    },
    {
      label: "Reported problems",
      value: "Not connected",
      Icon: FileText,
    },
  ];

  return (
    <FounderPageLayout
      previewMode={previewMode}
      subtitle="Platform-wide activity and items that need your attention."
      title="Dashboard"
    >
      <section aria-label="Platform totals" className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, Icon }) => (
            <article
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              key={label}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[var(--color-muted)]">
                  {label}
                </span>
                <Icon
                  aria-hidden="true"
                  className="h-5 w-5 text-[var(--color-primary)]"
                />
              </div>
              <p className="mt-5 text-xl font-semibold">{value}</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Awaiting connected records
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="font-[var(--font-heading)] text-xl font-bold">
            Platform overview
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {unavailableMessage}
          </p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="font-[var(--font-heading)] text-xl font-bold">
            Founder tasks
          </h2>
          <ul className="mt-4 grid gap-3">
            <QuickLink href="/admin/founder/schools" label="Review schools" />
            <QuickLink href="/admin/founder/feedback" label="Review feedback" />
            <QuickLink href="/admin/founder/reports" label="Review reported problems" />
            <QuickLink href="/admin/founder/audit-log" label="Open audit log" />
          </ul>
        </article>
      </section>
      {previewMode && (
        <p className="mt-6 text-sm text-[var(--color-muted)]">
          This is a layout preview. No real account or school totals are being
          loaded.
        </p>
      )}
    </FounderPageLayout>
  );
}

export function FounderSchoolsPage({ previewMode }: PreviewProps) {
  return (
    <FounderPageLayout
      previewMode={previewMode}
      subtitle="Schools and their active user totals, faculties, and departments."
      title="Schools"
    >
      <section className="mt-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-[var(--font-heading)] text-xl font-bold">
              School directory
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Open a school to review its faculties, departments, and user
              counts.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">School</th>
                <th className="px-4 py-3 font-semibold">Active users</th>
                <th className="px-4 py-3 font-semibold">Faculties</th>
                <th className="px-4 py-3 font-semibold">Departments</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="px-4 py-8 text-center text-[var(--color-muted)]"
                  colSpan={5}
                >
                  School records will appear here when the school data source is
                  connected.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-3">
            <Building2
              aria-hidden="true"
              className="h-5 w-5 text-[var(--color-primary)]"
            />
            <h2 className="font-semibold">School structure</h2>
          </div>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Each school will expand to show its faculties, then departments,
            with active user totals at each level.
          </p>
        </div>
      </section>
    </FounderPageLayout>
  );
}

export function FounderFeedbackPage({ previewMode }: PreviewProps) {
  return (
    <CollectionPage
      columns={["Submitted", "School", "Category", "Status"]}
      description="Feedback from the student app will appear here, including level correction requests."
      emptyMessage="No feedback records are available yet. The user feedback API is not connected."
      previewMode={previewMode}
      title="Feedback"
    />
  );
}

export function FounderProblemsPage({ previewMode }: PreviewProps) {
  return (
    <CollectionPage
      columns={["Reported", "School", "Problem type", "Location", "Status"]}
      description="Review app bug reports and route location reports to the relevant school."
      emptyMessage="No problem reports are available yet. The reports API is not connected."
      previewMode={previewMode}
      title="Reported problems"
    />
  );
}

export function FounderAuditLogPage({ previewMode }: PreviewProps) {
  return (
    <CollectionPage
      columns={["Time", "Actor", "Action", "Record", "School"]}
      description="Review platform actions and administrative changes across schools."
      emptyMessage="Audit entries will appear here when the audit log is connected."
      previewMode={previewMode}
      title="Audit log"
    />
  );
}

export function FounderNewsletterPage({ previewMode }: PreviewProps) {
  return (
    <CollectionPage
      columns={["Email", "Status", "Subscribed", "Confirmed"]}
      description="View newsletter subscribers and their double opt-in status."
      emptyMessage="Newsletter subscribers will appear here when the subscriber data source is connected."
      previewMode={previewMode}
      title="Newsletter subscribers"
    />
  );
}

function CollectionPage({
  columns,
  description,
  emptyMessage,
  previewMode,
  title,
}: PreviewProps & {
  columns: string[];
  description: string;
  emptyMessage: string;
  title: string;
}) {
  return (
    <FounderPageLayout
      previewMode={previewMode}
      subtitle={description}
      title={title}
    >
      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[var(--font-heading)] text-xl font-bold">
            {title}
          </h2>
          <span className="text-sm text-[var(--color-muted)]">
            Data connection pending
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
              <tr>
                {columns.map((column) => (
                  <th className="px-4 py-3 font-semibold" key={column}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="px-4 py-10 text-center text-[var(--color-muted)]"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </FounderPageLayout>
  );
}

function QuickLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <li>
      <Link
        className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3 text-sm font-medium hover:bg-[var(--color-bg)]"
        href={href}
      >
        {label}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </li>
  );
}
