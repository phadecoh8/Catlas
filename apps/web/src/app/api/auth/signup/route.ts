import { z } from "zod";

const signupSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
  surname: z.string().trim().min(1).max(80),
  firstName: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(7).max(24),
  schoolId: z.string().uuid(),
  facultyId: z.string().uuid(),
  departmentId: z.string().uuid(),
  level: z.number().int().min(100).max(800).multipleOf(100),
  jambRegNo: z.string().trim().max(32).optional(),
  consent: z.literal(true),
});

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) return null;

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

export async function POST(request: Request) {
  const config = getSupabaseConfig();
  if (!config) {
    return Response.json(
      { error: "Account creation is not configured yet." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "Enter valid account details." },
      { status: 400 },
    );
  }

  const parsed = signupSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: "Check the account details and try again." },
      { status: 400 },
    );
  }

  const { data } = parsed;
  const siteUrl = process.env.SITE_URL?.trim() || new URL(request.url).origin;

  try {
    const redirectTo = new URL("/verify-email", siteUrl).toString();
    const response = await fetch(
      `${config.url}/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`,
      {
        method: "POST",
        headers: {
          apikey: config.key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          data: {
            surname: data.surname,
            first_name: data.firstName,
            phone: data.phone,
            school_id: data.schoolId,
            faculty_id: data.facultyId,
            department_id: data.departmentId,
            level: data.level,
            jamb_reg_no: data.jambRegNo || null,
            consented_at: new Date().toISOString(),
          },
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
      },
    );

    if (response.status === 429) {
      return Response.json(
        { error: "Too many attempts. Wait a little and try again." },
        { status: 429 },
      );
    }

    if (!response.ok) {
      return Response.json(
        { error: "We could not create the account. Check your details." },
        { status: 400 },
      );
    }

    return Response.json(
      {
        message: "Check your email for a verification link, then sign in.",
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "The account service is unavailable. Try again shortly." },
      { status: 503 },
    );
  }
}
