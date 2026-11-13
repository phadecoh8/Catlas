# Catlas Architecture

How the pieces of Catlas fit together. Rules and decisions live in `AGENTS.md` and `docs/PRODUCT.md`; this file explains the shape of the system.

## Overview

```
Browser (phone)
    |
    v
Next.js frontend (Vercel)  <-- Auth.js session cookie (httpOnly)
    |                           |
    |                           +--> Supabase Auth and waitlist database
    |                                (separate project)
    |
    | server calls with access token
    v
Express API (/api/v1)  -----> PostgreSQL (Drizzle)
    |                            |
    |                            +--> Resend (email)
    |                            +--> Cloudinary (signed uploads)
    |                            +--> Google Maps (routing, server key)
    |                            +--> Gemini API (no personal data)
    |
    +--> Scheduler endpoints (CRON_SECRET)
```

The browser also loads the Google Maps script directly (browser key, restricted to Catlas domains) on the navigate page only.

## Components

- **Frontend (Next.js):** landing page, pages for students and guests, and the dashboards. Holds the Auth.js session. Calls the API from the server side so tokens never reach browser JavaScript.
- **Landing page:** the public page at `/`, built first. Its waitlist form submits through a Next.js route handler to a separate Supabase project.
- **API (Express):** owns admin credentials, roles, 2FA and refresh sessions, plus app business rules and scope checks. Student credentials and email verification are managed by Supabase Auth. Organised as modules, each with routes, controller, service and schema.
- **Database (PostgreSQL):** one database for all schools; every school-scoped row carries `school_id`. `pg_trgm` powers fuzzy search.
- **Supabase:** provides student authentication and stores student profiles, school enrollment options and waitlist entries. The profile trigger always assigns the student role; school review determines whether enrollment is accepted. Pending or declined profiles cannot access student routes. Row-level security limits profile reads and updates. Auth.js stores student tokens in an encrypted httpOnly cookie. Next.js reads waitlist entries with server-side `fetch` and a server-only Supabase secret key. Legacy anon and service-role keys are supported as fallbacks.
- **Jobs:** level rollover, session lock, graduation recommendation, reminders, retention cleanup. All are safe to run twice.
- **Images:** stored on Cloudinary. The database keeps the `public_id` and URL.
- **Catlas AI assistant:** answers from the knowledge files in `apps/api/src/modules/assistant/knowledge/`. It never sees personal data and cannot perform actions.

## Multi-school model

One deployment serves many schools. Isolation is enforced in the API, not by separate databases:

1. Every request carries a verified identity (role, school, faculty, department, level).
2. Middleware applies the scope for that role (see `docs/PRODUCT.md`, Who sees what).
3. Queries always filter by `school_id`, plus faculty, department and level where relevant.
4. `school_id` for scoped writes comes from the logged-in account, never from the request body or an uploaded file.
5. Tests prove that one school, department or level cannot read another's data.

## Request flow (student opens a location)

1. Student searches. The API runs a fuzzy search limited to the student's school and returns matches, or "not found".
2. Student opens the location card. The API returns photo, building details, offices and classes inside.
3. Student taps navigate. The map loads (lazy), the route comes from Google routing, and Catlas saves its own location data on the device.
4. If the network drops, the saved data and the phone's GPS keep guiding the student with distance and direction.
5. If the student leaves the trail, the app shows "Readjusting and redirecting trail" and draws a new route.
6. On arrival, the congratulations message appears with the happy cat.

## Login and sessions

Summarised from `docs/PRODUCT.md` (Login and session flow): Supabase Auth verifies the student's email and password and rotates student refresh tokens. The school separately reviews enrollment; a verified email alone does not grant student access. On acceptance, establish the student session and redirect to the student home page. Express authenticates admin accounts and applies their role and 2FA rules. Auth.js stores either provider's tokens in an encrypted httpOnly cookie. Student routes require an accepted student session; visitors do not log in and use public, rate-limited guest endpoints.

## Academic session lifecycle

1. VC sets the session end date. Posting of classes, assignments, announcements and events is blocked for that school.
2. VC sets the new session date. A job raises every student's level by one.
3. A job builds the graduation recommendation by rule. Gemini adds an advisory note using anonymised data only.
4. The VC approves. Accounts are deactivated at once and purged after 7 days. Without approval they stay active for 30 days and the recommendation is raised again.

## Offline and low data

- Catlas's own location data is saved on the device when a location is searched.
- Google map tiles and routes are not cached.
- Low data mode serves small images, turns off animations and loads the map only on tap.

## Environments

| Environment | Purpose | Data |
|---|---|---|
| Local | Development | Seeded demo data |
| Preview and staging | A Vercel preview for every pull request; a separate staging comes later; weekly security scan | Demo data only |
| Production | Real schools | Real data |

The demo school is flagged `is_demo`, uses the owner's own department, and is removed before launch.

**Branching:** `main` is production. Work happens on short-lived branches (`feat/...`, `fix/...`), each merged through a pull request that gets a Vercel preview and must pass CI. A long-lived `staging` branch is added when real schools are onboarded.

## Hosting plan

Phase 1: Vercel for frontend and backend, with a managed Postgres (and a second one for the waitlist). The demo expects fewer than 2,000 users, so this is enough. The frontend and backend are two Vercel projects, each with its own root directory and environment variables. Later: move the backend and databases to a platform such as Railway or a VPS. The backend stays portable (plain Express, configuration from environment variables).

## Scaling notes for 300,000+ users

- Index `school_id`, `department_id`, `level` and the trigram column used for search.
- Paginate every list.
- Cache read-heavy, rarely changing data (locations, buildings) at the edge or in memory where safe.
- Use Cloudinary automatic format and quality; lazy-load images and the map.
- Batch emails and use digests for reminders.
- Watch Google Maps usage, which is billed per use.

## Security layers

Described in `docs/DEVSECOPS.md`: CI checks, secret scanning, dependency checks, code scanning, DAST, pipeline hardening and app-level hardening (headers, CORS allowlist, rate limits, input validation, 2FA for senior roles, audit log, scoping tests).

## Data retention

Default 30 days for recent searches, read notifications, closed reports, unverified accounts and admin-deactivated accounts. Self-deleted accounts are removed at once. Audit logs are kept longer, and entries for deleted users keep only an anonymised ID. Details in `docs/DATA-MODEL.md`.
