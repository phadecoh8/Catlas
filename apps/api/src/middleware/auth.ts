import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { forbidden, unauthorized } from "../utils/errors.js";
import { verifyAccessToken } from "../utils/tokens.js";

export function requireAuth(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(unauthorized());
    return;
  }

  const token = header.slice("Bearer ".length);

  verifyAccessToken(token)
    .then((claims) => {
      request.user = claims;
      next();
    })
    .catch(() => {
      next(unauthorized());
    });
}

export function requireRole(...roles: string[]) {
  return (
    request: Request,
    _response: Response,
    next: NextFunction,
  ): void => {
    const user = request.user;

    if (!user) {
      next(unauthorized());
      return;
    }

    if (!roles.includes(user.role)) {
      next(forbidden("You do not have the right role."));
      return;
    }

    next();
  };
}
