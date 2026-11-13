import type { AccessTokenClaims } from "../utils/tokens.js";

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: AccessTokenClaims;
      pagination?: {
        limit: number;
        cursor: string | null;
      };
    }
  }
}

export {};
