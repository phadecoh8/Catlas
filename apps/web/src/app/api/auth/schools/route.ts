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
      {
        error: "Schools are not available yet.",
        diagnostic: "Supabase URL or publishable key is missing.",
      },
      { status: 503 },
    );
  }

  const headers = {
    apikey: config.key,
    Authorization: `Bearer ${config.key}`,
  };
  const resources = [
    "schools?select=id,name&is_active=eq.true&order=name.asc",
    "faculties?select=id,name,school_id&is_active=eq.true&order=name.asc",
    "departments?select=id,name,school_id,faculty_id&is_active=eq.true&order=name.asc",
  ];
  const tableNames = ["schools", "faculties", "departments"];

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

    const failedTables = responses.flatMap((response, index) => {
      if (response.ok) return [];

      return [{
        table: tableNames[index] ?? "unknown",
        status: response.status,
      }];
    });

    if (failedTables.length > 0) {
      return Response.json(
        {
          error: "Schools are not available yet.",
          diagnostic: "Supabase rejected one or more table requests.",
          failedTables,
        },
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
      {
        error: "Schools are not available yet.",
        diagnostic:
          "Could not connect to Supabase. Check the project URL and network access.",
      },
      { status: 503 },
    );
  }
}
