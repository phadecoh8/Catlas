# Security Policy

Catlas handles student names, matric numbers, phone numbers and location data. We take security reports seriously.

## Reporting a vulnerability

Please report privately. Do not open a public issue or post details online.

- Email: faderojoshua99@gmail.com
- Subject line: `Catlas security report`

You can also use GitHub's private vulnerability reporting on this repository (Security tab, then Report a vulnerability).

Include:
- what you found and where (page, endpoint or feature)
- steps to reproduce it
- what an attacker could do with it
- screenshots or logs if they help (remove any real personal data)

## What to expect

- We acknowledge your report within 72 hours.
- We confirm whether it is a valid issue and share a rough fix timeline.
- We fix critical issues first, especially anything exposing student data or crossing school boundaries.
- We tell you when it is fixed.

## Scope

In scope:
- the Catlas web app and its API
- login, sessions, password reset and email verification
- access control between schools, faculties, departments and levels
- file and CSV uploads

Out of scope:
- social engineering, phishing or physical attacks
- denial-of-service or load testing
- third-party services (Google, Cloudinary, Vercel, Resend, and others); report those to the provider
- findings that need a rooted or already-compromised device

## Rules for good-faith research

- Test only against your own account or the demo school. Never access, change or keep other people's data.
- Stop and report immediately if you reach personal data by accident.
- Do not run automated scans at high volume.
- Give us reasonable time to fix the problem before telling anyone else.

Research that follows these rules is welcome, and we will not take legal action over it. There is no paid bounty at this time.

## Supported versions

Catlas is pre-release. Only the `main` branch is supported.

## Secrets

If you find a leaked key, token or password in the repository or a deployment, report it the same way. We will rotate it.
