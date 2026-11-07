import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

type LoginResponse = {
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

const dashboardByRole: Record<string, string> = {
  founder: "/admin/founder",
  vc: "/admin/vc",
  dean: "/admin/dean",
  hod: "/admin/department",
  committee: "/admin/department",
  department_committee: "/admin/department",
  governor: "/admin/governor",
  class_governor: "/admin/governor",
};

function getDashboardPath(role: string) {
  return dashboardByRole[role.toLowerCase()];
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        challengeToken: {},
        code: {},
      },
      async authorize(credentials) {
        const challengeToken = credentials.challengeToken;
        const isTwoFactor = typeof challengeToken === "string";
        const endpoint = isTwoFactor ? "2fa/verify" : "login";
        const body = isTwoFactor
          ? {
              challengeToken,
              code: credentials.code,
            }
          : {
              email: credentials.email,
              password: credentials.password,
            };
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL?.trim() ||
          "http://localhost:4000";

        let response: Response;

        try {
          response = await fetch(
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
        } catch {
          return null;
        }

        if (!response.ok) {
          return null;
        }

        const result = (await response.json()) as LoginResponse;
        const accessToken = result.accessToken ?? result.access_token;
        const refreshToken = result.refreshToken ?? result.refresh_token;
        const role = result.user?.role?.toLowerCase();

        if (!accessToken || !refreshToken || !role || !result.user?.id) {
          return null;
        }

        const redirectTo = getDashboardPath(role);

        if (!redirectTo) {
          return null;
        }

        return {
          id: result.user.id,
          role,
          accessToken,
          refreshToken,
          mustChangePassword: result.mustChangePassword ?? false,
          redirectTo: result.mustChangePassword
            ? "/change-password"
            : redirectTo,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.mustChangePassword = user.mustChangePassword;
        token.redirectTo = user.redirectTo;
      }

      return token;
    },
    session({ session, token }) {
      session.user.role =
        typeof token.role === "string" ? token.role : "";
      session.user.mustChangePassword =
        typeof token.mustChangePassword === "boolean"
          ? token.mustChangePassword
          : false;
      session.redirectTo =
        typeof token.redirectTo === "string"
          ? token.redirectTo
          : undefined;

      return session;
    },
  },
});
