# Contributing to Catlas

Catlas is proprietary software (see `LICENSE`). Contributions are by invitation from the owner only.

By contributing you agree that your contribution is assigned to the owner, as described in section 5 of `LICENSE`, unless you have a separate written agreement.

## Before you start

1. Read `README.md`, `AGENTS.md` and `docs/GLOSSARY.md`.
2. Check Open decisions in `AGENTS.md`. Do not decide those yourself; ask the owner.
3. Set up locally using "Getting started" in `README.md`. Use your own `.env` files and never share them.

## Workflow

1. Branch from `main`: `feat/short-name`, `fix/short-name`, `chore/short-name`, `docs/short-name`. Every pull request gets a Vercel preview and must pass CI.
2. Make small, focused changes. One concern per pull request.
3. Write commits in Conventional Commits style (`feat:`, `fix:`, `chore:`, `docs:`).
4. Run `pnpm lint`, `pnpm test` and a build before opening the pull request.
5. Open a pull request and fill in the template. CI and security checks must pass.
6. Wait for review. Code owners review changes to auth, middleware, database schema and `.github/`.

## Rules that are never negotiable

- No secrets in code, logs, screenshots or commits. All secrets live in `.env` files.
- No emojis anywhere: UI, code, comments, commits or docs.
- Never log personal data.
- Every school-scoped query filters by `school_id`. Respect faculty, department and level scope.
- Role and scope checks happen on the server.
- Only class governors post classes and assignments.
- Use design tokens and the icon package; do not hardcode colours or fonts.
- Check the licence of any new dependency. Avoid GPL and AGPL.
- Do not change `LICENSE` or add open-source licence headers.

## Tests

Add tests for anything involving roles, scoping, the session lock, level rollover, bulk upload or account deletion. A bug that lets one school, department or level see another's data is treated as critical.

## Using AI coding tools

AI tools are welcome. They must follow `AGENTS.md`. You are responsible for reviewing everything an AI tool writes before you commit it.

## Reporting security problems

Do not use pull requests or public issues. See `SECURITY.md`.
