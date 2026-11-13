"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronDown, Circle, Download, Pause, Play, Trash2 } from "lucide-react";
import { FounderPageLayout } from "@/components/admin/founder-page-layout";
import {
  clearSiteActivity,
  getSiteActivity,
  subscribeToSiteActivity,
  type SiteActivity,
  type SiteActivityType,
} from "@/lib/site-activity";

type Filter = "ALL" | SiteActivityType;

const filters: { label: string; value: Filter }[] = [
  { label: "All events", value: "ALL" },
  { label: "Page views", value: "PAGE_VIEW" },
  { label: "Clicks", value: "CLICK" },
  { label: "Form activity", value: "FORM_SUBMIT" },
];

const typeStyles: Record<SiteActivityType, string> = {
  PAGE_VIEW: "text-sky-300",
  CLICK: "text-emerald-300",
  FORM_SUBMIT: "text-amber-300",
};

function formatTime(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
}

export default function AuditLogPage() {
  const [entries, setEntries] = useState<SiteActivity[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [live, setLive] = useState(true);

  useEffect(() => {
    const refresh = () => setEntries(getSiteActivity());
    refresh();
    return subscribeToSiteActivity(refresh);
  }, []);

  const visibleEntries = useMemo(
    () => (filter === "ALL" ? entries : entries.filter((entry) => entry.type === filter)),
    [entries, filter],
  );

  function downloadLog() {
    const contents = entries
      .map(
        (entry) =>
          `${entry.timestamp}\t${entry.type}\t${entry.route}\t${entry.detail}`,
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([contents], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "catlas-activity.log";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <FounderPageLayout
      subtitle="A live terminal feed of navigation and interactions across this browser."
      title="Audit log"
    >
      <section className="mt-8 space-y-5" aria-label="Website activity terminal">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Captured events" value={entries.length.toString().padStart(3, "0")} />
          <Stat label="Current page" value={typeof window === "undefined" ? "—" : window.location.pathname} />
          <Stat label="Feed status" value={live ? "LIVE" : "PAUSED"} active={live} />
        </div>

        <div className="overflow-hidden rounded-xl border border-emerald-400/20 bg-[#050b09] shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-400/15 bg-[#0a120e] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="flex gap-1.5" aria-hidden="true">
                <i className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <i className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <i className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-emerald-100/70">catlas@activity-monitor</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300/70">
              <span className={`h-1.5 w-1.5 rounded-full ${live ? "animate-pulse bg-emerald-400" : "bg-amber-300"}`} />
              {live ? "Live stream" : "Stream paused"}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-400/10 px-4 py-3 sm:px-5">
            <label className="relative flex items-center gap-2 font-mono text-xs text-emerald-100/60">
              <span className="sr-only">Filter audit events</span>
              <Activity aria-hidden="true" className="h-4 w-4 text-emerald-300/70" />
              <select
                className="appearance-none bg-transparent py-1 pr-6 text-emerald-100 outline-none"
                onChange={(event) => setFilter(event.target.value as Filter)}
                value={filter}
              >
                {filters.map((option) => (
                  <option className="bg-[#0a120e]" key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-0 h-3.5 w-3.5" />
            </label>
            <div className="flex items-center gap-2">
              <TerminalButton
                label={live ? "Pause feed" : "Resume feed"}
                onClick={() => setLive(!live)}
              >
                {live ? <Pause /> : <Play />}
              </TerminalButton>
              <TerminalButton label="Download log" onClick={downloadLog}>
                <Download />
              </TerminalButton>
              <TerminalButton label="Clear log" onClick={clearSiteActivity}>
                <Trash2 />
              </TerminalButton>
            </div>
          </div>

          <div className="max-h-[560px] min-h-[300px] overflow-auto px-4 py-4 font-mono text-xs sm:px-5">
            {visibleEntries.length ? (
              <ol className="space-y-2" aria-live={live ? "polite" : "off"}>
                {visibleEntries.map((entry) => (
                  <li className="grid grid-cols-[auto_auto_1fr] items-start gap-x-3 gap-y-1 leading-relaxed" key={entry.id}>
                    <time className="text-emerald-100/40" dateTime={entry.timestamp}>
                      {formatTime(entry.timestamp)}
                    </time>
                    <span className={`font-bold ${typeStyles[entry.type]}`}>
                      {entry.type}
                    </span>
                    <span className="break-all text-emerald-50/85">
                      <span className="text-emerald-300/60">{entry.route}</span>
                      <span className="px-2 text-emerald-400/40">›</span>
                      {entry.detail}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="flex min-h-[250px] flex-col items-center justify-center gap-3 text-center text-emerald-100/45">
                <span className="text-2xl text-emerald-300/50">&gt;_</span>
                <p className="m-0">No matching events. Browse the site to populate this feed.</p>
                <p className="m-0 text-[10px] text-emerald-100/30">Only page and interaction labels are recorded—never form field values.</p>
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 text-emerald-300/70" aria-hidden="true">
              <span className="text-emerald-400">$</span>
              <span>monitoring site activity</span>
              {live && <span className="h-3 w-1.5 animate-pulse bg-emerald-300" />}
            </div>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-emerald-400/10 bg-[#080f0c] px-4 py-2.5 font-mono text-[10px] text-emerald-100/35 sm:px-5">
            <span>CLIENT-SIDE FEED · THIS BROWSER ONLY</span>
            <span>MAX {entries.length}/300 EVENTS</span>
          </footer>
        </div>
        <p className="text-xs text-[var(--color-muted)]">
          This feed is stored in this browser and is not a centralized server audit trail. Form contents and passwords are never recorded.
        </p>
      </section>
    </FounderPageLayout>
  );
}

function Stat({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="mb-2 text-xs text-[var(--color-muted)]">{label}</p>
      <p className="flex items-center gap-2 font-mono text-lg font-semibold">
        {active && <Circle aria-hidden="true" className="h-2 w-2 fill-emerald-400 text-emerald-400" />}
        {value}
      </p>
    </article>
  );
}

function TerminalButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded border border-emerald-300/15 text-emerald-200/60 transition hover:border-emerald-300/40 hover:bg-emerald-300/10 hover:text-emerald-100"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
