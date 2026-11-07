# Catlas API Conventions

Draft plan for the Express API. The rules in `AGENTS.md` take priority if the two disagree.

## General

- Base path: `/api/v1`
- JSON requests and responses (`Content-Type: application/json`)
- IDs are UUIDs
- Times are stored and sent in UTC (ISO 8601). The UI shows them in Africa/Lagos.
- Every request body, query and parameter is validated with Zod.
- Authenticated calls send `Authorization: Bearer <access token>`, attached by the Next.js server.

## Errors

One shape for every error:

```json
{
  "error": {
    "code": "FORBIDDEN_SCOPE",
    "message": "You cannot access this resource.",
    "details": []
  }
}
```

| Status | Use |
|---|---|
| 400 | Validation failed (`details` lists fields) |
| 401 | Missing, expired or invalid token |
| 403 | Authenticated but outside the allowed role or scope |
| 404 | Not found (also used when a resource exists in another school) |
| 409 | Conflict (for example duplicate bookmark or already on the waitlist) |
| 423 | Session locked (the school's session has ended) |
| 429 | Rate limited |
| 500 | Unexpected error (no internal details in the response) |

Login and reset endpoints return the same response whether or not an account exists.

## Pagination

Lists use cursor pagination: `?limit=20&cursor=<opaque>`. Responses return `items` and `nextCursor` (null at the end). Maximum `limit` is 50.

## Scoping rules

- `school_id` for scoped data comes from the account, never from the client.
- Cross-school access returns 404, not 403, so existence is not revealed.
- Dashboard endpoints apply the role scope from `docs/PRODUCT.md` (Who sees what).
- Writes that post classes, assignments, announcements or events check the session lock.

## Rate limits

Stricter limits on login, password reset, sign-up, search, guest, waitlist, newsletter, reports and assistant endpoints. Responses include `Retry-After` on 429.

## Endpoint plan (draft)

Each row matches a folder in `apps/api/src/modules/`.

| Module | Examples |
|---|---|
| auth | `POST /auth/signup`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `POST /auth/verify-email`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password`, `POST /auth/2fa/setup`, `POST /auth/2fa/verify`, `POST /auth/2fa/backup-code` |
| guest | `GET /guest/locations`, `GET /guest/search?q=` (public, rate limited; only the chosen school's visitor-accessible locations) |
| schools | `GET /schools` (public list for the login picker) |
| faculties | `GET /faculties`, founder: `POST`, `PATCH`, `DELETE` |
| departments | `GET /departments`, founder: `POST`, `PATCH`, `DELETE` (the Dean in a future version) |
| users | `GET /me`, `PATCH /me`, `DELETE /me` (account deletion, immediate and permanent), founder: `PATCH /users/:id/level` (correct a student's declared level from a feedback item; audit logged) |
| accounts | founder: `POST /accounts` (create a dashboard account with a temporary password), `POST /accounts/:id/reset-2fa` |
| verification | `POST /verification/matric`, admin: `POST /verification/records` |
| academic-sessions | `GET /academic-sessions/current`, VC: `PUT /academic-sessions/current` |
| graduation | VC: `GET /graduation/batches`, `POST /graduation/batches/:id/approve`, `POST /graduation/batches/:id/decline` |
| buildings | `GET /buildings/:id`, VC: `POST`, `PATCH`, `DELETE` |
| locations | `GET /locations`, `GET /locations/:id`, VC: `POST`, `PATCH`, `DELETE` |
| indoor-places | `GET /buildings/:id/indoor-places`, VC and owner tools: `POST`, `PATCH`, `DELETE` |
| search | `GET /search?q=`, `GET /search/recent` |
| bookmarks | `GET /bookmarks`, `PUT /bookmarks/:locationId`, `DELETE /bookmarks/:locationId` |
| classes | `GET /classes`, `GET /classes/next`, governor: `POST`, `PATCH` (mark cancelled or moved) |
| assignments | `GET /assignments`, governor: `POST`, `PATCH`, `DELETE` |
| announcements | `GET /announcements`, committee, HOD, Dean, VC: `POST`, `PATCH`, `DELETE`; founder: platform notices |
| events | `GET /events`, same posters as announcements |
| notifications | `GET /notifications`, `POST /notifications/:id/read` |
| reports | `POST /reports`, VC (location reports) and founder (app bugs): `GET /reports`, `PATCH /reports/:id` |
| feedback | `POST /feedback` (to the user's school), HOD, Dean and VC: `GET /feedback` |
| imports | VC: `GET /imports/templates/:kind`, `POST /imports/:kind/preview`, `POST /imports/:id/commit` |
| uploads | `POST /uploads/sign` (signed Cloudinary upload) |
| waitlist | `POST /api/waitlist` (Next.js route; requires consent, honeypot and minimum fill time; saves to Supabase; replies "already registered" for repeats). Founder reads entries at `/api/founder/waitlist` after Supabase Auth verifies the configured founder email. |
| newsletter | `POST /newsletter/subscribe` (sends a confirmation email), `GET /newsletter/confirm?token=`, `POST /newsletter/unsubscribe` (also reached from the link in every email); public, rate limited; stored in the waitlist database |
| assistant | `POST /assistant/chat` (rate limited; answers from the Catlas knowledge base; no personal data sent to the AI) |
| admin | dashboards and student lists by scope |
| audit | audit log writes and reads (who may read it is an open question) |
| jobs | `POST /jobs/:name` (scheduler only, requires `CRON_SECRET`) |

## Bulk import flow

1. VC downloads the CSV template for the kind (verification list, locations, buildings, indoor places).
2. VC uploads the file to `preview`. The API validates every row and returns row-level errors. Nothing is saved.
3. If the file is clean, VC calls `commit`. The import is all-or-nothing and written to the audit log.
4. Cells starting with `=`, `+`, `-` or `@` are neutralised, file size is limited, and `school_id` always comes from the account.

## Jobs

Job endpoints are called by the scheduler only. They require `CRON_SECRET`, are idempotent, and log IDs and counts, never personal data. Jobs: `level-rollover`, `session-lock`, `graduation-recommendation`, `reminders`, `retention-cleanup`.

## Logging

Log request IDs, user IDs, route and status. Never log names, phone numbers, matric numbers, staff IDs, emails, passwords or tokens.
