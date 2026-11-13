# AGENTS.md — Catlas (Campus Navigation System)

Instructions for AI coding agents (Codex, Claude Code, Gemini CLI and others) working in this repository. Read this file first. It is short on purpose: the details live in `docs/`, and you read the right doc when the task needs it. If a doc and a request conflict, ask the owner.

## Where to find things

| You need | Read |
|---|---|
| Product behaviour: roles, login, pages, landing page, AI assistant, dashboards, demo data, future versions | `docs/PRODUCT.md` |
| Colours, fonts, animation, cats, logo, design references | `docs/DESIGN.md` |
| Prompts for generating designs and images | `docs/DESIGN-PROMPTS.md` |
| Landing page build plan, owner inputs, draft copy | `docs/LANDING-PAGE-PLAN.md` |
| Tables, fields, data retention | `docs/DATA-MODEL.md` |
| Every file and folder | `docs/FILE-STRUCTURE.md` |
| API rules and endpoints | `docs/API.md` |
| How the system fits together, environments, hosting | `docs/ARCHITECTURE.md` |
| CI, security checks and hardening | `docs/DEVSECOPS.md` |
| Terms (JAMB, matric, VC, HOD, and others) | `docs/GLOSSARY.md` |
| Contributing and reporting a vulnerability | `CONTRIBUTING.md`, `SECURITY.md` |

## 1. Project summary

Catlas helps students and visitors at Nigerian higher institutions navigate their campus. Users search a location, see its photo, building details and what is inside, then follow a live 2D map route with distance. Class governors post class updates and assignment deadlines that reach only students of the matching department and level.

Owner and founder: Fadero Joshua (phadecoh). Long-term scale target: 300,000+ users across many schools. The demo expects fewer than 2,000 users. Schools will later be billed per registered user (billing is out of scope for now).

**Current phase:** build the landing page first (see `docs/LANDING-PAGE-PLAN.md`), then the app. The demo school is Federal University of Oye, Ikole Campus. The pilot faculties are Faculty of Engineering and Faculty of CIESA, with departments listed in `README.md`.

## 2. Hard rules

1. **Secrets go in `.env`.** All tokens, API keys, database URLs, auth secrets and email keys live in `.env` files. Never hardcode, log or commit them. Keep `.env.example` files with empty values up to date.
2. **The repository is public for now.** Never commit real student data, real phone numbers, private photos or secrets. Demo data is fake.
3. **No emojis anywhere.** Not in the UI, code, comments, commit messages, logs, tests or docs. Use the icon package instead.
4. **Strict school isolation.** Every school-scoped query filters by `school_id`. A user of one school must never read or write another school's data.
5. **Strict scope per role.** Each dashboard sees only its own scope (`docs/PRODUCT.md`, Who sees what). Enforce it on the server, never only in the frontend.
6. **Strict level scoping for class updates and assignments.** An update targets one department and one level. Students see only what matches their own department and level.
7. **Only class governors post classes and assignments.** Announcements and events come from committee, HOD, Dean and VC for their own scope.
8. **Visitors** see only the locations their school marked as visitor-accessible.
9. **2D maps only.** No 3D buildings, tilt or heavy map layers. Many users are on phones with limited data.
10. **Respect the session lock.** When a school's session has ended, uploads of events, classes and assignments are blocked.
11. **Graduation and admin deletions need human approval.** Users may delete their own account at once. **No personal data goes to the AI service.** Never log personal data.
12. **Do not invent product decisions.** If something is in Open decisions below, ask the owner. If you have a suggestion for the product or these docs, ask before adding it.
13. **Ask before adding dependencies** that are not in the approved stack.
14. **Copy provided designs exactly.** Do not redesign them. Do not write the privacy policy or terms text; those pages show 404 until the owner writes them.
   - Design screenshots show mobile app screens. Do not add a simulated phone status bar or operating-system chrome to the page; those details only indicate the mobile device preview. Keep the supplied mobile layout intact and adapt the same design for desktop.
   - All student app routes share the header and footer from `AppShell`. The header shows the Catlas logo/name, Africa/Lagos time-of-day greeting, notifications, theme control, and a profile button linking to Account; do not add page-specific duplicate headers or footers.
   - The location label beside the pin on Home must use the user's current device location after permission is granted. Do not hardcode a campus or location name; handle denied and unavailable location states.
   - The Near me shortcut opens a nearby-building search using the user's device location and school-provided building coordinates; sort results by distance and handle location permission states.
15. **Do not invent building data.** The owner supplies building names, photos and information.
16. Keep changes small and focused. Explain what you changed and why.
17. Catlas does not use usernames. Do not add username fields to sign-up, login, account details, or user records.
18. Admin dashboard previews may bypass login only in local development. Student app routes also allow a local development preview before auth and database setup. Never enable a preview bypass in production or use it to access real data.

## 3. Approved stack

| Layer | Choice |
|---|---|
| Language | TypeScript (strict) |
| Frontend | Next.js, Tailwind CSS, shadcn/ui |
| Icons | lucide-react (the shadcn/ui default) |
| Animation | Motion (formerly Framer Motion) |
| Backend | Node.js + Express (Python only if necessary, ask first) |
| Database | PostgreSQL with Drizzle ORM (use the `pg_trgm` extension for fuzzy search) |
| Waitlist database | A separate Supabase PostgreSQL project |
| Validation | Zod |
| Auth | Auth.js (frontend session) with Express as the identity source; 2FA with an authenticator app |
| Email | Resend |
| Image storage | Cloudinary |
| AI assistant (graduation advice, customer service, onboarding) | Gemini API, free tier to start |
| Maps and routing | Google Maps, 2D only |
| Package manager | pnpm |
| Quality | ESLint with Stylistic rules (formats code), Prettier (non-code files), Vitest |
| CI and security | GitHub Actions (`docs/DEVSECOPS.md`) |
| Hosting | Phase 1: Vercel (frontend and backend) with a managed Postgres; move up later (for example Railway or a VPS) when funded |

**Maps cost note:** Google Maps is billed per use. Load the map only on the navigate page, lazy-load the map script, and avoid repeat lookups.

**Hosting notes:** The demo expects fewer than 2,000 users, so start on Vercel. Vercel's free Hobby plan does not allow commercial use, so move to a paid plan before schools pay or before real marketing. Hobby cron jobs run at most once a day, which is enough for the level rollover and session lock; reminders may need a paid plan or an external scheduler. Scheduled jobs are protected endpoints called by the scheduler with a secret (`CRON_SECRET`). Keep the backend portable (plain Express, configuration from environment variables, no Vercel-only APIs in business logic) so moving to Railway or a VPS later is simple.

## 4. Environment variables

**apps/api/.env.example:** `PORT`, `DATABASE_URL`, `JWT_ACCESS_SECRET`, `CRON_SECRET`, `RESEND_API_KEY`, `GOOGLE_MAPS_SERVER_API_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GEMINI_API_KEY`, `FOUNDER_EMAIL`, `FOUNDER_INITIAL_PASSWORD`, `FRONTEND_URL`

**apps/web/.env.example:** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `SITE_URL`, `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `FOUNDER_EMAIL`

Only the browser Google Maps key, the Cloudinary cloud name, and the Supabase project URL and publishable key may use the `NEXT_PUBLIC_` prefix. Keep the Supabase secret key server-side. The legacy anon and service-role variables are supported as fallbacks. Restrict the Maps key to Catlas domains. Image uploads go through the backend using signed uploads, never with the Cloudinary secret in the browser. `FOUNDER_INITIAL_PASSWORD` is used once to create the founder account, must be changed at first login, and should be removed from `.env` afterwards.

## 5. Code conventions

Defaults; the owner can change them.

- TypeScript strict mode, no `any` without a comment explaining why
- Files and folders `kebab-case`; React components `PascalCase`; variables and functions `camelCase`; database columns `snake_case`
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Tests with Vitest, especially for role checks, scoping, session lock, level rollover, account deletion and bulk import
- Small, readable functions; validate all input on the server
- Never log personal data (names, phone numbers, matric numbers, emails, tokens); log IDs only
- REST under `/api/v1`, one error format, paginated lists; store time in UTC and show it in Africa/Lagos (details in `docs/API.md`)
- Keep the home page and search usable on slow 3G; respect low data mode
- No emojis, in any file
- Catlas is proprietary: do not change `LICENSE` or add open-source licence headers
- Check the licence of every new dependency and avoid copyleft licences (GPL, AGPL) in shipped code

### Readable code style

Write code to be read easily, not to be short.

- One item per line. When a function has more than one parameter, an object has more than one property, or an import has more than one name, put each on its own line.
- No long one-line code. Break long expressions, chained calls and conditions across lines. Keep lines under about 80 characters.
- Use clear names and small functions, and blank lines between steps.
- **Enforcement (decided):** ESLint with `@stylistic/eslint-plugin` formats and enforces this style in `.ts`, `.tsx` and `.js` files. Prettier handles only non-code files (Markdown, JSON, CSS, YAML) and ignores code files through `.prettierignore`, because Prettier would collapse short parameter lists onto one line.
- Rules to turn on: `function-paren-newline` (from 2 parameters), `function-call-argument-newline` (consistent), `object-curly-newline` and `object-property-newline` (one property per line, including imports and exports), `newline-per-chained-call`, `max-len` at 80, plus indent, quotes, semicolons and trailing commas.
- `pnpm format` runs `eslint --fix` on code and Prettier on the other files. CI fails if either finds a difference.

Example of the target style:

```ts
export function getSchool(
  data,
  error,
) {
  if (error) {
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
  };
}
```

## 6. Commands

```bash
pnpm install                          # install everything
pnpm dev                              # run web and api together
pnpm --filter @catlas/web dev            # web only
pnpm --filter @catlas/api dev            # api only
pnpm lint                             # ESLint
pnpm format                           # ESLint --fix (code) and Prettier (other files)
pnpm test                             # Vitest
pnpm audit                            # known-vulnerable dependencies
pnpm --filter @catlas/api db:generate    # create a Drizzle migration
pnpm --filter @catlas/api db:migrate     # apply migrations
```

## 7. Open decisions and owner inputs

Do not decide open decisions on your own. Everything else is decided in the docs.

**Open decisions:** none at the moment. New ones are added here.

**Owner inputs still needed** (do not invent these):
- Confirmation of which of the four pilot departments is the owner's own
- Building names, photos and information for the demo
- Logo: supplied. `Four columns.png` at the repository root is the product logo, copied to `apps/web/public/logo.png`, and it is the source of the favicon and app icons. Do not generate another logo.
- Hero photo. The cat animations now live in `apps/web/src/components/cats/` instead of SVG files; only the calm waiting cat is still a stub
- Social media URLs for the footer (Instagram, Threads, LinkedIn, GitHub, X)
- A domain name (needed to send email to anyone other than the owner, and for a proper web address)
- Privacy policy and terms text (the pages show 404 until written; the public waitlist must not go live before the privacy policy page does)
- The owner's review of the draft landing page copy and FAQ in `docs/LANDING-PAGE-PLAN.md`

## 8. Before you finish any task

- No secrets, real personal data or emojis in code, logs or docs
- School, faculty, department and level scoping respected
- Role checks on the server
- Design tokens and icon package used
- Code follows the readable style; lint, tests and security checks pass
- Docs updated if behaviour changed
- Summary of changes given to the owner
