# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**KompasCRM** (brand: Kompas Migracji) is a Next.js 14 (App Router) monolith for DOMUS V Sp. z o.o., a legal-services company for migrants in Poland/EU. It combines three very different surfaces in one app:

1. A public, internationalized marketing site (`app/[locale]/*`) with an AI chatbot and lead capture.
2. A large internal CRM/admin back office (`app/admin/*`, 120+ modules) with RBAC.
3. Several bolted-on subsystems: an AI agent orchestration layer ("God"/"Primus"), a "LifeOS" engine, a separate "Orakul" AI bot, and multi-channel messaging/payment integrations.

Stack: Next.js 14 + TypeScript/JavaScript (mixed) + Tailwind CSS 4 + next-intl + Supabase (Postgres) + raw `pg` + Anthropic/OpenAI/Google AI SDKs. Package manager is **pnpm**. Deploys to Vercel on push to `main`.

## Commands

```bash
pnpm install          # install deps
pnpm dev              # dev server (localhost:3000)
pnpm build            # production build
pnpm lint             # next lint
pnpm typecheck        # tsc --noEmit
pnpm test:unit        # jest --passWithNoTests
pnpm test:e2e         # playwright test (auto-boots `pnpm dev`)
```

Single test:
```bash
pnpm test:unit -- path/to/file.test.ts
pnpm test:unit -- -t "test name"
pnpm test:e2e -- e2e/agents.spec.ts
```

Jest only picks up `**/__tests__/**/*.test.{ts,tsx}` (see `jest.config.js`), so unit tests live in `__tests__/` and `lib/__tests__/`. Playwright specs live in `e2e/*.spec.ts`.

**`pnpm build` will NOT catch lint or type errors** — `next.config.mjs` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`. Always run `pnpm lint` and `pnpm typecheck` explicitly; a green build proves nothing about code quality.

The GitHub Actions CI workflow (`.github/workflows/ci.yml`) is currently a no-op stub (`echo "Checks passed to unblock Vercel!"`) — it is not a real gate. Don't treat a passing CI run as verification.

Database migrations live in `db/migrations/*.sql`, numbered sequentially (`001_...` → `022_...`); apply new ones as the next number in order. There's no migration runner script wired into `package.json` — migrations are applied ad hoc (see `scripts/apply-migration-file.ts`, `scripts/apply-crm-schema.ts`, `scripts/apply-agents-schema.ts`) or via `psql "$DATABASE_URL" -f db/migrations/0NN_x.sql`. `db/schema.sql` is the base schema (older `kompas_*`-prefixed tables); `supabase/*.sql` holds schemas applied directly via Supabase (bot leads, CRM extensions, agents).

## Architecture

### Routing split (see `middleware.ts`)

Only pages under `app/[locale]/` get locale-prefixed URLs (`/uk/...`, `/pl/...`, etc.) via `next-intl`. Everything under `app/admin`, `app/payment`, `app/portal`, and `app/architect` lives **outside** the `[locale]` segment; the middleware strips an accidental locale prefix (e.g. `/uk/admin` → redirect to `/admin`) and skips `next-intl` for those trees entirely. When adding a page, decide up front whether it's public/localized (`app/[locale]/...`) or internal/unlocalized (`app/admin|portal|payment|architect/...`) — the two trees are not interchangeable.

Locales are `uk, pl, en, ru, rom` (`i18n.ts`), default `pl`. All UI strings live in `messages/{locale}.json`; components read them via `useTranslations()` from `next-intl`. (Older docs mention only 4 locales — `rom` was added later; keep `messages/*.json` in sync across all 5 files when adding strings.)

### Auth & RBAC

Single JWT-in-httpOnly-cookie scheme (cookie name `kompascrm_session`, signed with `JWT_SECRET` via `jose`), shared by `middleware.ts` and `lib/auth.js`:
- `middleware.ts` gates `/admin/*`, `/api/admin/*`, `/architect/*` — verifies the JWT, redirects unauthenticated users to `/admin/login`, and redirects `role === "member"` users to `/admin/me`. `/architect/*` additionally requires `role === "admin"`.
- Inside API routes, call `requireAuth(["admin", "moderator"])` from `lib/auth.js` and bail out on `auth.error` — this is the pattern used by essentially every `app/api/admin/**/route.{js,ts}` handler.
- Sidebar visibility (not just API access) is separately controlled by `lib/rbac.js`: the `NAV` array declares `roles` per menu item and `navFor(role)` filters it. Roles in use: `admin, moderator, manager, sales, lawyer, user, member`.

### Data layer — two DB clients, not interchangeable

- `lib/db.js` exports `q(text, params)` / `one(text, params)` — a raw `pg.Client` connection (new connection per query, no pool) used by nearly all `/api/admin/*` and CRM routes for Postgres tables (`leads`, `tasks`, `deals`, `kompas_*`, etc.). Connection config auto-detects from env in priority order: `PGHOST` → `DATABASE_URL` → `POSTGRES_URL` (Supabase pooler, parsed manually) → `POSTGRES_HOST` → localhost fallback.
- `lib/supabase.ts` exports `supabase` (anon key) and `supabaseAdmin` (service key) — the Supabase JS client, used for the agent-orchestration tables (`agents`, `agent_tasks`, `god_policies`) and some bot-lead flows.
- Env vars read via `q`/`one`/`middleware`/`auth` are passed through a `cleanEnv`/`clean` helper that strips a leading UTF-8 BOM and `\r` characters — a recurring defensive pattern because envs get pasted in from Windows/PowerShell. Reuse that helper (don't re-derive it) when reading new raw env vars in server code.

### Admin panel: two parallel module sets

`app/admin/(panel)/*` (~120 route folders) and `app/admin/crm/*` (~25 route folders) are **both live, separate CRM implementations** that coexist — e.g. `admin/leads` (panel) vs `admin/crm/leads` are different pages hitting different API routes (`/api/admin/leads` vs `/api/admin/crm/leads`). Check which tree a route actually belongs to before editing; don't assume one supersedes the other.

Most `app/admin/(panel)/*` modules were generated in bulk as premium-styled UI scaffolding with mocked data and a simulated per-module "AI agent console" (`components/admin/AgentConsole.jsx`, mounted inside `components/admin/Shell.jsx`/`DualSidebarShell.jsx`, resolves agent flavor text from a local registry keyed by URL path segment) — see `PROJECT.md` and `ORIGINAL_REQUEST.md` for the origin of this pattern. Telemetry/logs in these consoles are simulated (`setInterval`-generated fake lines), not real backend activity. Don't assume a module page reflects a working backend just because it looks fully built — verify the API route it calls actually exists and touches real data.

Shared admin UI primitives (`StatCard`, `ProgressBar`, `DataTable`, `EmptyState`, `SearchInput`, icon `PATHS`) live in `components/admin/ui.jsx`.

### AI subsystems (three separate, non-overlapping bots)

1. **Public chatbot** — `POST /api/chat`, Claude 3.5 Haiku, embedded via `components/ChatBot.tsx` on the marketing site. Parses lead info out of model output using a `[[LEAD:{...}]]` sentinel and writes it to the `leads` table. Rate-limited to 10 req/min/client.
2. **Orakul** — a separate assistant (`lib/orakul-bot.ts`, `lib/orakul-prompt.ts`, `POST /api/orakul/chat`), distinct prompt/persona from the main chatbot.
3. **God / Primus agent orchestration** — a simulated multi-agent ops layer: `POST /api/god/command` dispatches to `POST /api/agents/primus/dispatch`, which routes tasks to rows in the `agents`/`agent_tasks` Supabase tables (`lib/agents.ts`, `lib/god.ts`). `GET /api/agents/monitor/cron` (Vercel cron) scans heartbeats and emails alerts via `lib/notify.ts`. Admin UI at `/admin/agents` (`AgentsDashboard` → `GodCard` + `AgentCard[]`, SWR-polled every 10s). Authorization for these endpoints is a hardcoded email check (`iphoenixgsm@gmail.com`), not role-based.

**LifeOS** is a fourth, unrelated subsystem (`lib/lifeos/{alexDigital,fateEngine,soulEngine}.ts`, admin UI under `/architect/*`, daily Vercel cron at `/api/cron/lifeos`) — don't conflate it with the God/Primus agent system above; they're independent features that happen to share the "autonomous agent" theme.

### Payments & messaging integrations

Three payment providers, each with its own client lib and webhook: Przelewy24 (`lib/przelewy24.ts`, SHA-384 signed, `/api/payment`, `/api/payment-notify`, `/api/payment/p24-callback`), PayU (`lib/payu.ts`, `/api/payu/notify`), Stripe (`lib/stripe.ts`, `/api/stripe/webhook`, `/api/stripe/checkout-architecture`). Messaging channels each have their own lib + webhook route under `app/api/bot/*`: WhatsApp (`lib/whatsapp.ts`), Telegram (`lib/telegram.ts`), plus Viber and Facebook webhooks. Know which provider a given route/lib pair belongs to before touching payment or webhook code — they are not unified behind a common interface.

### Theming

Dark/light mode via `lib/ThemeContext.tsx`, persisted to `localStorage` (`theme` key), toggled via `data-theme` attribute on `<html>` with CSS custom properties (`app/globals.css`). Newer glassmorphism admin UI has its own stylesheet, `styles/glass.css`.

### File extension convention

`next.config.mjs` sets `pageExtensions: ['tsx', 'ts', 'jsx', 'js']` deliberately: the public site and newer code is TypeScript (`.tsx`/`.ts`), while most of the CRM/admin tree (`app/admin/**`, `lib/db.js`, `lib/auth.js`, `lib/rbac.js`) is plain JS (`.jsx`/`.js`). This is intentional, not inconsistency to "fix" — match the existing extension of whatever file/directory you're editing.

## Repo hygiene notes

- The repo root has many one-off debugging/migration scripts (`check_schema*.js`, `seed_*.js`, `test_*.js`/`.mjs`, `fix_translations*.mjs`, `update_*.js`, etc.) that were run manually against a live DB during development. They are not part of the build, the test suite, or `package.json` scripts — treat them as disposable historical artifacts, not conventions to follow for new work.
- `.agents/` contains handoff/progress notes from previous autonomous multi-agent development sessions (per-agent `BRIEFING.md`/`handoff.md`/`progress.md`). It's a session log, not application code or documentation to maintain.
- `docs/agent-learnings.md` is an append-only log some automation writes to after audits — don't hand-edit its history, only append if you're performing that same kind of audit.
- `PROJECT.md` and `ORIGINAL_REQUEST.md` document the origin of the 120-module admin panel buildout; `README.md` is partially stale (e.g. lists only 4 locales, omits Stripe/PayU/LifeOS/Orakul/next-auth) — prefer this file and the actual source over `README.md` for architectural claims.
