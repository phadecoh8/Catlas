# Catlas Product Spec

What Catlas does and how it behaves: roles, login, pages, features, dashboards, demo data, future versions and roadmap. Read this before building or changing a feature.

## Roles, accounts and login

Every dashboard role has a **personal login** (no shared school password).

| Role | Created by (for now) | Signs in with | Lands on |
|---|---|---|---|
| Founder | Seeded from `.env` (the owner) | Email and password | Founder dashboard |
| VC (Vice-Chancellor) | The owner | Email and password | VC dashboard |
| Dean (one per faculty) | The owner | Email and password | Dean dashboard |
| HOD and department committee | The owner | Email and password | Department dashboard |
| Class governor | The owner | Email and password | Governor dashboard |
| Student | Self sign-up | Email and password | Student app |
| Visitor | No account | "Continue as guest" button | Demo page |

The **Staff** role is planned for a future version (see Future versions).

**Account handover.** The owner creates every dashboard account and hands the login over when the person is ready. Do not store per-user passwords in `.env`; that file is only for app secrets and the first founder account. Instead, an admin tool or seed script creates each account with a one-time temporary password that is shown once. The user must change it at first login, and high-privilege roles must set up 2FA. Later, each role may create the accounts below it.

**Visitors**
- The login page has a separate **Continue as guest** button. It takes the visitor straight to a demo page. No sign-up, no email, no account.
- The demo page lets a guest search and use the map, but only for the locations the school marked as visitor-accessible.
- A guest has no classroom, assignments, bookmarks or notifications. Recent searches stay on the device only.
- Guest endpoints are rate limited.

**Students**
- Students sign in with their verified email address and password. JAMB and matric numbers identify enrollment; they are not login names.
- At sign-up the user gives surname, first name, phone number, school, faculty, department, level, email and password. JAMB Reg. No is optional for freshers. Catlas does not use usernames.
- Before the account is created, show a consent line that links to the privacy policy and terms of service, as data protection law requires.
- **Level is self-declared.** If a student's level is wrong, they send feedback and it reaches the founder dashboard, where the owner corrects it.
- **Verification now:** the owner verifies numbers manually while testing. Build a `VerificationRecord` table an admin can fill by hand.
- **Verification later:** a school can send a list of valid numbers (CSV) to upload. If an official API is found, it replaces the upload. Keep this behind a `verification` service so the source can be swapped.

**Supabase Auth** verifies student email addresses and manages their passwords and refresh sessions. Resend covers notices (announcements, class changes and assignment reminders).

**Notifications** go both in-app and by email. Keep email volume sensible (batch or digest where possible).

**Two-factor authentication (decided)**
- The founder, VC, Dean and HOD accounts use an authenticator app (a time-based code).
- At first login, after the temporary password is changed, the user scans a QR code and receives 10 one-time backup codes. The backup codes are shown once and stored hashed.
- Lost phone: the user signs in with a backup code. If none are left, the founder resets the 2FA of a VC, Dean or HOD after checking the person's identity. The founder's own recovery uses the backup codes, which the owner keeps safe.
- Email and SMS codes are not used: email codes are weaker, and SMS is costly and unreliable.

**Login and session flow (decided)**

Supabase Auth owns student passwords, email verification and refresh sessions. The `profiles` table stores each student's role and campus scope. Auth.js encrypts the Supabase tokens in an httpOnly frontend session cookie. Dashboard accounts continue to authenticate through Express and use its role, 2FA and refresh-token rules.

1. A student signs up with email, password and their school, faculty, department and level. Visitors use **Continue as guest** and do not create accounts. Dashboard roles use email and password on the shared admin login page.
2. The Next.js signup route sends validated details to Supabase Auth. A database trigger creates a student profile with the `student` role; user metadata cannot assign an admin role.
3. Supabase sends the email verification link. A student must verify the email before password sign-in succeeds.
4. Auth.js authenticates students with Supabase Auth and keeps its access and refresh tokens in an encrypted, httpOnly cookie. Tokens are not exposed to browser JavaScript.
5. Auth.js refreshes expired student access tokens server-side and revokes the Supabase session at logout. Row-level security limits profile reads to the signed-in user.
6. Admin sign-in continues through Express, including its 2FA flow and role-specific dashboard. Admin access and refresh tokens remain in the Auth.js cookie.

Two secrets, never shared: `AUTH_SECRET` (frontend, encrypts the Auth.js cookie) and `JWT_ACCESS_SECRET` (backend, signs access tokens).

## Who sees what

| Role | Student info visible (name, matric number, phone number) |
|---|---|
| Class governor | Students in their own department and level only |
| HOD and committee | Students in their own department, shown as a section per level (100 to 500) |
| Dean | Students of every department in their faculty |
| VC | All students in the school |
| Founder | School-level counts only (registered users per school). One exception: from a feedback item the founder can see that student's name and declared level and correct the level. Every such correction is written to the audit log |

Rules:
- Collect only what is needed. Phone numbers and matric numbers are personal data.
- Log every dashboard access to student lists in the audit log.
- Only class governors post class updates and assignments, and only for their own department and level. HODs, committees, Deans and the VC can view but cannot post them.
- **Announcements and events** are posted by every dashboard role except class governors, each for their own scope: HOD and committee for their department, Dean for their faculty, VC for the whole school. The founder sends platform notices only (for example maintenance). Class governors cannot post them.
- **Feedback** sent by users from Settings goes to the HOD, Dean and VC dashboards of the user's school, and to the founder dashboard.
- **Audit log:** the founder reads the log for all schools. A VC reads only their own school's log. No other role can read it.

## Academic session, levels and graduation

- The **VC sets the session end date** per school. After that date, uploads of events, classes and assignments are blocked for that school.
- The **VC sets the new session start date.** On that day a scheduled job moves every student up one level (100 to 200, and so on). The job must be safe to run twice.
- The final level differs by department (for example 400 or 500). Make it a setting.
- **Class governors are not reassigned.** Their level rises automatically with their students on the new-session date, so a governor stays with their own class.
- **Graduating students** are those at the final level when the session ends.
- The system produces a **graduation recommendation** listing the accounts and data to delete. The list is built by a plain rule. The AI (Gemini API) only adds an advisory note tagged "yes" or "review" and never decides.
- Send the AI **no personal data**: no names, phone numbers, matric numbers or emails. Send only anonymised counts and IDs. Free-tier prompts may be used by Google to improve its products.
- The **VC approves** it (the "head of the database"). Nothing is deleted without that approval, and the approval is written to the audit log.
- After approval, accounts are deactivated at once and permanently purged after a **7-day recovery window**, so a mistaken approval can be undone.
- If it is not approved, those accounts stay active for **30 days**, after which the recommendation is raised again. Accounts are never auto-deleted.
- A final-year student who has not graduated (for example a carry-over) must never be deleted automatically. The VC reviews the list and can remove names before approving.

## Landing page (build this first)

The landing page is built before the app and lives at `/`. The owner provides the design; copy the layout exactly.

- **Header:** logo and site name on the left; a **Join waitlist** button on the right.
- **Hero:** a short description of what Catlas is about, with a background image that shows the Catlas concept. Under the early access button sits a small countdown to launch; it stays blurred and blocked from the pointer until the owner is ready to show the date.
- **Animation section:** a short animation, repeating over and over, of a map showing the user's location and the final destination, and the user reaching it. Build it as an SVG animation with Motion, not a video (decided). It must not load Google Maps.
- **How it works strip:** three short steps with icons: Search, Navigate, Arrive. It explains the product at a glance.
- **About section:** who Catlas is for, how it is used, and how it benefits them.
- **FAQ section:** the agent writes the questions people are most likely to ask about the product. The same text feeds the Catlas AI assistant (see the Catlas AI assistant section).
- **Newsletter:** a signup box where people subscribe with their email to get updates. Use double opt-in: send a confirmation email and add the address only after the link is clicked. Every newsletter email has an unsubscribe link. Subscribers are stored in the separate Supabase project.
- **Footer** (follow the footer layout of fildtek.com): name, description, social icons (Instagram, Threads, LinkedIn, GitHub, X), and links to the privacy policy, feedback and other necessary pages. If the icon package has no brand icons, ask before adding another package.
- **Bottom bar:** "Copyright [current year] and all rights reserved" (the year comes from code, not typed), the founder's name, and links to the founder's GitHub and portfolio.
  - Founder: Fadero Joshua (phadecoh)
  - GitHub: github.com/phadecoh8
  - Portfolio: phadecoh.vercel.app
- **Logo, favicon and social preview:** the product logo is `apps/web/public/logo.png`, taken from the owner's `Four columns.png`. The favicon and app icons (`favicon.ico`, `icon-192.png`, `apple-touch-icon.png`) are made from it. The Open Graph image still needs making so shared links look good.
- **Page quality:** server-rendered, semantic HTML, one `h1`, alt text for images, visible focus styles, a skip-to-content link, and `prefers-reduced-motion` respected. Set the page title, description, Open Graph and Twitter tags, and add `robots` and `sitemap`. Targets on a mid-range phone: Lighthouse performance of 90 or more and largest contentful paint under 2.5 seconds, with the hero image served at the right size in a modern format.
- **Privacy by design:** no tracking cookies, no third-party analytics or ad scripts, and self-hosted fonts, so no cookie banner is needed. Add one only if that changes.
- **Legal pages:** create the routes for the privacy policy and terms of service, but do not write their text. They show the normal 404 "not found" page until the owner writes them. The owner writes them to follow the law (the Nigeria Data Protection Act 2023 and any other applicable law); a lawyer's review is recommended.

**Waitlist**
- There is no waitlist page. The header button opens a form where people leave their details. The form collects **name, school, faculty, department, level and email**, and a required consent checkbox that links to the privacy policy.
- Spam protection without a third-party captcha: a hidden honeypot field, a minimum fill time, and rate limiting.
- The waitlist and student authentication use the configured Supabase project. Student passwords are managed by Supabase Auth; waitlist entries remain separate from student profiles.
- If someone who has already registered submits the form again, tell them they have already registered.
- At launch the owner turns waitlist entries into accounts. The agent helps the owner plan how when the time comes.

## App pages and features

- **Splash screen:** shows the logo and name for a moment when the app first loads.
- **Login:** school selection, JAMB Reg. No or matric number and password, a **Continue as guest** button, email verification, forgot and reset password, forced password change for temporary passwords, the two-factor screens for senior roles, admin entry.
- **App shell:** every student app page uses the same header and footer. The header shows the Catlas logo and name, a time-of-day greeting with the signed-in user's surname in Africa/Lagos time, notifications, a theme menu and a profile button that opens Account. The theme menu opens the available theme choices. Settings also links to a dedicated Theme page.
- **Homepage:** the Go somewhere shortcuts open Near me, Central Library details, Labs by faculty, and Saved places. It also includes Events and Announcements sections, alongside recent searches, the Next class card, a Legend row of faculty tiles, and Category cards of building types. HODs and department committees post for their department, Deans for their faculty, and the VC for the whole school. Students see items scoped to their school and academic scope.
- **Near me:** the home shortcut opens nearby search. It uses the user's location to find and show nearby campus buildings, ordered by distance. Ask for location permission when needed and explain when location is unavailable.
- **Footer tabs:** Home, Search, Classroom, Settings, Catline.
- **Catline:** the AI assistant page, opened from the final paw-print footer tab. It answers questions about Catlas and helps users learn the app. Gemini is not connected yet.
- **Search:** search box plus filter chips for general categories (most bookmarked, mini mart, and so on), styled like Spotify's search page. For a misspelled query, show similar results (fuzzy match with `pg_trgm`). If nothing is close, show "not found".
- **Location card** (after tapping a result): building photo, building name, bookmark icon, the offices and classes inside, and a description of what the building is for. There is no like button. "Most bookmarked" is ranked by bookmark count.
- **Map page:** 2D map with the user's current location, a red destination pin, the route drawn as a red trail (the same red as the pin) and the distance in km. The location icon bobs up and down. A compass button and zoom in and zoom out buttons sit on the map, and a bottom sheet shows the building name, its opening hours when set, and a **Go to Details** button that opens the location card. The route and GPS rules are under Navigation behaviour in the routing section.
  - **Off the trail:** if the user leaves the trail, pause for a moment, show "Readjusting and redirecting trail", then draw a new route.
  - **Inside buildings:** the trail ends at the building entrance. There is no trail inside a building, so the app then offers the building's indoor options (floors, offices, rooms) to choose from.
  - **Arrival:** show "Congratulations, you have reached your final destination." with the happy cat animation.
- **Offline behaviour:** when a location is searched, save Catlas's own data (name, coordinates, photo, building details, indoor details) on the device. If the network drops, show that saved information and keep guiding with the phone's GPS, using the saved coordinates for distance and direction. Do not cache Google map tiles or Google route responses, because Google's terms restrict that. A fully offline turn-by-turn route needs Catlas's own campus path data, which is a later phase.
- **Next class button:** the homepage shows the soonest upcoming class that a class governor has posted (time, course, venue) with a button that opens the map straight to that venue. If no class is posted, show the calm cat empty state.
- **Classroom:** time, venue and course, scoped to the user's department and level. Classes are posted one at a time, because lessons can be impromptu. There is no recurring timetable.
- **Class changes:** a class governor can mark a class as cancelled or moved (new time or venue). Students get an in-app notification and an email, and the classroom list shows a "cancelled" or "moved" badge with the old details.
- **Assignments:** class governors post where and when to submit each assignment (course, title, deadline, submission location tagged from the school's locations, notes). Students see them in the classroom area, with in-app and email reminders.
- **Report a problem:** a button on every location card and in the help centre. The user picks a type (wrong location, wrong photo, wrong office or room details, app bug, other) and may add a note. Location reports go to the VC dashboard; app bugs go to the founder dashboard.
- **Low data mode:** a toggle in Settings, also suggested when the connection is slow. It loads small images (or none until tapped), turns off animations, loads the map only after a tap, and avoids prefetching. Use Cloudinary automatic format and quality in every mode.
- **Bulk upload (VC dashboard):** CSV upload for verification lists, locations, buildings and indoor places. Provide a downloadable template. Validate every row with Zod and show a preview with row-level errors before anything is saved. Import all-or-nothing, set `school_id` from the uploader's account and never from the file, neutralise spreadsheet formulas (cells starting with `=`, `+`, `-` or `@`), limit file size, and write the import to the audit log.
- **Settings:** Preferences (including Account), Feedback, privacy policy, terms of service, low data mode, and Log out.
  - **Account page:** profile photo upload (Cloudinary); surname and first name (editable in case of a mistake); school and department (shown); and **Delete account**. Catlas does not collect or use usernames.
  - **Delete account:** the user must type "delete account" and re-enter their password. The account and its personal data are then deleted from the database immediately, with no waiting period. This cannot be undone, so the confirmation screen must say so.
  - **Feedback page:** the user sends feedback to their school. It appears in the HOD, Dean and VC dashboards.
- **Extras:** bookmarks, campus events, class reminders, and Dark, Sepia, AMOLED and Midnight themes.

## Catlas AI assistant

One assistant, powered by the Gemini API (free tier to start), with four jobs:

1. **Graduation advice** for the admin side (see Academic session).
2. **Customer service:** answer questions about Catlas and common problems.
3. **Teach new users** how to use the website (a first-run guide).
4. **Know Catlas:** what it is, its features, who it is for, how it helps, and the FAQ.

Rules:
- It answers only from a curated Catlas knowledge base (`apps/api/src/modules/assistant/knowledge/`), not from the open web.
- It has no access to student data, accounts or any action. It never changes anything.
- Send it no personal data (see Academic session).
- If it cannot help, it points to Report a problem or the user's school.
- Label it clearly as an AI assistant. Rate limit it, and fall back to the FAQ when the free tier is unavailable.
- Treat everything users type as untrusted (prompt injection). Do not store conversation text by default.
- Catline is opened from its own footer tab. The assistant page does not send messages until the Gemini service is connected.

## Routing, navigation and indoor mapping

- Outdoor routes use Google's routing for now, in walking mode.
- **Who edits what:** schools add and edit locations and buildings (including photos and visitor access) in the VC dashboard. The owner maps building interiors by hand for now; the VC dashboard may later get the same editor.
- **Indoor, phase 1 (now): directory.** Building, then floor, then offices and rooms, each with a photo, description and "how to reach it from the entrance" steps. The owner maps interiors by hand. Do not auto-generate them.
- **Indoor, phase 2 (later): floor plans.** If a school supplies building plans, add a floor-plan image per floor with pinned rooms.
- Build indoor display behind a small interface so phase 2 can replace phase 1 without rewriting pages. Store rooms as `IndoorPlace`; add a `FloorPlan` and pin coordinates later.

**Navigation behaviour (decided; numbers are defaults the owner can tune)**
- **Route mode:** walking.
- **Location permission denied:** do not block the user. Show the destination pin, the building details and a short message on how to turn location on. Offer a "Where are you now?" search to pick a nearby building as the starting point, then draw the route from it. Without a live position there is no live trail and no arrival detection.
- **Weak or inaccurate GPS, or the user is indoors:** show a small "GPS signal is weak" notice, keep the last good position, and do not trigger re-routing.
- **Off-trail detection:** the user counts as off the trail only when they are farther from it than 30 m (or twice the reported GPS accuracy, whichever is larger) for at least 5 seconds. After a re-route, wait at least 20 seconds before another. After 5 automatic re-routes in one trip, stop and show a **Re-route** button instead.
- **Arrival:** within 20 m of the destination or building entrance, show the arrival message.
- **Cost control:** one route request when navigation starts, and re-routes only as above. In the Google Cloud console set a monthly budget with alerts and daily quotas on the routing and Maps JavaScript APIs. Limit route requests per user. Never cache Google responses.
- **If Google fails or the quota is used up:** show the straight-line distance and a compass direction to the destination, with the building details and a short message. No trail.

## Dashboards

The Founder dashboard sidebar includes Dashboard, Waitlist, Schools, Feedback,
Reported problems, Audit log and Newsletter subscribers. Account creation and
faculty/department setup are not separate Founder sidebar sections. In local
development, `/admin/preview` links to the Founder, VC, Dean, Department and
Class governor dashboard previews. Preview pages do not load or change real
records. Newsletter updates has a separate composer for writing or uploading
HTML/text content and previewing an email. Delivery to confirmed subscribers
requires the newsletter email endpoint, which is not implemented yet.

1. **Founder:** all schools and registered-user counts per school, creation of dashboard accounts, adding faculties and departments for a school (during the demo), app-bug reports, the waitlist list, feedback (including requests to correct a student's level), the audit log for all schools, and the newsletter subscribers.
2. **VC:** school-wide student section, user feedback, session dates, a location and building editor (add, edit, photos, visitor access), bulk CSV upload, verification lists, reports about locations, graduation approvals, school-wide announcements and events, and the school's audit log.
3. **Dean:** student section for the faculty, user feedback; faculty announcements and events.
4. **Department (HOD and committee):** each level 100 to 500 as a section, user feedback; department announcements and events. Cannot post classes.
5. **Class governor:** own department and level; post class updates and assignments, one at a time.

## Pilot scope and demo

Faculties and departments for now:

- **Faculty of Engineering:** Mechanical Engineering, Material Engineering
- **Faculty of CIESA:** Mechatronics Engineering, Computer Engineering

During the demo the owner adds faculties and departments. Later, deans add departments to their faculty from the Dean dashboard (future version). The other departments from the first plan (Civil, Agriculture and Bio material, Electrical, Systems Engineering) come later. Keep the data model general.

**Demo and test run**
- The owner's own department is the demo. Expect fewer than 2,000 users, so Vercel is enough.
- The owner provides the building names, building photos and building information. Agents must not invent building data or use stock photos of real buildings. The seed uses clearly marked placeholders until the owner supplies the real data.
- Seed a demo school with demo accounts for each role (class governor, HOD, Dean, VC, student, guest). Demo data is clearly fake, the school is flagged `is_demo`, and all demo accounts are deleted before launch.
- The seed lives in `apps/api/src/db/seed.ts` with data in `apps/api/src/db/seed-data/`.

## Future versions

- **Staff role:** a Role field on the login page (Staff or Student), staff ID sign-in and verification, staff sign-up fields, a Staff section in the VC, Dean and department dashboards, and full campus access for staff.
- **Dean dashboard:** add and edit departments in the faculty.
- Floor-plan indoor maps (if schools supply plans).
- Catlas's own campus path data for fully offline routes.
- Other departments, faculties and schools.
- Payments and billing, including what counts as a "registered user".

## Roadmap

- **Now (demo phase):** fewer than 2,000 users, hosted on Vercel, using the owner's department.
- Step 1: build the landing page.
- Step 2: build the app features with demo logins and test run them.
- At launch: turn waitlist entries into accounts.
- After the test run and before marketing:
  - Data protection work (Nigeria Data Protection Act: consent, retention, privacy policy and terms, and a lawyer's review)
  - Backups: scheduled automatic database backups, plus a restore test to prove they work
  - Staging: a separate test deployment (own database, own keys) used for previews and the weekly security scan
  - Monitoring: error tracking (such as Sentry's free tier) and an uptime check that alerts the owner
- Before growing beyond the demo: a shared rate-limit store (in-memory limits do not work across serverless instances), database connection pooling, a paid hosting plan (the free Vercel plan is not for commercial use), and a review of repository visibility. Move off the first hosting setup when the first school pays or users pass a few thousand; Railway or a VPS are the likely next homes.
- When buyers are found: payments and billing.
