# Catlas Security and DevSecOps Plan (Full)

The owner is new to this area. Explain each step in plain language when you add it.

**The repository is public for now.** The licence still forbids using the code, but anyone can read it. Never commit real student data, real phone numbers, private photos or secrets. Review the visibility before launch.

**GitHub setup (settings, not code)**
- Protect `main`: no direct pushes, pull request required, CI checks must pass before merging.
- Turn on secret scanning with push protection, Dependabot alerts and code scanning.
- Turn on private vulnerability reporting (the repository is public).

**Workflows in `.github/workflows/`**
1. `ci.yml`: on every pull request, install with a frozen lockfile, lint, type-check, test, build.
2. `security.yml` (on pull requests and weekly):
   - Gitleaks: finds secrets committed by mistake
   - `pnpm audit` or OSV-Scanner: finds known-vulnerable dependencies
   - CodeQL (the repo is public for now, so it is free; if the repo becomes private, use Semgrep): scans our code for insecure patterns
3. `dast.yml` (weekly and manual): OWASP ZAP baseline scan against a preview or staging deployment, which attacks the running app the way a hacker would.
4. `dependabot.yml`: weekly update PRs for npm packages and for GitHub Actions.

**Pipeline hardening**
- Pin every third-party action to a full commit SHA.
- Set `permissions: contents: read` by default in workflows and grant more only where needed.
- Never expose secrets to pull requests from forks.
- `CODEOWNERS` marks sensitive paths (auth, middleware, database schema, `.github/`) for extra care. Start with the single line `* @phadecoh8`, then add the sensitive paths.

**App hardening (enforced by tests where possible)**
- Helmet security headers and a strict Content Security Policy
- CORS allowlist, not `*`
- Rate limiting on login, password reset, search, sign-up, guest, waitlist, newsletter, reports and the assistant
- Zod validation on every request body, query and param
- Drizzle query builder only; no string-built SQL
- Passwords hashed with argon2 or bcrypt; secure, httpOnly, sameSite cookies
- Email verification and reset flows that do not reveal whether an email exists
- 2FA (authenticator app plus backup codes) for founder, VC, Dean and HOD accounts
- Accounts created with one-time temporary passwords and a forced change at first login; no per-user passwords in `.env`
- No personal data sent to the AI service
- Least-privilege database user
- Signed Cloudinary uploads with file type and size limits
- Audit log for admin actions and student-list access
- Tests that prove scoping: a governor cannot read another level, a school cannot read another school (these catch "IDOR" bugs, the most common serious bug in apps like this)

**Suggested build order**
1. `ci.yml` and branch protection
2. Secret scanning and Gitleaks
3. Dependabot and dependency audit
4. CodeQL or Semgrep
5. App hardening and scoping tests, built together with each feature
6. Pipeline hardening
7. ZAP scan once a staging deployment exists
