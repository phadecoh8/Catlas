"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowDownRight, Download, Maximize2, Pause, Play, Trash2, X } from "lucide-react";

type Category = "auth" | "ai" | "enrollment" | "admin_action" | "system" | "console";
type Severity = "info" | "warn" | "critical";
type AuditEvent = {
  id: string;
  category: Category;
  severity: Severity;
  result: "ok" | "failed";
  actor_role: string;
  actor_ref: string;
  action: string;
  summary: string;
  created_at: string;
};
type Line = { id: number; text: string; tone?: "muted" | "error" | "success" };
type Filter = "ALL" | Category;

const API = "/api/founder/console";
const categories: { label: string; value: Filter }[] = [
  { label: "all events", value: "ALL" },
  { label: "authentication", value: "auth" },
  { label: "AI service", value: "ai" },
  { label: "enrollment", value: "enrollment" },
  { label: "admin actions", value: "admin_action" },
  { label: "system", value: "system" },
  { label: "console", value: "console" },
];
const commands = ["help", "clear", "date", "pwd", "ls", "whoami", "status", "events", "schools", "users", "waitlist", "students", "jobs", "quota", "reports", "filter", "zoom", "echo", "/q"];
const categoryStyle: Record<Category, string> = {
  auth: "text-cyan-300", ai: "text-violet-300", enrollment: "text-amber-300",
  admin_action: "text-emerald-300", system: "text-slate-300", console: "text-blue-300",
};
const severityStyle: Record<Severity, string> = {
  info: "text-slate-400", warn: "text-amber-300", critical: "text-red-400",
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(new Date(value));
}

function parseInput(value: string) {
  return (value.trim().match(/(?:[^\s"]+|"[^"]*")+/g) ?? []).map((part) => part.replace(/^"|"$/g, ""));
}

export default function AuditLogPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const lineId = useRef(2);
  const requestInFlight = useRef(false);
  const hiddenBefore = useRef<string | null>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [live, setLive] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [feedError, setFeedError] = useState("");
  const [lines, setLines] = useState<Line[]>([
    { id: 1, text: "CATLAS IMPORTANT EVENTS CONSOLE", tone: "success" },
    { id: 2, text: 'Type "help" for commands. Use /q to exit.', tone: "muted" },
  ]);

  const appendLine = useCallback((text: string, tone?: Line["tone"]) => {
    lineId.current += 1;
    setLines((current) => [...current, { id: lineId.current, text, tone }].slice(-200));
  }, []);

  const refreshEvents = useCallback(async () => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    try {
      const response = await fetch(`${API}?since=30d`, { cache: "no-store" });
      const body = await response.json() as { events?: AuditEvent[]; message?: string };
      if (!response.ok) {
        setFeedError(body.message ?? "Audit feed could not be loaded.");
        return;
      }
      setFeedError("");
      setEvents((body.events ?? []).filter((item) => !hiddenBefore.current || item.created_at > hiddenBefore.current));
    } catch {
      setFeedError("Could not reach the server audit feed. Retrying automatically.");
    } finally {
      requestInFlight.current = false;
    }
  }, []);

  useEffect(() => { void refreshEvents(); }, [refreshEvents]);
  useEffect(() => {
    if (!live) return;
    const timer = window.setInterval(() => void refreshEvents(), 5000);
    return () => window.clearInterval(timer);
  }, [live, refreshEvents]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const visibleEvents = useMemo(
    () => filter === "ALL" ? events : events.filter((event) => event.category === filter),
    [events, filter],
  );

  function leave() { router.push("/admin/founder"); }

  async function runCommand(raw: string) {
    const input = raw.trim();
    if (!input) return;
    setHistory((previous) => [...previous, input].slice(-50));
    setHistoryIndex(-1);
    appendLine(`founder@catlas:~$ ${input}`);
    const [name = "", ...args] = parseInput(input);
    const cmd = name.toLowerCase();
    const argument = args.join(" ");

    if (["/q", "quit", "exit"].includes(cmd)) { leave(); return; }
    if (cmd === "help") {
      const help: Record<string, string> = {
        help: "help [command] — show command help",
        clear: "clear — clear this display only; saved audit records remain untouched",
        date: "date — current local date/time", pwd: "pwd — current route",
        ls: "ls — list console resources", whoami: "whoami — current role",
        status: "status — database and API connectivity",
        events: "events [category] [--since 24h] — saved audit events",
        schools: "schools — school list", users: "users <school-slug> — registered profiles by role",
        waitlist: "waitlist — waitlist count", students: "students <school> — student report (source pending)",
        jobs: "jobs — job status (source pending)", quota: "quota — provider quotas (source pending)",
        reports: "reports <school> — open reports (source pending)",
        filter: "filter [all|auth|ai|enrollment|admin_action|system|console]",
        zoom: "zoom [in|out|reset|50-150] — scales the entire terminal", echo: "echo <text> — print text locally",
        "/q": "/q — return to founder dashboard",
      };
      const key = args[0]?.toLowerCase();
      appendLine(key ? help[key] ?? `No help for ${key}.` : Object.values(help).join("\n"), key && !help[key] ? "error" : "success");
      return;
    }
    if (cmd === "clear") { hiddenBefore.current = new Date().toISOString(); setEvents([]); setLines([]); return; }
    if (cmd === "date") { appendLine(new Date().toString()); return; }
    if (cmd === "pwd") { appendLine(window.location.pathname); return; }
    if (cmd === "ls") { appendLine("audit-events  schools  users  waitlist  jobs  quota  reports"); return; }
    if (cmd === "whoami") { appendLine("founder · MFA session"); return; }
    if (cmd === "echo") { appendLine(argument); return; }
    if (cmd === "zoom") {
      if (argument === "in") setZoom((value) => Math.min(150, value + 10));
      else if (argument === "out") setZoom((value) => Math.max(50, value - 10));
      else if (argument === "reset") setZoom(100);
      else if (/^\d{2,3}$/.test(argument) && Number(argument) >= 50 && Number(argument) <= 150) setZoom(Number(argument));
      else appendLine("Usage: zoom [in|out|reset|50-150]", "error");
      return;
    }
    if (cmd === "filter") {
      const map: Record<string, Filter> = { all: "ALL", auth: "auth", ai: "ai", enrollment: "enrollment", admin: "admin_action", admin_action: "admin_action", system: "system", console: "console" };
      const selected = map[argument.toLowerCase()];
      if (!selected) appendLine("Usage: filter [all|auth|ai|enrollment|admin_action|system|console]", "error");
      else { setFilter(selected); appendLine(`filter set to ${argument.toLowerCase()}`, "success"); }
      return;
    }
    if (!["status", "events", "schools", "users", "waitlist", "students", "jobs", "quota", "reports"].includes(cmd)) {
      appendLine(`command not found: ${name}. Type "help" for supported commands.`, "error");
      return;
    }
    try {
      const response = await fetch(API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd, args }), cache: "no-store",
      });
      const body = await response.json() as { lines?: string[]; message?: string };
      if (!response.ok) { appendLine(body.message ?? `Command failed (${response.status}).`, "error"); return; }
      for (const line of body.lines ?? []) appendLine(line, "success");
      if (cmd === "events") await refreshEvents();
    } catch {
      appendLine("Could not reach the console API. Check server configuration and try again.", "error");
    }
  }

  function downloadLog() {
    const text = events.map((event) => `${event.created_at}\t${event.severity}\t${event.result}\t${event.category}\t${event.actor_role}-${event.actor_ref}\t${event.action}\t${event.summary}`).join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "catlas-audit-events.log";
    link.click();
    URL.revokeObjectURL(url);
  }

  function onCommandKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") { event.preventDefault(); void runCommand(command); setCommand(""); }
    else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const index = Math.max(0, historyIndex < 0 ? history.length - 1 : historyIndex - 1);
      setHistoryIndex(index); setCommand(history[index]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault(); const index = historyIndex + 1;
      setHistoryIndex(index); setCommand(index >= history.length ? "" : history[index]);
    } else if (event.key === "Tab") {
      event.preventDefault(); const parts = command.split(/\s+/);
      if (parts.length <= 1) {
        const matches = commands.filter((item) => item.startsWith(parts[0] ?? ""));
        if (matches.length === 1) setCommand(matches[0]);
        else if (matches.length > 1) appendLine(matches.join("  "), "muted");
      }
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") {
      event.preventDefault(); hiddenBefore.current = new Date().toISOString(); setEvents([]); setLines([]);
    }
  }

  const scale = zoom / 100;
  const shellSize = `${100 / scale}%`;

  return (
    <main aria-label="Catlas audit terminal viewport" className="fixed inset-0 z-[100] overflow-hidden bg-[#030806] font-mono text-emerald-100 selection:bg-emerald-400/30">
      <div
        className="flex min-h-0 flex-col overflow-hidden bg-[#030806]"
        style={{ width: shellSize, height: shellSize, zoom: scale }}
      >
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-emerald-400/20 bg-[#07100b] px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex gap-1.5" aria-hidden="true"><i className="h-2.5 w-2.5 rounded-full bg-red-400" /><i className="h-2.5 w-2.5 rounded-full bg-amber-300" /><i className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>
            <div className="min-w-0"><p className="truncate text-xs font-bold tracking-wider text-emerald-100">CATLAS // IMPORTANT EVENTS</p><p className="text-[10px] text-emerald-100/40">founder@catlas:~</p></div>
          </div>
          <div className="flex items-center gap-2">
            <label className="hidden text-[10px] uppercase tracking-widest text-emerald-100/45 sm:block" htmlFor="feed-status">Feed</label>
            <select aria-label="Feed status" className="rounded border border-emerald-300/20 bg-[#07100b] px-2 py-1.5 text-[10px] text-emerald-100 outline-none focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/20" id="feed-status" onChange={(event) => setLive(event.target.value === "live")} value={live ? "live" : "paused"}><option className="bg-[#07100b]" value="live">LIVE</option><option className="bg-[#07100b]" value="paused">PAUSED</option></select>
            <button aria-label="Zoom out" className="terminal-control" onClick={() => setZoom((value) => Math.max(50, value - 10))} type="button">−</button>
            <span className="min-w-10 text-center text-[10px] text-emerald-100/60">{zoom}%</span>
            <button aria-label="Zoom in" className="terminal-control" onClick={() => setZoom((value) => Math.min(150, value + 10))} type="button">+</button>
            <button aria-label="Reset zoom" className="terminal-control hidden sm:flex" onClick={() => setZoom(100)} type="button"><Maximize2 className="h-3.5 w-3.5" /></button>
            <button aria-label="Exit terminal (/q)" className="terminal-control ml-1" onClick={leave} type="button"><X className="h-4 w-4" /></button>
          </div>
        </header>
        <section className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-emerald-400/15 lg:border-b-0 lg:border-r">
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-emerald-400/10 px-4 py-2.5 sm:px-6">
              <div className="flex items-center gap-2 text-[10px] text-emerald-100/55"><Activity className="h-3.5 w-3.5 text-emerald-300/70" /><span>SAVED AUDIT EVENTS</span><span className="text-emerald-100/25">·</span><span>{events.length}/300</span></div>
              <div className="flex flex-wrap items-center gap-2"><label className="sr-only" htmlFor="audit-filter">Filter event type</label><select className="max-w-36 rounded border border-emerald-300/20 bg-[#07100b] px-2 py-1.5 text-[10px] text-emerald-100 outline-none focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/20" id="audit-filter" onChange={(event) => setFilter(event.target.value as Filter)} value={filter}>{categories.map((option) => <option className="bg-[#07100b]" key={option.value} value={option.value}>{option.label}</option>)}</select>
                <button aria-label={live ? "Pause feed" : "Resume feed"} className="terminal-control" onClick={() => setLive(!live)} type="button">{live ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}</button><button aria-label="Download log" className="terminal-control" onClick={downloadLog} type="button"><Download className="h-3.5 w-3.5" /></button><button aria-label="Clear displayed screen, preserve saved events" className="terminal-control" onClick={() => { hiddenBefore.current = new Date().toISOString(); setEvents([]); setLines([]); }} type="button"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto px-4 py-3 sm:px-6">
              {feedError && <p className="mb-3 text-xs text-amber-300" role="status">{feedError}</p>}
              {visibleEvents.length ? <ol className="space-y-2" aria-live={live ? "polite" : "off"}>{visibleEvents.map((event) => <li className="grid grid-cols-[auto_auto_auto_1fr] items-start gap-x-3 gap-y-1 text-[11px] leading-relaxed sm:text-xs" key={event.id}><time className="text-emerald-100/35" dateTime={event.created_at}>{formatTime(event.created_at)}</time><span className={`font-bold ${severityStyle[event.severity]}`}>{event.severity.toUpperCase()}</span><span className={`font-bold ${categoryStyle[event.category]}`}>{event.category.toUpperCase()}</span><span className="break-all text-emerald-50/80"><span className="text-emerald-300/55">{event.actor_role}-{event.actor_ref}</span><span className="px-2 text-emerald-400/35">›</span><span className={event.result === "failed" ? "text-red-300" : "text-emerald-300"}>{event.result.toUpperCase()}</span><span className="px-2 text-emerald-400/35">›</span>{event.action}: {event.summary}</span></li>)}</ol> : <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center text-xs text-emerald-100/40"><p className="m-0">{feedError ? "Server audit events unavailable." : "No saved audit events to display."}</p><p className="m-0 text-[10px]">Routine page views and clicks are intentionally excluded.</p></div>}
            </div>
            <footer className="shrink-0 border-t border-emerald-400/10 px-4 py-2 text-[9px] text-emerald-100/30 sm:px-6">SERVER AUDIT STORE · CLEAR ONLY HIDES SCREEN · {live ? "AUTO-REFRESH 5S" : "PAUSED"}</footer>
          </div>
          <aside className="flex min-h-[38vh] w-full shrink-0 flex-col bg-[#040a07] lg:min-h-0 lg:w-[min(42%,520px)]">
            <div className="flex shrink-0 items-center justify-between border-b border-emerald-400/10 px-4 py-2.5 sm:px-5"><span className="text-[10px] tracking-widest text-emerald-100/55">CONSOLE OUTPUT</span><button aria-label="Clear console output" className="terminal-control" onClick={() => setLines([])} type="button"><Trash2 className="h-3.5 w-3.5" /></button></div>
            <div className="min-h-0 flex-1 space-y-1 overflow-auto px-4 py-3 text-[11px] leading-relaxed sm:px-5" aria-live="polite">{lines.map((line) => <p className={`m-0 whitespace-pre-wrap break-words ${line.tone === "error" ? "text-red-300" : line.tone === "success" ? "text-emerald-300" : line.tone === "muted" ? "text-emerald-100/45" : "text-emerald-100/80"}`} key={line.id}>{line.text}</p>)}<div className="flex items-center gap-2 text-emerald-300/60" aria-hidden="true"><ArrowDownRight className="h-3 w-3" /><span>ready</span></div></div>
            <form className="flex shrink-0 items-center gap-2 border-t border-emerald-400/15 px-4 py-3 sm:px-5" onSubmit={(event) => { event.preventDefault(); void runCommand(command); setCommand(""); }}><label className="shrink-0 text-xs text-emerald-400" htmlFor="terminal-command">$</label><input autoComplete="off" className="min-w-0 flex-1 bg-transparent text-xs text-emerald-100 outline-none placeholder:text-emerald-100/25" id="terminal-command" onChange={(event) => setCommand(event.target.value)} onKeyDown={onCommandKeyDown} placeholder="help, schools, users <slug>..." ref={inputRef} spellCheck={false} value={command} /><span className="hidden text-[9px] text-emerald-100/25 sm:inline">ENTER</span></form>
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-emerald-400/10 px-4 py-2 text-[9px] text-emerald-100/35 sm:px-5"><span>SERVER ALLOW-LIST COMMANDS ONLY</span><span>EXIT: /q</span></div>
          </aside>
        </section>
        <style jsx>{`.terminal-control{display:inline-flex;height:28px;min-width:28px;align-items:center;justify-content:center;border:1px solid rgba(110,231,183,.25);border-radius:4px;color:rgba(209,250,229,.78);transition:background 150ms ease,color 150ms ease,border-color 150ms ease}.terminal-control:hover,.terminal-control:focus-visible{border-color:rgba(110,231,183,.55);background:rgba(110,231,183,.1);color:#d1fae5;outline:2px solid rgba(110,231,183,.25);outline-offset:2px}`}</style>
      </div>
    </main>
  );
}
