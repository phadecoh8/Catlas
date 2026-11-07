import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    redirectTo?: string;
    user: DefaultSession["user"] & {
      role?: string;
      mustChangePassword?: boolean;
    };
  }

  interface User {
    role: string;
    accessToken: string;
    refreshToken: string;
    mustChangePassword: boolean;
    redirectTo: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    mustChangePassword?: boolean;
    redirectTo?: string;
  }
}
