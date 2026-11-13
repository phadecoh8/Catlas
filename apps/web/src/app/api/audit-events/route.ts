import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const eventSchema = z.object({
  category: z.enum(["auth", "ai", "enrollment", "admin_action", "system"]),
  severity: z.enum(["info", "warn", "critical"]).default("info"),
  result: z.enum(["ok", "failed"]).default("ok"),
  action: z.enum([
    "auth.student_login",
    "auth.admin_login",
    "auth.logout",
    "ai.request_failed",
    "ai.quota_exhausted",
    "enrollment.accepted",
    "enrollment.declined",
    "account.created",
    "account.deactivated",
    "account.deleted",
    "import.completed",
    "graduation.approved",
    "job.failed",
    "email.failed",
    "map.quota_warning",
    "waitlist.signup",
    "waitlist.honeypot_rejected",
    "session.ended",
    "session.level_rollover",
  ]),
  summary: z.string().trim().min(1).max(180),
});

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user.id || !session.user.role || !session.user.provider) {
    return NextResponse.json({ message: "Sign-in required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid event." }, { status: 400 });
  }
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid event." }, { status: 400 });

  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ message: "Audit service is not configured." }, { status: 503 });
  const actorRef = session.user.id.replace(/-/g, "").slice(0, 4).toLowerCase();
  const response = await fetch(`${config.url}/rest/v1/audit_log`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      category: parsed.data.category,
      severity: parsed.data.severity,
      result: parsed.data.result,
      request_id: request.headers.get("x-request-id"),
      actor_role: session.user.role,
      actor_ref: actorRef,
      action: parsed.data.action,
      summary: parsed.data.summary,
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!response?.ok) return NextResponse.json({ message: "Could not save audit event." }, { status: 503 });
  return NextResponse.json({ recorded: true }, { status: 201 });
}
