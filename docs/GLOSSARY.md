# Catlas Glossary

Terms used across the project, so people and AI tools read them the same way.

## Education terms

| Term | Meaning |
|---|---|
| JAMB | Joint Admissions and Matriculation Board, the body that runs university admission exams in Nigeria |
| JAMB Reg. No | The registration number a new candidate gets from JAMB. Freshers log in with it |
| Matric number | The matriculation number a school gives a student once admitted. Returning students log in with it |
| Staff ID | The identifier a staff member would sign in with. Planned for a future version |
| Fresher | A first-year student who has not yet provided a matric number |
| Staylite | The owner's word for a returning student who already has a matric number |
| Level | A student's year of study: 100, 200, 300, 400, 500. It rises by one at each new session |
| Final level | The last level in a department (400 or 500). Students at it when the session ends are graduating |
| Session | An academic year. The VC sets when it ends and when the next one starts |
| Faculty | A group of departments (for example Faculty of Engineering, Faculty of CIESA) |
| Department | A unit inside a faculty (for example Mechatronics) |
| Carry-over | A student who has not completed the final level and has not graduated |

## Roles

| Term | Meaning |
|---|---|
| VC | Vice-Chancellor. School-wide dashboard: students, session dates, locations, bulk upload, graduation approval |
| Dean | Head of a faculty. Sees every department in the faculty |
| HOD | Head of Department. Sees all levels in the department |
| Department committee | Works with the HOD on the department dashboard. Cannot post classes |
| Class governor | Student representative for one department and level. The only role that posts classes and assignments. Not reassigned: their level rises with their class each session |
| Founder | The owner of Catlas. Sees school-level counts only, and can correct a student's level from a feedback item |
| Student | A signed-in user: fresher or returning student |
| Staff | A university staff member. Planned for a future version |
| Visitor or guest | A person using the Continue as guest button. Sees a demo page with only visitor-accessible locations; no account |

## Product terms

| Term | Meaning |
|---|---|
| Location | A searchable place on campus |
| Building | A structure that contains offices, rooms and classes |
| Indoor place | An office or room inside a building, mapped by hand |
| Location card | The card shown for a result: photo, building name, bookmark, what is inside, description |
| Bookmark | A saved location. "Most bookmarked" ranks by bookmark count |
| Class change | A class marked cancelled or moved by a governor |
| Low data mode | A setting that reduces images, animation and map loading |
| Verification badge | Green means not fully verified (no matric number yet); blue means fully verified |
| Demo school | A fake school for the test run, flagged `is_demo`, deleted before launch |
| Splash screen | A short screen with the logo and name when the app first loads |
| Landing page | The public page at `/`, built first, with header, hero, animation, about, FAQ, newsletter and footer |
| Waitlist | A form in the landing page. Sign-ups are saved in a separate Supabase project so people can be signed in at launch |
| Newsletter | An email signup on the landing page for product updates |
| Catlas AI assistant | The Gemini-powered helper: customer service, new-user teaching, product knowledge and graduation advice |
| Trail | The red route line between the user and the destination on the map |
| Double opt-in | A newsletter signup that is confirmed by clicking a link in an email before the address is added |
| Honeypot | A hidden form field that real people never fill in, used to catch bots |
| Cat animations | A crying cat SVG for errors and 404, a happy cat SVG for arrival, account created and email verified, and a calm cat for empty screens |

## Engineering and security terms

| Term | Meaning |
|---|---|
| Scope | The slice of data a role may see (school, faculty, department, level) |
| IDOR | A bug where changing an ID in a request shows someone else's data. Scoping tests prevent it |
| 2FA | Two-factor authentication: a code from an authenticator app in addition to the password. Backup codes cover a lost phone |
| JWT | A signed token proving who the user is. Catlas access tokens last about 15 minutes |
| Refresh token | A longer-lived token used to get a new access token. Stored hashed and rotated |
| CSP | Content Security Policy, a browser rule limiting what a page may load |
| SAST | Scanning our code for insecure patterns (CodeQL or Semgrep) |
| DAST | Attacking the running app the way a hacker would (OWASP ZAP) |
| CI | Automatic checks that run on every pull request |
| NDPA | Nigeria Data Protection Act 2023 |
| Retention | How long data is kept before deletion. Default 30 days |
