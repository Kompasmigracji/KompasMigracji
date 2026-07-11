Title: fix: avoid reload loop in global error boundary (sessionStorage cooldown)

Summary
-------
This change prevents an infinite reload loop when a client holds outdated chunks after a deployment. The `GlobalError` boundary now tracks reload attempts in `sessionStorage` under the key `globalErrorReload` and enforces a 60s cooldown between automatic hard refresh attempts. Manual refresh clears the flag.

Why
---
Users (notably on iPhone) experienced the app stuck on the error page with repeated automatic reloads. This fix prevents reload loops and reduces user impact while ensuring we still attempt to recover automatically once.

Files changed
-------------
- `app/global-error.tsx` — added `sessionStorage` flag, cooldown logic, safer reload behavior and button behavior.

Checklist
---------
- [ ] Verify linting: `npm run lint`
- [ ] Build: `npm run build`
- [ ] Run e2e tests: `npm run test:e2e`
- [ ] Deploy PR preview (Vercel/GitHub Preview)
- [ ] Test on iPhone (incognito) and collect console logs if problem persists
- [ ] Merge after QA and monitor for errors in Sentry/hosting logs

Manual PR creation steps
------------------------
1. Open PR page: https://github.com/Kompasmigracji/KompasMigracji/compare/main...fix/global-error-reload?expand=1
2. Paste this file into the PR description, set reviewers, and create PR.

Notes
-----
- I could not create the PR automatically from this environment because `gh` CLI is not installed and I don't have an auth token to the GitHub API.
- Playwright e2e failures were observed locally; next step is to run Playwright in debug mode and fix the `test.describe()` context error.

If you want me to continue while you're away, reply with `run e2e` and I'll start debugging/running failing tests and attempt fixes automatically.