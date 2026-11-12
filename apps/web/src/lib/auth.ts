import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

type SupabaseTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  expires_in?: number;
  user?: {
    id?: string;
    email?: string;
  };
};

type Profile = {
  role?: string;
  surname?: string;
  first_name?: string;
};

type ApiLoginResponse = {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  mustChangePassword?: boolean;
  user?: {
    id?: string;
    role?: string;
  };
};

type AuthProvider = "admin" | "student";

type SessionUser = {
  id?: string;
  role?: string;
  mustChangePassword?: boolean;
  email?: string | null;
  name?: string | null;
};

const dashboardByRole: Record<string, string> = {
  founder: "/admin/founder",
  vc: "/admin/vc",
  dean: "/admin/dean",
  hod: "/admin/department",
  committee: "/admin/department",
  governor: "/admin/governor",
  class_governor: "/admin/governor",
  department_committee: "/admin/department",
  student: "/home",
};

function getAdminDashboardPath(role: string) {
  return dashboardByRole[role.toLowerCase()];
}

async function authorizeAdmin(
  credentials: Partial<Record<string, unknown>>,
) {
  const challengeToken = credentials.challengeToken;
  const isTwoFactor = typeof challengeToken === "string";
  const endpoint = isTwoFactor ? "2fa/verify" : "login";
  const body = isTwoFactor
    ? { challengeToken, code: credentials.code }
    : { email: credentials.email, password: credentials.password };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
    || "http://localhost:4000";

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/api/v1/auth/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) return null;
    const result = (await response.json()) as ApiLoginResponse;
    const id = result.user?.id;
    const role = result.user?.role?.toLowerCase();
    const accessToken = result.accessToken ?? result.access_token;
    const refreshToken = result.refreshToken ?? result.refresh_token;
    const rolePath = role ? getAdminDashboardPath(role) : undefined;

    if (!id || !role || !accessToken || !refreshToken || !rolePath) {
      return null;
    }

    const mustChangePassword = result.mustChangePassword ?? false;
    return {
      id,
      role,
      accessToken,
      refreshToken,
      provider: "admin" as const,
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
      mustChangePassword,
      redirectTo: mustChangePassword ? "/change-password" : rolePath,
    };
  } catch {
    return null;
  }
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

async function refreshSession(refreshToken: string) {
  const config = getSupabaseConfig();
  if (!config) return null;

  try {
    const response = await fetch(
      `${config.url}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          apikey: config.key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) return null;
    return (await response.json()) as SupabaseTokenResponse;
  } catch {
    return null;
  }
}

async function refreshAdminSession(refreshToken: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
    || "http://localhost:4000";

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/api/v1/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) return null;
    return (await response.json()) as SupabaseTokenResponse;
  } catch {
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: {},
        password: {},
        challengeToken: {},
        code: {},
      },
      authorize: authorizeAdmin,
    }),
    Credentials({
      id: "student",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const config = getSupabaseConfig();
        const email = credentials.email;
        const password = credentials.password;

        if (
          !config ||
          typeof email !== "string" ||
          typeof password !== "string"
        ) {
          return null;
        }

        try {
          const response = await fetch(
            `${config.url}/auth/v1/token?grant_type=password`,
            {
              method: "POST",
              headers: {
                apikey: config.key,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
              cache: "no-store",
              signal: AbortSignal.timeout(10_000),
            },
          );

          if (!response.ok) return null;
          const result = (await response.json()) as SupabaseTokenResponse;
          const userId = result.user?.id;

          if (!userId || !result.access_token || !result.refresh_token) {
            return null;
          }

          const profileResponse = await fetch(
            `${config.url}/rest/v1/profiles?select=role,surname,first_name&id=eq.${encodeURIComponent(userId)}`,
            {
              headers: {
                apikey: config.key,
                Authorization: `Bearer ${result.access_token}`,
              },
              cache: "no-store",
              signal: AbortSignal.timeout(10_000),
            },
          );

          if (!profileResponse.ok) return null;
          const profiles = (await profileResponse.json()) as Profile[];
          const profile = profiles[0];
          const role = profile?.role?.toLowerCase();
          const redirectTo = role ? dashboardByRole[role] : undefined;

          if (!role || !redirectTo) return null;

          return {
            id: userId,
            email,
            name: [profile?.first_name, profile?.surname]
              .filter(Boolean)
              .join(" "),
            role,
            accessToken: result.access_token,
            refreshToken: result.refresh_token,
            provider: "student" as const,
            accessTokenExpires: Date.now() + (result.expires_in ?? 3600) * 1000,
            mustChangePassword: false,
            redirectTo,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
        token.redirectTo = user.redirectTo;
        token.authProvider = user.provider as AuthProvider;
        token.mustChangePassword = user.mustChangePassword;
      }

      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() < token.accessTokenExpires - 30_000
      ) {
        return token;
      }

      if (typeof token.refreshToken !== "string") {
        return token;
      }

      const refreshed = token.authProvider === "admin"
        ? await refreshAdminSession(token.refreshToken)
        : await refreshSession(token.refreshToken);
      const accessToken = refreshed?.access_token ?? refreshed?.accessToken;
      const refreshToken = refreshed?.refresh_token ?? refreshed?.refreshToken;

      if (!accessToken || !refreshToken) {
        token.sessionError = "RefreshTokenError";
        return token;
      }

      token.accessToken = accessToken;
      token.refreshToken = refreshToken;
      token.accessTokenExpires =
        Date.now() + (refreshed?.expires_in ?? 3600) * 1000;
      delete token.sessionError;
      return token;
    },
    session({ session, token }) {
      const user = session.user as SessionUser;
      user.id = token.sub ?? "";
      user.role = typeof token.role === "string" ? token.role : "";
      user.mustChangePassword = token.mustChangePassword === true;
      session.error = typeof token.sessionError === "string"
        ? token.sessionError
        : undefined;
      session.redirectTo = typeof token.redirectTo === "string"
        ? token.redirectTo
        : undefined;

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (typeof token?.refreshToken !== "string") return;

      if (token.authProvider === "admin") {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
          || "http://localhost:4000";

        try {
          await fetch(
            `${apiUrl.replace(/\/$/, "")}/api/v1/auth/logout`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken: token.refreshToken }),
              cache: "no-store",
              signal: AbortSignal.timeout(8_000),
            },
          );
        } catch {
          return;
        }

        return;
      }

      const config = getSupabaseConfig();
      if (!config || typeof token.accessToken !== "string") return;

      try {
        await fetch(`${config.url}/auth/v1/logout`, {
          method: "POST",
          headers: {
            apikey: config.key,
            Authorization: `Bearer ${token.accessToken}`,
          },
          cache: "no-store",
          signal: AbortSignal.timeout(8_000),
        });
      } catch {
        return;
      }
    },
  },
});
