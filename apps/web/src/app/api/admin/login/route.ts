import { NextResponse } from "next/server";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(256),
});

type LoginChallengeResponse = {
  requiresTwoFactor?: boolean;
  challengeToken?: string;
  challenge_token?: string;
};

function getApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  return (apiUrl || "http://localhost:4000").replace(/\/$/, "");
}

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Enter your admin email and password.",
      },
      {
        status: 400,
      },
    );
  }

  const parsedBody = credentialsSchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Enter your admin email and password.",
      },
      {
        status: 400,
      },
    );
  }

  let response: Response;

  try {
    response = await fetch(
      `${getApiUrl()}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedBody.data),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Admin sign-in is temporarily unavailable.",
      },
      {
        status: 503,
      },
    );
  }

  if (!response.ok) {
    const message = response.status === 429
      ? "Too many sign-in attempts. Please wait and try again."
      : "The email or password is incorrect.";

    return NextResponse.json(
      {
        message,
      },
      {
        status: response.status,
      },
    );
  }

  let result: LoginChallengeResponse;

  try {
    result = (await response.json()) as LoginChallengeResponse;
  } catch {
    return NextResponse.json(
      {
        message: "Admin sign-in is temporarily unavailable.",
      },
      {
        status: 502,
      },
    );
  }

  return NextResponse.json({
    requiresTwoFactor: result.requiresTwoFactor ?? false,
    challengeToken:
      result.challengeToken ?? result.challenge_token ?? "",
  });
}
