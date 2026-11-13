import type { NextFunction, Request, Response } from "express";
import { validationError } from "./errors.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export function parsePagination(
  query: Request["query"],
): { limit: number; cursor: string | null } {
  const rawLimit = Array.isArray(query.limit)
    ? query.limit[0]
    : query.limit;
  const rawCursor = Array.isArray(query.cursor)
    ? query.cursor[0]
    : query.cursor;

  const parsed = rawLimit === undefined ? NaN : Number(rawLimit);

  if (Number.isNaN(parsed) || parsed < 1) {
    throw validationError([
      {
        field: "limit",
        message: "limit must be a number of at least 1.",
      },
    ]);
  }

  return {
    limit: Math.min(Math.floor(parsed), MAX_LIMIT),
    cursor: rawCursor ? String(rawCursor) : null,
  };
}

export function paginated<Item>(
  response: Response,
  items: Item[],
  nextCursor: string | null,
): Response {
  return response.json({
    items,
    nextCursor,
  });
}

export function paginationMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const { limit, cursor } = parsePagination(request.query);

  request.pagination = { limit, cursor };
  next();
}
