# Landing Page Build Plan

The landing page is built first. It is the public face of Catlas and collects the waitlist. The app comes after. Read `docs/PRODUCT.md` (Landing page) for the behaviour and `docs/DESIGN.md` for the look.

## Before you start: owner inputs

You can start today without most of these. Use placeholders and swap them in later.

| Input | Needed for | Can we start without it? |
|---|---|---|
| Website designs (Figma or screenshots) | Layout | Yes. Build from `docs/DESIGN.md`, then match the designs when they arrive |
| Logo | Header, footer, favicon | Supplied: `Four columns.png`, copied to `apps/web/public/logo.png` |
| Hero photo | Hero background | Yes. Use a neutral placeholder |
| Social media URLs | Footer icons | Yes. Placeholder links are shown until the real URLs arrive |
| A domain name | A proper web address, and newsletter emails | Yes. The waitlist works without it. Email only reaches your own address until a domain is verified with Resend |
| Privacy policy text | The consent link on the waitlist form | **No, for going public.** You can build and test with fake data, but do not share the link until the privacy policy page is live |
| Review of the draft copy below | All text | Yes. Edit it afterwards |

## Blockers before the page goes public

1. The privacy policy page is written and live (the consent checkbox links to it).
2. The waitlist form works end to end, and the consent checkbox is required.
3. Social links are filled in (or the icons are hidden).
4. Newsletter: a domain is verified in Resend. If not, hide the newsletter box until it is.
5. CI is green, and no secrets or real personal data are in the repository.

## What gets built

**Frontend (`apps/web/`)**
- App files: `src/app/layout.tsx`, `globals.css`, `not-found.tsx`, `error.tsx`, `loading.tsx`, `robots.ts`, `sitemap.ts`
- Marketing pages: `src/app/(marketing)/` with `layout.tsx`, `page.tsx`, `join` (the waitlist page), `privacy-policy`, `terms-of-service`, `feedback`, `newsletter/confirm` and `newsletter/unsubscribe` (the legal pages call `notFound()` until written)
- Components: everything in `src/components/landing/`, including `landing-page.tsx`, `waitlist-form.tsx`, `scroll-link.tsx` and the blurred launch countdown in `hero-countdown.tsx`; the cats in `src/components/cats/`; `layout/logo.tsx`; `layout/theme-toggle.tsx`; and the shadcn/ui pieces `accordion`, `button`, `card`, `checkbox`, `dialog`, `input`, `label`, `select`, `toast`
- Content: `src/content/landing-copy.ts` and `faq.ts`
- Helpers: `src/lib/api-client.ts`, `validation.ts`, `constants.ts`, `utils.ts`
- Styles and assets: `src/styles/tokens.css`, `fonts.css`, `public/fonts/`, `public/logo.png` (the product logo from `Four columns.png`), `public/favicon.ico`, `public/icon-192.png`, `public/apple-touch-icon.png`, `public/og-image.png`, `public/images/hero-background.jpg`
- Tests: `tests/landing-page.test.tsx`, `waitlist-form.test.tsx`, `newsletter-form.test.tsx`

**Demo map data (illustrative, not real map tiles):** the landing route animation traces the mapped roads around FUOYE Ikole Campus from OpenStreetMap (ways `387204844` and `387204865`), ending at the owner-pinned point 7.806024834425393, 5.4949744688978335; the drawn walk is about 814 m ("10 min walk" in the hero card). The building and area labels (Faculty of Engineering, Faculty of Agriculture, Campus Green, and so on) are placeholders until the owner supplies the real building names and photos.

**Backend slice (`apps/api/`), only what the landing page needs**
- Config files: `package.json`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `vercel.json`, `drizzle.waitlist.config.ts`, `.env.example`
- App: `src/index.ts`, `src/app.ts`, `src/config/` (`env.ts`, `cors.ts`, `rate-limits.ts`, `constants.ts`)
- Middleware: `request-id.ts`, `security-headers.ts`, `rate-limit.ts`, `validate.ts`, `error-handler.ts`
- Newsletter module: `src/modules/newsletter/` (routes, controller, service, schema)
- Email: `src/services/email.ts` and `src/services/email-templates/newsletter-confirm.ts`
- Utilities: `src/utils/errors.ts`, `logger.ts`, `tokens.ts`
- Tests: `src/tests/helpers/test-app.ts`, `waitlist.test.ts`, `newsletter.test.ts`

Waitlist entries are stored in a separate Supabase project. The landing page posts to `apps/web/src/app/api/waitlist/route.ts`; the founder dashboard reads them through a founder-authenticated route. Newsletter sign-up remains a separate future slice.

## Build order

1. **Repository.** Create the public GitHub repository, add the docs and root files (`package.json`, `pnpm-workspace.yaml`, `.gitignore`, `.prettierrc`, `.prettierignore`). In GitHub settings: protect `main`, turn on secret scanning with push protection, Dependabot alerts, code scanning and private vulnerability reporting. Done when `main` cannot be pushed to directly.
2. **CI first.** Add `.github/workflows/ci.yml`, `security.yml`, `dependabot.yml`, `CODEOWNERS` (start with `* @phadecoh8`) and the pull request template. Done when a test pull request runs lint, tests, build, Gitleaks and the dependency audit.
3. **Frontend scaffold.** Next.js (App Router, strict TypeScript), Tailwind, shadcn/ui, lucide-react, Motion, ESLint with Stylistic rules, Vitest. Download Arimo and Tinos as `.woff2` into `public/fonts/` with their licence text. Write `tokens.css`, `fonts.css` and `globals.css`. Done when a blank page shows the right fonts and colours, in light and dark mode.
4. **Sections, mobile first.** Build header, hero, animation section, how it works, about, FAQ, newsletter and footer from `src/content/`. Use the supplied logo and a placeholder hero photo. Add `not-found.tsx` with the crying cat. Done when every section matches the design on a 390 px screen and on desktop.
5. **Cats and the map animation.** Make the crying, happy and calm cat SVG components and the looping map animation (an SVG animated with Motion; static when reduced motion is on or low data mode is set). Done when the animation loops smoothly and does not load Google Maps.
6. **Backend slice.** Build the remaining backend files listed above. Validate every input with Zod. Newsletter: double opt-in with a confirmation email, an unsubscribe link in every email, and pending signups deleted after 7 days.
7. **Connect the waitlist.** The dialog posts to the Next.js route, which validates required consent, a honeypot field and minimum fill time before saving to Supabase. It reports duplicate registrations and shows a plain success message ("You are on the list").
8. **Quality pass.** Page title, description, Open Graph and Twitter tags, favicon, social preview image, `robots` and `sitemap`. Accessibility: one `h1`, alt text, visible focus, skip link, keyboard use of the dialog and accordion. Performance on a mid-range phone: Lighthouse performance 90 or more and largest contentful paint under 2.5 seconds.
9. **Tests.** The tests listed above. Add a test that bots are rejected (filled honeypot), that duplicates get "already registered", and that unconfirmed newsletter signups are not mailed again.
10. **Deploy.** Create a Supabase project for the waitlist and run `apps/web/supabase/schema.sql`. Create two Vercel projects, `web` (root `apps/web`) and `api` (root `apps/api`), each with its own root directory and environment variables. Verify a domain in Resend if you have one. Smoke test with fake data. Share the link only when the blockers above are cleared.

## Environment variables for this phase

- **api (`apps/api`):** `PORT`, `RESEND_API_KEY`, `FRONTEND_URL`
- **web (`apps/web`):** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `FOUNDER_EMAIL` (legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are supported as fallbacks)

The rest of the variables in `AGENTS.md` are not needed yet.

## Definition of done

- All sections match the design on mobile and desktop
- Waitlist works end to end with Supabase storage
- Legal pages show 404 until the owner writes them (then the privacy policy goes live before sharing)
- No tracking cookies, no third-party analytics or ad scripts, self-hosted fonts
- Lint, tests, build and security checks pass in CI
- No emojis, no secrets, no real personal data in the repository
- Lighthouse and accessibility targets met
- `CHANGELOG.md` updated

## Draft copy (review before use)

Items marked (confirm) are public statements you must be happy to make.

**Hero**
- Headline: Find any place on campus. Know what is inside.
- Sentence: Catlas shows you the building, what is inside it, and the walking route to get there.
- Button: Join waitlist

**Animation caption:** Pick a place. Follow the red trail. Arrive.

**How it works**
1. Search: Type a building, office or lab. Misspelled it? Catlas still finds it.
2. Navigate: See where you are, the red trail and the distance as you walk.
3. Arrive: Get a clear message when you reach your destination, and see what is inside.

**About**
- Who it is for: Students finding lecture halls and offices, and visitors finding the places a school has opened to them.
- How it is used: Search a place, open its card and tap Take me there. Class governors post classes and assignment deadlines for your department and level.
- How it helps: Less time lost on campus, fewer missed classes, and one place for building details, class changes and deadlines.

**Footer description:** Catlas helps you find your way around campus.

**FAQ**
Rendered on the landing page from `src/content/faq.ts`, still pending the owner's review.
Items 5 and 6 below are marked "(confirm)" until the owner confirms them.
1. **What is Catlas?** Catlas is a campus navigation app. It shows you a place, what is inside it, and the walking route to get there.
2. **Who can use it?** Students of schools that join Catlas, and visitors, who can see the places their school has opened to them.
3. **Do I need an account?** Students do. Visitors can tap Continue as guest to browse the places the school has made public.
4. **Does it work without internet?** If your network drops, Catlas keeps guiding you with your phone's GPS, using the details it saved for that place. Full offline maps are not available yet.
5. **Which schools can use it?** We are starting with a demo at one university, in the Faculty of Engineering and the Faculty of CIESA. More schools will follow. (confirm)
6. **How much does it cost?** Catlas is billed to schools, not to individual students. (confirm)
7. **What if a place or a detail is wrong?** Use the Report a problem button on any place. It goes to your school.
8. **What happens to my data?** We collect only what we need, and you can delete your account at any time from Settings. Your data is then removed immediately. Our privacy policy has the details.
9. **How do I join?** Join the waitlist. We will email you when your school is ready.

The same FAQ seeds `apps/api/src/modules/assistant/knowledge/faq.md` later.
