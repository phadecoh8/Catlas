import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const commandSchema = z.object({
  command: z.string().trim().min(1).max(40),
  args: z.array(z.string().trim().max(60)).max(5).default([]),
});

type Session = NonNullable<Awaited<ReturnType<typeof auth>>>;
type AuditRow = {
  id: string;
  category: string;
  severity: string;
  result: string;
  request_id: string | null;
  actor_role: string;
  actor_ref: string;
  action: string;
  summary: string;
  created_at: string;
};
type SchoolRow = { id: string; name: string };

const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60_000;

function isFounderMfa(
  session: Session | null,
): session is Session & { user: Session["user"] & { id: string } } {
  return (
    session?.user.role === "founder" &&
    session.user.provider === "admin" &&
    session.user.mfaVerified === true &&
    Boolean(session.user.id)
  );
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

async function supabaseRequest(path: string, init?: RequestInit) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("SUPABASE_SERVER_CONFIG_MISSING");
  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

function shortActorId(id: string) {
  return id.replace(/-/g, "").slice(0, 4).toLowerCase() || "anon";
}

async function addAuditEntry(
  session: Session,
  action: string,
  summary: string,
  options: { category?: string; severity?: string; result?: string; requestId?: string } = {},
) {
  const response = await supabaseRequest("audit_log", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({
      category: options.category ?? "console",
      severity: options.severity ?? "info",
      result: options.result ?? "ok",
      request_id: options.requestId ?? null,
      actor_role: session.user.role ?? "unknown",
      actor_ref: shortActorId(session.user.id),
      action,
      summary: summary.slice(0, 180),
    }),
  });
  if (!response.ok) throw new Error("AUDIT_WRITE_FAILED");
}

function safeSince(value: string | undefined) {
  const match = value?.match(/^(\d{1,3})(m|h|d)$/i);
  if (!match) return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const milliseconds = amount * (unit === "m" ? 60_000 : unit === "h" ? 3_600_000 : 86_400_000);
  return new Date(Date.now() - milliseconds).toISOString();
}

async function countRows(path: string) {
  const response = await supabaseRequest(path, {
    method: "HEAD",
    headers: { Prefer: "count=exact" },
  });
  if (!response.ok) throw new Error("COUNT_QUERY_FAILED");
  const contentRange = response.headers.get("content-range");
  const count = contentRange?.split("/").at(-1);
  if (!count || count === "*") throw new Error("COUNT_HEADER_MISSING");
  return Number(count);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function runSafeCommand(command: string, args: string[]) {
  switch (command) {
    case "schools": {
      const response = await supabaseRequest("schools?select=id,name&order=name.asc");
      if (!response.ok) throw new Error("SCHOOLS_UNAVAILABLE");
      const schools = await response.json() as SchoolRow[];
      return schools.length
        ? ["SCHOOL", ...schools.map((school) => school.name)]
        : ["No schools found."];
    }
    case "users": {
      const slug = args[0]?.toLowerCase();
      if (!slug) return ["usage: users <school-slug>"];
      const schoolsResponse = await supabaseRequest("schools?select=id,name");
      if (!schoolsResponse.ok) throw new Error("SCHOOLS_UNAVAILABLE");
      const schools = await schoolsResponse.json() as SchoolRow[];
      const school = schools.find((item) => slugify(item.name) === slug);
      if (!school) return [`no school found for ${slug}`];
      const roles = ["student", "class_governor", "committee", "hod", "dean", "vc", "founder"];
      const rows = await Promise.all(roles.map(async (role) => ({
        role,
        total: await countRows(`profiles?select=id&school_id=eq.${encodeURIComponent(school.id)}&role=eq.${encodeURIComponent(role)}`),
      })));
      const present = rows.filter((row) => row.total > 0);
      if (!present.length) return [`no users found for ${slug}`];
      return ["ROLE             COUNT", ...present.map(({ role, total }) => `${role.padEnd(16)} ${total}`)];
    }
    case "waitlist": {
      const total = await countRows("waitlist_signups?select=id");
      return [`waitlist sign-ups: ${total}`];
    }
    case "events": {
      const category = args[0] && !args[0].startsWith("--") ? args[0] : undefined;
      const allowed = new Set(["auth", "ai", "enrollment", "admin_action", "system", "console"]);
      if (category && !allowed.has(category)) return ["usage: events [auth|ai|enrollment|admin_action|system|console] [--since 24h]"];
      const sinceIndex = args.indexOf("--since");
      const since = sinceIndex >= 0 ? args[sinceIndex + 1] : args.find((arg) => arg.startsWith("--since="))?.slice(8);
      const params = new URLSearchParams({
        select: "category,severity,result,actor_role,actor_ref,action,summary,created_at",
        order: "created_at.desc",
        limit: "50",
        created_at: `gte.${safeSince(since)}`,
      });
      if (category) params.set("category", `eq.${category}`);
      const response = await supabaseRequest(`audit_log?${params}`);
      if (!response.ok) throw new Error("AUDIT_EVENTS_UNAVAILABLE");
      const rows = await response.json() as AuditRow[];
      return rows.length
        ? rows.map((row) => `${row.created_at} ${row.severity.toUpperCase()} ${row.result.toUpperCase()} ${row.actor_role}-${row.actor_ref} ${row.action}: ${row.summary}`)
        : ["No matching events."];
    }
    case "status": {
      const config = getSupabaseConfig();
      const [database, api] = await Promise.all([
        config ? supabaseRequest("schools?select=id&limit=1").then((response) => response.ok ? "up" : "down").catch(() => "down") : Promise.resolve("not configured"),
        fetch(`${(process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000").replace(/\/$/, "")}/health`, { cache: "no-store", signal: AbortSignal.timeout(2500) }).then((response) => response.ok ? "up" : "down").catch(() => "down"),
      ]);
      return [
        `database: ${database}`,
        `api: ${api}`,
        "jobs: not connected to a job-status source",
        "error rate: not connected to metrics",
        "quota: not connected to provider usage metrics",
      ];
    }
    case "students":
      return ["Not available: this deployment has no approved server-side student report query yet."];
    case "jobs":
    case "quota":
    case "reports":
      return [`${command}: not connected to a server-side data source yet.`];
    default:
      return [`unknown command: ${command}`];
  }
}

function rateLimited(id: string) {
  const now = Date.now();
  const record = requestCounts.get(id);
  if (!record || record.resetAt <= now) {
    requestCounts.set(id, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  if (record.count >= RATE_LIMIT) return true;
  record.count += 1;
  return false;
}

export async function GET(request: Request) {
  const session = await auth();
  if (!isFounderMfa(session)) return NextResponse.json({ message: "Founder sign-in with verified MFA is required." }, { status: 403 });
  if (rateLimited(session.user.id)) return NextResponse.json({ message: "Console rate limit reached." }, { status: 429 });

  const url = new URL(request.url);
  const since = safeSince(url.searchParams.get("since") ?? undefined);
  const params = new URLSearchParams({
    select: "id,category,severity,result,request_id,actor_role,actor_ref,action,summary,created_at",
    order: "created_at.desc",
    limit: "300",
    created_at: `gte.${since}`,
  });
  try {
    const response = await supabaseRequest(`audit_log?${params}`);
    if (!response.ok) return NextResponse.json({ message: "Audit store is unavailable. Apply audit-log-migration.sql and configure the server service key." }, { status: 503 });
    const events = await response.json() as AuditRow[];
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ message: "Audit store is unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!isFounderMfa(session)) return NextResponse.json({ message: "Founder sign-in with verified MFA is required." }, { status: 403 });
  if (rateLimited(session.user.id)) return NextResponse.json({ message: "Console rate limit reached." }, { status: 429 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid command request." }, { status: 400 });
  }
  const parsed = commandSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid command request." }, { status: 400 });
  const { command, args } = parsed.data;
  const allowed = new Set(["schools", "users", "waitlist", "events", "status", "students", "jobs", "quota", "reports"]);
  if (!allowed.has(command)) return NextResponse.json({ lines: [`unknown command: ${command}`] });

  try {
    const lines = await runSafeCommand(command, args);
    await addAuditEntry(session, "console.command", `Executed founder console command: ${command}`);
    return NextResponse.json({ lines });
  } catch {
    try {
      await addAuditEntry(session, "console.command", `Founder console command failed: ${command}`, { severity: "warn", result: "failed" });
    } catch {
      // Preserve the generic command failure response if the audit store is down.
    }
    return NextResponse.json({ message: "Command data source is unavailable." }, { status: 503 });
  }
}
