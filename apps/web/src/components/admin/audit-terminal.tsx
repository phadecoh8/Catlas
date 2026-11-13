"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowDownRight,
  Download,
  Maximize2,
  Pause,
  Play,
  Trash2,
  X,
} from "lucide-react";
import {
  clearSiteActivity,
  getSiteActivity,
  subscribeToSiteActivity,
  type SiteActivity,
  type SiteActivityType,
} from "@/lib/site-activity";

type Filter = "ALL" | SiteActivityType;
type TerminalLine = {
  id: number;
  text: string;
  tone?: "muted" | "error" | "success";
};

const filters: { label: string; value: Filter }[] = [
  { label: "all events", value: "ALL" },
  { label: "authentication", value: "AUTH" },
  { label: "AI service", value: "AI" },
  { label: "enrollment", value: "ENROLLMENT" },
  { label: "admin actions", value: "ADMIN_ACTION" },
  { label: "system", value: "SYSTEM" },
];

const typeStyles: Record<SiteActivityType, string> = {
  AUTH: "text-cyan-300",
  AI: "text-violet-300",
  ENROLLMENT: "text-amber-300",
  ADMIN_ACTION: "text-emerald-300",
  SYSTEM: "text-slate-300",
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
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<SiteActivity[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [live, setLive] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 1, text: "CATLAS IMPORTANT EVENTS CONSOLE", tone: "success" },
    { id: 2, text: 'Type "help" for commands. Use /q to exit.', tone: "muted" },
  ]);
  const lineId = useRef(2);

  useEffect(() => {
    const refresh = () => {
      if (live) setEntries(getSiteActivity());
    };
    setEntries(getSiteActivity());
    return subscribeToSiteActivity(refresh);
  }, [live]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const visibleEntries = useMemo(
    () => (filter === "ALL" ? entries : entries.filter((entry) => entry.type === filter)),
    [entries, filter],
  );

  function appendLine(text: string, tone?: TerminalLine["tone"]) {
    lineId.current += 1;
    setLines((current) => [...current, { id: lineId.current, text, tone }].slice(-100));
  }

  function leaveTerminal() {
    router.push("/admin/founder");
  }

  function runCommand(rawCommand: string) {
    const input = rawCommand.trim();
    if (!input) return;
    setHistory((current) => [...current, input].slice(-50));
    setHistoryIndex(-1);
    appendLine(`founder@catlas:~$ ${input}`);

    const [name, ...args] = input.split(/\s+/);
    const argument = args.join(" ");
    switch (name.toLowerCase()) {
      case "/q":
      case "quit":
      case "exit":
        leaveTerminal();
        return;
      case "help":
        appendLine("help · clear · date · pwd · ls · whoami · status · events · filter [all|auth|ai|enrollment|admin|system] · zoom [in|out|reset|50-150] · echo <text> · /q", "success");
        break;
      case "clear":
        setLines([]);
        break;
      case "date":
        appendLine(new Date().toString());
        break;
      case "pwd":
        appendLine(window.location.pathname);
        break;
      case "ls":
        appendLine("important-events.log  filters/  session.status  help.txt");
        break;
      case "whoami":
        appendLine("founder · Catlas activity monitor");
        break;
      case "status":
        appendLine(`stream=${live ? "live" : "paused"} · events=${entries.length} · filter=${filter.toLowerCase()} · zoom=${zoom}%`);
        break;
      case "events":
        appendLine(`${visibleEntries.length} important event(s) visible (${entries.length} captured).`);
        break;
      case "filter": {
        const filterMap: Record<string, Filter> = {
          all: "ALL",
          auth: "AUTH",
          ai: "AI",
          enrollment: "ENROLLMENT",
          admin: "ADMIN_ACTION",
          system: "SYSTEM",
        };
        const selected = filterMap[argument.toLowerCase()];
        if (!selected) appendLine("Usage: filter [all|auth|ai|enrollment|admin|system]", "error");
        else {
          setFilter(selected);
          appendLine(`filter set to ${argument.toLowerCase()}`, "success");
        }
        break;
      }
      case "zoom": {
        if (argument === "in") setZoom((current) => Math.min(150, current + 10));
        else if (argument === "out") setZoom((current) => Math.max(50, current - 10));
        else if (argument === "reset") setZoom(100);
        else if (/^\d{2,3}$/.test(argument) && Number(argument) >= 50 && Number(argument) <= 150) setZoom(Number(argument));
        else {
          appendLine("Usage: zoom [in|out|reset|50-150]", "error");
          break;
        }
        appendLine("zoom updated", "success");
        break;
      }
      case "echo":
        appendLine(argument || "");
        break;
      default:
        appendLine(`command not found: ${name}. Type "help" for safe console commands.`, "error");
    }
  }

  function downloadLog() {
    const contents = entries
      .map((entry) => `${entry.timestamp}\t${entry.type}\t${entry.route}\t${entry.detail}`)
      .join("\n");
    const url = URL.createObjectURL(new Blob([contents], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "catlas-important-events.log";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      runCommand(command);
      setCommand("");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.max(0, historyIndex < 0 ? history.length - 1 : historyIndex - 1);
      if (history.length) {
        setHistoryIndex(next);
        setCommand(history[next]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setCommand(next >= history.length ? "" : history[next]);
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setLines([]);
    }
  }

  return (
    <main
      aria-label="Catlas audit terminal"
      className="fixed inset-0 z-[100] flex min-h-0 flex-col overflow-hidden bg-[#030806] font-mono text-emerald-100 selection:bg-emerald-400/30"
      style={{ fontSize: `${zoom}%` }}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-emerald-400/20 bg-[#07100b] px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <i className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <i className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold tracking-wider text-emerald-100">CATLAS // IMPORTANT EVENTS</p>
            <p className="text-[10px] text-emerald-100/40">founder@catlas:~</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="hidden text-[10px] uppercase tracking-widest text-emerald-100/45 sm:block" htmlFor="feed-status">Feed</label>
          <select
            aria-label="Feed status"
            className="rounded border border-emerald-300/20 bg-[#07100b] px-2 py-1.5 text-[10px] text-emerald-100 outline-none focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/20"
            id="feed-status"
            onChange={(event) => setLive(event.target.value === "live")}
            value={live ? "live" : "paused"}
          >
            <option className="bg-[#07100b]" value="live">LIVE</option>
            <option className="bg-[#07100b]" value="paused">PAUSED</option>
          </select>
          <button aria-label="Zoom out" className="terminal-control" onClick={() => setZoom((value) => Math.max(50, value - 10))} type="button">−</button>
          <span className="min-w-10 text-center text-[10px] text-emerald-100/60">{zoom}%</span>
          <button aria-label="Zoom in" className="terminal-control" onClick={() => setZoom((value) => Math.min(150, value + 10))} type="button">+</button>
          <button aria-label="Reset zoom" className="terminal-control hidden sm:flex" onClick={() => setZoom(100)} type="button"><Maximize2 className="h-3.5 w-3.5" /></button>
          <button aria-label="Exit terminal (/q)" className="terminal-control ml-1" onClick={leaveTerminal} type="button"><X className="h-4 w-4" /></button>
        </div>
      </header>

      <section className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-emerald-400/15 lg:border-b-0 lg:border-r">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-emerald-400/10 px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-2 text-[10px] text-emerald-100/55">
              <Activity className="h-3.5 w-3.5 text-emerald-300/70" />
              <span>IMPORTANT EVENTS</span>
              <span className="text-emerald-100/25">·</span>
              <span>{entries.length}/300</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor="audit-filter">Filter event type</label>
              <select
                className="max-w-36 rounded border border-emerald-300/20 bg-[#07100b] px-2 py-1.5 text-[10px] text-emerald-100 outline-none focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/20"
                id="audit-filter"
                onChange={(event) => setFilter(event.target.value as Filter)}
                value={filter}
              >
                {filters.map((option) => <option className="bg-[#07100b]" key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <button aria-label={live ? "Pause feed" : "Resume feed"} className="terminal-control" onClick={() => setLive(!live)} type="button">{live ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}</button>
              <button aria-label="Download log" className="terminal-control" onClick={downloadLog} type="button"><Download className="h-3.5 w-3.5" /></button>
              <button aria-label="Clear log" className="terminal-control" onClick={clearSiteActivity} type="button"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-4 py-3 sm:px-6">
            {visibleEntries.length ? (
              <ol className="space-y-2" aria-live={live ? "polite" : "off"}>
                {visibleEntries.map((entry) => (
                  <li className="grid grid-cols-[auto_auto_1fr] items-start gap-x-3 gap-y-1 text-[11px] leading-relaxed sm:text-xs" key={entry.id}>
                    <time className="text-emerald-100/35" dateTime={entry.timestamp}>{formatTime(entry.timestamp)}</time>
                    <span className={`font-bold ${typeStyles[entry.type]}`}>{entry.type}</span>
                    <span className="break-all text-emerald-50/80"><span className="text-emerald-300/55">{entry.route}</span><span className="px-2 text-emerald-400/35">›</span>{entry.detail}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center text-xs text-emerald-100/40">
                <p className="m-0">No important events captured yet.</p>
                <p className="m-0 text-[10px]">Routine page views and clicks are intentionally excluded.</p>
              </div>
            )}
          </div>
          <footer className="shrink-0 border-t border-emerald-400/10 px-4 py-2 text-[9px] text-emerald-100/30 sm:px-6">
            SAME-BROWSER TABS ONLY · NO PERSONAL DATA · LIVE WITHOUT RELOAD
          </footer>
        </div>

        <aside className="flex min-h-[38vh] w-full shrink-0 flex-col bg-[#040a07] lg:min-h-0 lg:w-[min(42%,520px)]">
          <div className="flex shrink-0 items-center justify-between border-b border-emerald-400/10 px-4 py-2.5 sm:px-5">
            <span className="text-[10px] tracking-widest text-emerald-100/55">CONSOLE OUTPUT</span>
            <button aria-label="Clear console" className="terminal-control" onClick={() => setLines([])} type="button"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <div className="min-h-0 flex-1 space-y-1 overflow-auto px-4 py-3 text-[11px] leading-relaxed sm:px-5" aria-live="polite">
            {lines.map((line) => <p className={`m-0 break-words ${line.tone === "error" ? "text-red-300" : line.tone === "success" ? "text-emerald-300" : line.tone === "muted" ? "text-emerald-100/45" : "text-emerald-100/80"}`} key={line.id}>{line.text}</p>)}
            <div className="flex items-center gap-2 text-emerald-300/60" aria-hidden="true"><ArrowDownRight className="h-3 w-3" /><span>ready</span></div>
          </div>
          <form className="flex shrink-0 items-center gap-2 border-t border-emerald-400/15 px-4 py-3 sm:px-5" onSubmit={(event) => { event.preventDefault(); runCommand(command); setCommand(""); }}>
            <label className="shrink-0 text-xs text-emerald-400" htmlFor="terminal-command">$</label>
            <input autoComplete="off" className="min-w-0 flex-1 bg-transparent text-xs text-emerald-100 outline-none placeholder:text-emerald-100/25" id="terminal-command" onChange={(event) => setCommand(event.target.value)} onKeyDown={handleKeyDown} placeholder="type a command (help)" ref={inputRef} spellCheck={false} value={command} />
            <span className="hidden text-[9px] text-emerald-100/25 sm:inline">ENTER</span>
          </form>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-emerald-400/10 px-4 py-2 text-[9px] text-emerald-100/35 sm:px-5">
            <span>SAFE BUILT-IN COMMANDS ONLY</span>
            <span>EXIT: /q</span>
          </div>
        </aside>
      </section>

      <style jsx>{`
        .terminal-control {
          display: inline-flex;
          height: 28px;
          min-width: 28px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(110, 231, 183, 0.25);
          border-radius: 4px;
          color: rgba(209, 250, 229, 0.78);
          transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
        }
        .terminal-control:hover,
        .terminal-control:focus-visible {
          border-color: rgba(110, 231, 183, 0.55);
          background: rgba(110, 231, 183, 0.1);
          color: #d1fae5;
          outline: 2px solid rgba(110, 231, 183, 0.25);
          outline-offset: 2px;
        }
      `}</style>
    </main>
  );
}
