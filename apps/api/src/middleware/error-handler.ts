import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof ApiError) {
    response.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_FAILED",
        message: "Some fields are not valid.",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  const requestId = (request as Request & {
    id?: string;
  }).id;

  logger.error(
    {
      requestId,
      route: request.originalUrl,
      err: error,
    },
    "Unhandled request error",
  );

  response.status(500).json({
    error: {
      code: "INTERNAL",
      message: "Something went wrong.",
      details: [],
    },
  });
}
