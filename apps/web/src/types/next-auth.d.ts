import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    redirectTo?: string;
    error?: string;
    user: DefaultSession["user"] & {
      id: string;
      role?: string;
      mustChangePassword?: boolean;
    };
  }

  interface User {
    role: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    provider: "student" | "admin";
    mustChangePassword: boolean;
    redirectTo: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    mustChangePassword?: boolean;
    redirectTo?: string;
    sessionError?: string;
    authProvider?: "student" | "admin";
  }
}
