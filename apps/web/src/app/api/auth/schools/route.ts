function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) return null;

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

export async function GET() {
  const config = getSupabaseConfig();
  if (!config) {
    return Response.json(
      { error: "Schools are not available yet." },
      { status: 503 },
    );
  }

  const headers = {
    apikey: config.key,
  };
  const resources = [
    "schools?select=id,name&is_active=eq.true&order=name.asc",
    "faculties?select=id,name,school_id&is_active=eq.true&order=name.asc",
    "departments?select=id,name,school_id,faculty_id&is_active=eq.true&order=name.asc",
  ];

  try {
    const responses = await Promise.all(
      resources.map((resource) =>
        fetch(
          `${config.url}/rest/v1/${resource}`,
          {
            headers,
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
          },
        ),
      ),
    );

    if (responses.some((response) => !response.ok)) {
      return Response.json(
        { error: "Schools are not available yet." },
        { status: 503 },
      );
    }

    const [schools, faculties, departments] = await Promise.all(
      responses.map((response) => response.json()),
    );

    return Response.json(
      { schools, faculties, departments },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return Response.json(
      { error: "Schools are not available yet." },
      { status: 503 },
    );
  }
}
