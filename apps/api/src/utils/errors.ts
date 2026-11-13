export type ErrorCode =
  | "VALIDATION_FAILED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "FORBIDDEN_SCOPE"
  | "NOT_FOUND"
  | "CONFLICT"
  | "SESSION_LOCKED"
  | "RATE_LIMITED"
  | "INTERNAL";

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  VALIDATION_FAILED: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  FORBIDDEN_SCOPE: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SESSION_LOCKED: 423,
  RATE_LIMITED: 429,
  INTERNAL: 500,
};

export type ErrorDetail = {
  field: string;
  message: string;
};

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details: ErrorDetail[];

  constructor(
    code: ErrorCode,
    message: string,
    details: ErrorDetail[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = STATUS_BY_CODE[code];
    this.details = details;
  }
}

export function validationError(
  details: ErrorDetail[],
): ApiError {
  return new ApiError(
    "VALIDATION_FAILED",
    "Some fields are not valid.",
    details,
  );
}

export function unauthorized(
  message = "Missing, expired or invalid token.",
): ApiError {
  return new ApiError("UNAUTHORIZED", message);
}

export function forbidden(
  message = "You cannot access this resource.",
  code: "FORBIDDEN" | "FORBIDDEN_SCOPE" = "FORBIDDEN",
): ApiError {
  return new ApiError(code, message);
}

export function notFound(
  message = "Resource not found.",
): ApiError {
  return new ApiError("NOT_FOUND", message);
}

export function conflict(
  message = "The resource already exists.",
): ApiError {
  return new ApiError("CONFLICT", message);
}

export function sessionLocked(
  message = "The school session has ended.",
): ApiError {
  return new ApiError("SESSION_LOCKED", message);
}

export function rateLimited(
  message = "Too many requests. Try again later.",
): ApiError {
  return new ApiError("RATE_LIMITED", message);
}
