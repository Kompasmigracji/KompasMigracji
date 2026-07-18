---
name: verify
description: Project-specific verification recipe for KompasCRM — how to actually run and drive this app in a real browser.
---

# Verifying changes in KompasMigracji

Surface is a Next.js 14 web app (public marketing site + admin CRM). Use
Playwright (already a devDependency, config at `playwright.config.ts`), not
curl-only checks — CSS/hydration/streaming bugs don't show up in raw HTML.

## Setup gotchas

- **Port 3000 gets orphaned easily.** Background `pnpm dev` runs from earlier
  in a session leave zombie processes on 3000/3001/3002 (Next.js silently
  hops to the next free port instead of failing). Before running e2e tests,
  clear stale listeners:
  ```bash
  for port in 3000 3001 3002; do
    pid=$(netstat -ano 2>/dev/null | grep ":$port " | grep LISTENING | awk '{print $5}' | head -1)
    [ -n "$pid" ] && taskkill //F //PID "$pid"
  done
  ```
  `playwright.config.ts`'s `webServer` expects `baseURL: http://localhost:3000`
  with `reuseExistingServer: true` locally — a stale non-Next process on 3000
  will make tests fail in confusing ways.
- Run a single spec: `pnpm test:e2e -- e2e/<name>.spec.ts --reporter=list`.
- Screenshots land in `test-results/` — read them with the Read tool
  (it renders images) to actually look, not just check the assertion passed.

## Known pre-existing noise (not a regression signal)

- WebServer console logs `The requested resource isn't a valid image for
  /logo.svg received null` during dev-server cold start. The file exists and
  is valid (`public/logo.svg`) — this is a transient Next.js image-optimizer
  warm-up glitch, unrelated to app code. Don't chase it per-session; flag once
  if it's still there and someone has time to root-cause it properly.

## What's worth driving here

- `/[locale]/orakul` — the AI recruiting chat widget (Gemini-backed,
  streams SSE) is the most failure-prone surface: streaming text corruption,
  dropped SSE lines, and locale-specific metadata have all been real bugs.
  Test it by actually typing into `.oc-input` and clicking `.oc-send`, not by
  hitting `/api/orakul/chat` directly — the client-side buffering logic is
  half the bug surface.
- Locale-prefixed routes: this app has 5 locales (`uk pl en ru rom`) with
  `localePrefix: "always"` — every page needs a locale prefix in the URL, and
  page titles/OG metadata should differ from the generic homepage default
  (`t('seo_default_title')`) unless the page has no dedicated layout.tsx.
- Forms with a RODO/GDPR checkbox (see `ContactForm.tsx`'s established
  pattern) should block submit until checked — verify via the disabled state
  of the submit button, not just that the checkbox renders.
