import { NextResponse } from "next/server";
import { z } from "zod";

const waitlistSchema = z.object({
  name: z.string().trim().min(1).max(120),
  school: z.string().trim().min(1).max(180),
  faculty: z.string().trim().min(1).max(180),
  department: z.string().trim().min(1).max(180),
  level: z.string().trim().min(1).max(40),
  email: z.string().trim().email().max(254),
  consent: z.literal(true),
  website: z.string().max(200).optional().default(""),
  startedAt: z.number().int().positive(),
});

const requestLimit = 5;
const requestWindowMs = 60 * 60 * 1000;

const requestsByAddress = new Map<
  string,
  {
    count: number;
    expiresAt: number;
  }
>();

function isRateLimited(request: Request) {
  const now = Date.now();
  const address =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  for (const [storedAddress, record] of requestsByAddress) {
    if (record.expiresAt <= now) {
      requestsByAddress.delete(storedAddress);
    }
  }

  const currentRecord = requestsByAddress.get(address);

  if (!currentRecord || currentRecord.expiresAt <= now) {
    requestsByAddress.set(address, {
      count: 1,
      expiresAt: now + requestWindowMs,
    });

    return false;
  }

  if (currentRecord.count >= requestLimit) {
    return true;
  }

  currentRecord.count += 1;
  return false;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      {
        message: "Too many attempts. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": "3600",
        },
      },
    );
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Please check the form and try again.",
      },
      {
        status: 400,
      },
    );
  }

  const parsedBody = waitlistSchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Please complete every field and accept the privacy terms.",
      },
      {
        status: 400,
      },
    );
  }

  const submission = parsedBody.data;

  if (submission.website) {
    return NextResponse.json({
      message: "You are on the list.",
    });
  }

  if (Date.now() - submission.startedAt < 3000) {
    return NextResponse.json(
      {
        message: "Please take a moment to review the form before submitting.",
      },
      {
        status: 400,
      },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return NextResponse.json(
      {
        message: "Waitlist sign-up is not configured yet.",
      },
      {
        status: 503,
      },
    );
  }

  let response: Response;

  try {
    response = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/waitlist_signups`,
      {
        method: "POST",
        headers: {
          apikey: supabaseSecretKey,
          Authorization: `Bearer ${supabaseSecretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: submission.name,
          school: submission.school,
          faculty: submission.faculty,
          department: submission.department,
          level: submission.level,
          email: submission.email.toLowerCase(),
          consented_at: new Date().toISOString(),
        }),
        cache: "no-store",
      },
    );
  } catch {
    return NextResponse.json(
      {
        message: "We could not submit your request. Please try again.",
      },
      {
        status: 502,
      },
    );
  }

  if (response.status === 409) {
    return NextResponse.json(
      {
        message: "This email is already on the waitlist.",
      },
      {
        status: 409,
      },
    );
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | {
          code?: string;
        }
      | null;

    if (errorBody?.code === "23505") {
      return NextResponse.json(
        {
          message: "This email is already on the waitlist.",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        message: "We could not submit your request. Please try again.",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    message: "You are on the list.",
  });
}
