# Catlas — Campus Navigation System

A navigation platform for higher institutions in Nigeria. Students and visitors search for any place on campus, see what it looks like and what is inside, and get guided there on a live 2D map.

> Status: pre-development. Rollout starts with Federal University of Oye, Ikole Campus in Nigeria, then the rest of Nigeria universities. Long-term scale target: 300,000+ users. The demo expects fewer than 2,000.

## What it does

- **Search any campus location.** Typos still find results (similar matches), otherwise "not found" is shown.
- **Location card.** Building photo, building name, bookmark icon, the offices and classes inside, and a description of what the building is for.
- **Live route guidance.** A 2D map with your current location, a red destination pin, the red route trail and the distance in kilometres. On arrival: "Congratulations, you have reached your final destination."
- **Off-trail help.** If you leave the route, the app says it is readjusting and draws a new one.
- **Works through network drops.** Catlas's own data for a searched location is saved on the device, so GPS guidance to it keeps working. Google map tiles are not cached.
- **Inside buildings.** Offices and rooms are mapped by hand, first as a directory (building, floor, rooms), later as floor plans if schools provide them.
- **Class updates and assignments.** Class governors post class time and venue(which will have the map direction pinned to the class details), and where and when to submit assignments. Students see only what matches their department and level and students are also notified of class updates in-app and by email. 
- **Next class button.** The homepage shows your next class with a button that opens the map to its venue.
- **Class changes.** Governors mark classes cancelled or moved, and students are notified in-app and by email.
- **Announcements and events.** Posted by committees, HODs, Deans and the School Admin for their own scope.
- **Report a problem and feedback.** Flag a wrong location, photo or office detail, or an app bug. Send feedback to your school.
- **Low data mode.** Small images, no animations and the map loads on tap, for slow connections.
- **Catlas AI assistant.** Answers questions, teaches new users how to use the site, and knows what Catlas is.
- **Cat messages.** A crying cat for errors, a happy cat for arrival, account created and email verified, and a cat on the 404 and empty screens.
- **Extras:** bookmarks ("most bookmarked" ranking), in-app and email notifications, dark mode.

## Who uses it

| User | Login | Access |
|---|---|---|
| Fresher | JAMB Reg. No | Full campus. Green "not fully verified" badge until a matric number is added |
| Student | Matric number | Full campus. Blue "fully verified" badge |
| Visitor | Continue as guest button (no account) | A demo page with only the locations the school chose; no classroom, bookmarks or notifications |
| Class governor | Personal login | Posts classes and assignments; sees students in own department and level |
| HOD and committee | Personal login | Sees students in own department, one section per level; posts department announcements and events; cannot post classes |
| Dean | Personal login | Sees students of every department in the faculty; posts faculty announcements and events |
| School Admin | Personal login | Sees the whole school; sets session dates; manages the school's locations and buildings; bulk CSV uploads; posts school-wide announcements and events |
| Founder | Personal login | Sees all schools and user counts per school; creates dashboard accounts; adds faculties and departments during the demo; corrects a student's level when asked |

Every user picks their **school** at login and lands in that school's own space. New users verify their email. Emails (Resend) cover verification, password reset and notices. Dashboard accounts (School Admin, Dean, HOD, committee, governor) are created by the founder and handed over with a one-time temporary password that must be changed at first login.

**Verification (current plan):** during testing the founder verifies numbers manually. If a school approves Catlas, it sends a list of valid numbers to upload. If an official API is found, it is used instead.

## Academic session

- The School Admin sets the **session end date**. After it, uploads of events, classes and assignments stop.
- The School Admin sets the **new session date**. On that day every student moves up one level.
- Graduating students: the system recommends deleting their data, with an advisory note from the Gemini API (no personal data is sent to it). Only after the School Admin approves is it deleted, following a 7-day recovery window. If not approved, accounts stay active for 30 days.
- Users can delete their own account any time from Settings. It is deleted after some follow up questions.

## Pages

- **Landing page:** header with logo and Join waitlist button, hero with a small blurred launch countdown under the early access button, looping map animation (SVG), how it works (Search, Navigate, Arrive), about section, FAQ, and footer. The Get early access and Join the waitlist buttons link to the waitlist page at `/join`.
- **Login:** school selection, JAMB Reg. No or matric number and password, a Continue as guest button, email verification, password reset, admin entry
- **App pages:** a shared Catlas logo header with a time-of-day greeting and the signed-in user's surname, notifications and an Account profile button; a shared footer with Home, Search, Classroom, Settings and Catline
- **Homepage:** Near me, Central Library, Labs by faculty and Saved shortcuts; Events and Announcements sections. Near me searches nearby campus buildings from the user's device location.
- **Catline:** an AI assistant page opened from the final paw-print footer icon; Gemini API connection will be added later
- **Search:** category filter chips (most bookmarked, mini mart, and so on), in the style of Spotify's search page
- **Classroom:** classe details and assignments for the user's department and level
- **Settings:** Account (photo, surname and first name, school, department, delete account), Feedback (to the founder dashboard), privacy policy, terms of service, low data mode, Log out. Catlas does not use usernames.
- **Founder admin:** Supabase Auth sign-in and a dashboard for reviewing waitlist entries.

## Pilot scope

- **Faculty of Engineering:** Mechanical Engineering, Material Engineering
- **Faculty of CIESA:** Mechatronics Engineering, Computer Engineering

The founder adds faculties and departments during the demo; later deans do it. More departments (Civil, Agriculture and Bio material, Electrical, Systems Engineering) come later.

**Demo and test run:** the founder's own department is the demo, with fake demo accounts for every role. The founder supplies the building names, photos and information. Demo accounts are deleted before launch.

**Future versions:** a Staff role, dean-managed departments, floor-plan indoor maps, offline campus paths, and payments.

## Tech stack

| Layer | Choice |
|---|---|
| Language | TypeScript, python |
| Frontend | Next.js, Tailwind CSS, shadcn/ui |
| Icons and animation | lucide-react, Motion |
| Backend | Node.js + Express |
| Database | PostgreSQL with Drizzle ORM for the app; Supabase PostgreSQL for the separate waitlist database |
| Auth | Auth.js with Express as the identity source; Supabase Auth for founder dashboard sign-in |
| Email | Resend |
| Images | Cloudinary |
| AI assistant | Gemini API, free tier to start (graduation advice, customer service, onboarding) |
| Maps and routing | Google Maps (2D only) |
| Package manager | pnpm |
| Quality | ESLint with Stylistic rules (formats code), Prettier (non-code files), Conventional Commits |
| CI and security | GitHub Actions (secret scanning, dependency checks, CodeQL, ZAP) |
| Hosting | Phase 1: Vercel (frontend and backend) with a managed Postgres; move up later when funded |

## Design

- **Colour split:** white 60%, blue 20%, ash `#333333` 10%, black `#000000` 10%
- **Buttons:** solid blue; the background gets lighter on hover
- **Minor colours:** red for errors and the route trail, emerald for success, light grey borders
- **Typography:** Arial for body and UI, Times New Roman for headings, with self-hosted look-alikes (Arimo and Tinos) for phones that lack them
- **Cards** lift up on hover with a shadow; **icons** are lightly animated (the location icon bobs)
- **Logo:** a blue campus building with a location icon (black and ash)
- **Icons and animation:** icon package and Motion; no emojis anywhere in the project
- **Dark mode:** supported

Exact values live in `apps/web/src/styles/tokens.css`. Blue is `#1D4ED8` (lighter `#2563EB` on hover). The owner provides the website designs and the layout is copied exactly. The reference screens are described in `docs/DESIGN.md`.

## Project structure

Top-level shape only. Every file is listed in `docs/FILE-STRUCTURE.md`. Folders end with `/`. Generated files (such as migrations) are shown for completeness there.

```
catlas/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── GEMINI.md
├── CODEX.md
├── SECURITY.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── .gitignore
├── .prettierrc
├── .prettierignore
├── package.json
├── pnpm-workspace.yaml
├── docs/
│   └── (product, design, data model, API and operations docs)
├── .github/
│   └── (CI workflows, dependabot, CODEOWNERS, PR template)
└── apps/
    ├── web/          Next.js: landing page, student app and dashboards
    │   ├── public/
    │   └── src/
    └── api/          Express: /api/v1, database, jobs and services
        └── src/
```

## Getting started

These steps work once the project is scaffolded. The landing page is built first: see `docs/LANDING-PAGE-PLAN.md`.

Requires Node.js (LTS) and pnpm.

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
# fill in the values in both .env files
pnpm --filter @catlas/api db:migrate
pnpm dev
```

Create a Supabase project for the waitlist, then run
`apps/web/supabase/schema.sql` in its SQL editor. Create the demo founder
account in Supabase Auth and set `FOUNDER_EMAIL` to that account's email. Add
the Supabase project URL, anon key, and service role key to `apps/web/.env`.
Keep the service role key private. The founder's password is managed by
Supabase Auth and must not be committed to the repository.

The waitlist form includes name, school, faculty, department, level, email,
and required privacy consent. Keep it off a public deployment until the
privacy policy is written and live.

## Environment variables

All secrets live in `.env` files, which are never committed. Each app has a `.env.example` with empty values.

**apps/api/.env.example**
```
PORT=
DATABASE_URL=
JWT_ACCESS_SECRET=
CRON_SECRET=
RESEND_API_KEY=
GOOGLE_MAPS_SERVER_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GEMINI_API_KEY=
FOUNDER_EMAIL=
FOUNDER_INITIAL_PASSWORD=
FRONTEND_URL=
```

**apps/web/.env.example**
```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
AUTH_SECRET=
AUTH_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
FOUNDER_EMAIL=
```

Restrict the browser Google Maps key to the Catlas domains in the Google Cloud console.

## Security

Every pull request runs lint, type-check, tests and build, plus secret scanning, dependency checks and code scanning. A weekly scan attacks a staging copy of the app. Details are in `docs/DEVSECOPS.md`. To report a vulnerability, see `SECURITY.md`.

## Roadmap

1. Build the landing page first, then the app with demo logins and test run
2. At launch, turn waitlist entries into accounts
3. Data protection work (Nigeria Data Protection Act), scheduled backups with a restore test, a staging deployment, error monitoring and uptime alerts
4. Marketing
5. Payments and billing once buyers are found

## Conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`)
- Readable code: one item per line, enforced by ESLint Stylistic rules
- Tests with Vitest
- No emojis in code, UI, commits or docs

## Brand

The product logo is `Four columns.png` at the repository root. The website uses a copy at `apps/web/public/logo.png`, and the favicon, `icon-192.png` and `apple-touch-icon.png` are made from the same file.

## Docs

- `AGENTS.md`: the main instructions for AI coding agents (`CLAUDE.md`, `GEMINI.md` and `CODEX.md` point to it)
- `docs/PRODUCT.md`: what Catlas does, roles, login, pages, dashboards, demo data, future versions
- `docs/DESIGN.md`: colours, fonts, cats, logo, design references
- `docs/DESIGN-PROMPTS.md`: prompts for generating the app designs, landing page and images
- `docs/LANDING-PAGE-PLAN.md`: the landing page build plan, owner inputs and draft copy
- `docs/DATA-MODEL.md`: tables, fields, data retention
- `docs/FILE-STRUCTURE.md`: every file and folder
- `docs/ARCHITECTURE.md`: how the system fits together
- `docs/API.md`: API conventions and endpoint plan
- `docs/DEVSECOPS.md`: CI, security checks and hardening
- `docs/GLOSSARY.md`: terms used in the project
- `SECURITY.md`: how to report a vulnerability
- `CONTRIBUTING.md`: how to contribute
- `CHANGELOG.md`: what changed and when

## License

Proprietary. All rights reserved. See `LICENSE`. The repository is public for now, but the licence still forbids using the code.
