# Changelog

All notable changes to Catlas are recorded here. The format follows Keep a Changelog, and versions follow Semantic Versioning.

## [Unreleased]

### Added
- Dark, mobile-first Catlas landing page with a 2D animated walking route and arrival notification preview
- Responsive landing page with countdown, animated route illustration, FAQ, waitlist form and optional newsletter
- Separate PostgreSQL waitlist and newsletter tables with validation and double opt-in routes
- Founder sign-in with an HTTP-only signed cookie and a protected paginated waitlist dashboard
- Project documentation: `README.md`, `AGENTS.md`, `CODEX.md`, `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, `docs/`
- Planned scope for the pilot: Faculty of Engineering and Faculty of CIESA
- Planned features: campus search with map routing, location cards with indoor details, class updates and assignments, class changes, next class button, announcements and events, report a problem, low data mode, bulk upload, account deletion
- Landing page spec (built first): header with Join waitlist, hero, looping map animation, about, FAQ, newsletter and footer
- Planned: account page, feedback to the school, Catlas AI assistant (customer service and onboarding), cat error and success animations, red route trail with off-trail readjusting
- Decided: landing animation as SVG, immediate account deletion, Continue as guest button to a demo page, readable one-item-per-line code style
- Decided: ESLint Stylistic rules enforce the readable code style; audit-log entries for deleted users are anonymised
- Documentation rebuilt from scratch, with a full file-by-file project structure in `README.md` and `AGENTS.md`
- Documentation split so coding agents can read it: `AGENTS.md` (core rules) plus `docs/PRODUCT.md`, `DESIGN.md`, `DATA-MODEL.md`, `FILE-STRUCTURE.md` and `DEVSECOPS.md`; `CLAUDE.md`, `GEMINI.md` and `CODEX.md` point to `AGENTS.md`
- Decided: Staff role moved to a future version; class governors keep their class as levels rise; classes are posted one at a time; waitlist fields; 2FA with an authenticator app; walking routes with GPS fallbacks; self-hosted look-alike fonts; public repository for now; demo faculties and departments
- Design prompts for the app, landing page and images in `docs/DESIGN-PROMPTS.md`
- Decided: hover blue `#2563eb` and accessible text colours; Neon Postgres for the waitlist database; newsletter subscribers stored with the waitlist; double opt-in and spam protection on the landing forms; 12-month audit log retention; the founder and each VC read the audit log; home screen shows Legend and Category cards; optional building opening hours; move off Vercel when the first school pays
- Added `docs/LANDING-PAGE-PLAN.md` with owner inputs, build order and draft copy
- Planned security setup: GitHub Actions for CI, secret scanning, dependency checks, code scanning and DAST
- LinkedIn icon in the landing footer
- Small blurred launch countdown under the hero early access button, with the date in one constant in `hero-countdown.tsx`
- Owner-supplied product logo `Four columns.png`, copied to `apps/web/public/logo.png`, shown in the header, footer and join page brand marks, and used for `favicon.ico`, `icon-192.png` and `apple-touch-icon.png`

### Decided
- Stack: Next.js, Express, PostgreSQL with Drizzle, Auth.js, Resend, Cloudinary, Google Maps (2D)
- First hosting on Vercel, moving up later
- Proprietary licence
