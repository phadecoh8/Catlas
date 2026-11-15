import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

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

export async function GET() {
  const session = await auth();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  if (
    session?.user.role !== "founder" ||
    !supabaseUrl ||
    !publishableKey ||
    !supabaseSecretKey
  ) {
    return NextResponse.json(
      {
        message: "Founder sign-in is required.",
      },
      {
        status: 401,
      },
    );
  }

  const projectUrl = supabaseUrl.replace(/\/$/, "");

  let waitlistResponse: Response;

  try {
    waitlistResponse = await fetch(
      `${projectUrl}/rest/v1/waitlist_signups?select=id,name,school,faculty,department,level,email,created_at&order=created_at.desc`,
      {
        headers: {
          apikey: supabaseSecretKey,
          Authorization: `Bearer ${supabaseSecretKey}`,
        },
        cache: "no-store",
      },
    );
  } catch {
    return NextResponse.json(
      {
        message: "We could not load waitlist entries.",
      },
      {
        status: 502,
      },
    );
  }

  if (!waitlistResponse.ok) {
    return NextResponse.json(
      {
        message: "We could not load waitlist entries.",
      },
      {
        status: 502,
      },
    );
  }

  const entries = (await waitlistResponse.json()) as WaitlistEntry[];

  return NextResponse.json({
    entries,
  });
}
