-- Migration 040: backfill CREATE TABLE statements for tables created directly against
-- the live Supabase project (uxbgrzmggeujgmryfohl) that were never committed as a
-- migration — the same "build in the dashboard, backfill later" pattern already
-- admitted in 038_kompas_deadlines_hardening.sql's header comment.
--
-- METHODOLOGY: no live DB access was used to write this file (Supabase/Vercel MCP
-- tools were unavailable in this environment). Every column/type/default below was
-- reconstructed by reading application code that queries these tables — the exact
-- SELECT/INSERT/UPDATE column lists in lib/crm-chats.js and the app/api/admin/crm/*
-- routes — plus, where they exist, the one-off Node scripts (scripts/setup-db.js,
-- scripts/_archive/seed_payments.js, scripts/seed-stage7.ts) that originally ran the
-- literal `CREATE TABLE IF NOT EXISTS` against the live DB. Those scripts are the
-- most authoritative source available short of a live schema dump and are cited
-- per-table below. Everything else is inferred from usage and flagged inline with a
-- "BEST-EFFORT" SQL comment on the specific column/decision in doubt.
--
-- SAFETY: every statement below is `IF NOT EXISTS`. Since all of these tables already
-- exist live, applying this migration to the real database is a complete no-op there —
-- it changes nothing about the live tables' actual columns, constraints, or data. Its
-- only real effect is documentation, and letting a *fresh* dev DB be bootstrapped from
-- `db/migrations/*.sql` alone. No RLS is enabled/disabled and no GRANT/REVOKE is
-- touched here — that's a separate, deliberately out-of-scope concern (RLS changes are
-- not "IF NOT EXISTS"-safe the way a CREATE TABLE is: flipping RLS on a table that
-- currently has none could immediately change what the anon/authenticated Supabase
-- keys can see, which is a behavior change, not documentation).
--
-- KNOWN LIMITATION (not fixed here — would require renumbering existing migrations,
-- which is out of scope for this change): migrations 024, 035, 036 and 037 each run
-- ALTER TABLE / CREATE INDEX / ENABLE ROW LEVEL SECURITY against several of the tables
-- backfilled here (kompas_jobs_v2, kompas_legal_cases_v2, custom_chats, custom_messages,
-- custom_payments, orders, buyers) *before* this migration's number. Against the real,
-- already-migrated live DB this is harmless (those tables already exist, so 024/035/
-- 036/037 already succeeded when they first ran, and this file is a no-op). But a
-- brand-new database applying 001..040 strictly in order would hit those ALTER
-- statements before table 040 creates the underlying table and fail. Where a later
-- migration is known to have changed a column's default/constraint/shape from what the
-- original creation script used, this file reflects that later, *current* shape
-- directly (e.g. orders.status's default and CHECK come from 037, not from the
-- original scripts/setup-db.js default) rather than replaying history step by step.
--
-- Verify every column/type/default here against the actual live schema before relying
-- on it — e.g. `\d tablename` in psql, or the Supabase dashboard's table editor —
-- since IF NOT EXISTS means any mismatch between this file's guess and the real live
-- shape will NOT be caught automatically.

-- ── sources ─────────────────────────────────────────────────────────────────────
-- Not one of the 13 audited tables itself, but both buyers.source_id and
-- orders.source_id below are foreign keys into it (confirmed live via
-- db/migrations/035_add_missing_foreign_key_indexes.sql's idx_buyers_source_id /
-- idx_orders_source_id), and it has the same "created ad hoc, never migrated" history.
-- Included so this file's own CREATE TABLE statements are internally consistent for a
-- from-scratch bootstrap instead of pointing buyers/orders at a table that doesn't exist.
-- Source: scripts/setup-db.js:25-31 (original CREATE TABLE, verbatim).
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  type varchar(50) default 'other',
  status boolean default true,
  created_at timestamptz default current_timestamp
);

-- ── buyers ──────────────────────────────────────────────────────────────────────
-- Source: scripts/setup-db.js:34-41 (original CREATE TABLE, verbatim).
-- Columns cross-checked against app/api/admin/crm/buyers/route.js:11 (SELECT list incl.
-- source_id via join) and :39-47 (INSERT full_name/email/phone).
create table if not exists public.buyers (
  id uuid primary key default gen_random_uuid(),
  full_name varchar(255) not null,
  phone varchar(50),
  email varchar(255),
  source_id uuid references public.sources(id) on delete set null,
  created_at timestamptz default current_timestamp
);
-- idx_buyers_source_id already created by db/migrations/035_add_missing_foreign_key_indexes.sql — not duplicated here.

-- ── products ────────────────────────────────────────────────────────────────────
-- Source: scripts/setup-db.js:70-77 (original CREATE TABLE, verbatim).
-- Columns cross-checked against app/api/admin/crm/products/route.js:11 (SELECT *) and
-- :27-35 (INSERT name/category/price/qty_in_stock).
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  category varchar(100),
  price numeric(10,2) default 0,
  qty_in_stock integer default 0,
  created_at timestamptz default current_timestamp
);

-- ── orders ──────────────────────────────────────────────────────────────────────
-- Base shape source: scripts/setup-db.js:57-67 (original CREATE TABLE).
-- status default/CHECK and payment_status CHECK reflect the CURRENT live shape per
-- db/migrations/037_reconcile_orders_leads_payments.sql:42-55, which ALTERed the
-- original 'Новий' default to 'новый' (lowercase Russian vocabulary the admin UI/API
-- actually use) and added both CHECK constraints — that migration already ran live, so
-- this is what a fresh CREATE TABLE should match, not the original 2024-era default.
-- Columns order_number/status/total_price/buyer_id/created_at + the buyers join
-- cross-checked against app/api/admin/crm/orders/route.ts:11-18,44-56.
-- status/total_price usage (WHERE status = 'выполнено', SUM(total_price)) confirmed in
-- app/api/admin/crm/dashboard/route.ts:19-58 and app/api/admin/crm/reports/route.js:17-24
-- — motivates the status index below.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number varchar(50) unique not null,
  buyer_id uuid references public.buyers(id) on delete cascade,
  status varchar(50) not null default 'новый'
    check (status in ('новый', 'согласование', 'производство', 'доставка', 'выполнено', 'отменено')),
  payment_status varchar(50) default 'Неоплачено'
    check (payment_status in ('Неоплачено', 'Оплачено', 'Частково')),
  total_price numeric(10,2) default 0,
  manager_id uuid, -- BEST-EFFORT: present in the original scripts/setup-db.js CREATE TABLE but no live route reads/writes it (no manager assignment UI found for orders) — kept for shape-compatibility, unverified as still in use
  source_id uuid references public.sources(id) on delete set null,
  created_at timestamptz default current_timestamp
);
-- idx_orders_buyer_id / idx_orders_source_id already created by migration 035 — not duplicated here.
create index if not exists idx_orders_status on public.orders(status);

-- ── custom_payments ─────────────────────────────────────────────────────────────
-- Source: scripts/_archive/seed_payments.js:17-29 (original CREATE TABLE, verbatim —
-- this is the exact script migration 037's header comment names as having created it).
-- order_id + status CHECK reflect the current live shape per
-- db/migrations/037_reconcile_orders_leads_payments.sql:26-35 (ALTERed in after the
-- original creation). Columns cross-checked against
-- app/api/admin/crm/payments/route.js:10-13 (SELECT *) and :26-43 (INSERT
-- type/type_label/description/manager/amount/currency/status).
-- type = 'income' filter confirmed in app/api/admin/crm/reports/route.js:25-27 —
-- motivates the type index below.
create table if not exists public.custom_payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  type varchar(50),
  type_label varchar(100),
  description text,
  manager varchar(100),
  amount numeric,
  currency varchar(10),
  status varchar(50)
    check (status in ('paid', 'pending', 'cancelled')),
  order_id uuid references public.orders(id) on delete set null
);
-- idx_custom_payments_order_id already created by migration 037 — not duplicated here.
create index if not exists idx_custom_payments_type on public.custom_payments(type);

-- ── custom_chats ────────────────────────────────────────────────────────────────
-- No original CREATE TABLE script was found anywhere in the repo for this table (or
-- custom_messages below) — reconstructed purely from query usage in lib/crm-chats.js
-- (the shared helper used by both the admin CRM chats API and the Telegram/WhatsApp/
-- Viber inbound webhooks), app/api/admin/crm/chats/route.js,
-- app/api/admin/crm/chats/[id]/route.js, app/api/admin/crm/chats/[id]/messages/route.js,
-- and confirmed to have no *additional* columns via app/api/bot/whatsapp/route.ts,
-- app/api/bot/viber-webhook/route.ts and app/api/bot/webhook/route.ts (all three only
-- go through findOrCreateChat/appendMessage, never touch custom_chats directly).
create table if not exists public.custom_chats (
  id uuid primary key default gen_random_uuid(), -- BEST-EFFORT: id type has no direct evidence in code (Next.js route params are always strings). UUID inferred from the uniform convention every other ad-hoc Supabase-dashboard table in this file uses (buyers/orders/products/custom_payments/kompas_jobs_v2/kompas_legal_cases_v2 all use `uuid primary key default gen_random_uuid()`). Verify against live schema.
  name text,
  source text not null, -- observed values: 'telegram' | 'whatsapp' | 'viber' | 'manual' (lib/crm-chats.js SOURCE_META keys). Left unconstrained (no CHECK) because sourceMeta() explicitly falls back to 'manual' styling for unknown values, implying the code tolerates values outside this set.
  external_id text, -- added by db/migrations/036_custom_chats_external_id.sql as an ALTER TABLE; embedded directly in the CREATE TABLE here so a from-scratch bootstrap ends up with the same final shape.
  source_icon text,
  source_color text,
  last_message text,
  time text, -- BEST-EFFORT / important: NOT a SQL time or timestamp type. Stores a pre-formatted display string like "14:32" — see lib/crm-chats.js timeStr(), `new Date().toLocaleTimeString('uk-UA', {...})`. Kept as `text` to match what the app actually writes.
  unread integer default 0,
  status text default 'open', -- observed values: 'open' | 'closed' (app/api/admin/crm/chats/[id]/route.js PATCH validates exactly these two)
  created_at timestamptz not null default now()
);
-- Also created by db/migrations/036_custom_chats_external_id.sql; repeated here
-- (IF NOT EXISTS, harmless no-op against the live DB) so a from-scratch bootstrap of
-- just this file's tables is self-contained.
create unique index if not exists custom_chats_source_external_id_key
  on public.custom_chats(source, external_id)
  where external_id is not null;

-- ── custom_messages ─────────────────────────────────────────────────────────────
-- Source: lib/crm-chats.js:40-58 (appendMessage — full INSERT/UPDATE column list) and
-- app/api/admin/crm/chats/[id]/messages/route.js:13-17 (SELECT * ... WHERE chat_id),
-- :57-60 (INSERT chat_id/text/time/sender/is_seen).
create table if not exists public.custom_messages (
  id uuid primary key default gen_random_uuid(), -- BEST-EFFORT, see custom_chats.id note above — same reasoning applies.
  chat_id uuid references public.custom_chats(id) on delete cascade, -- BEST-EFFORT: ON DELETE behavior is not observable from app code (chats are never hard-deleted in any route found); CASCADE chosen as the safer default so orphaned messages can't accumulate, but unverified against live schema.
  text text not null,
  time text, -- see custom_chats.time note — same pre-formatted display string, not a SQL time type.
  sender text not null, -- observed values: 'client' | 'manager' | 'bot' (lib/crm-chats.js appendMessage callers, app/api/bot/webhook/route.ts mirrorToCrmChats, app/api/admin/crm/chats/[id]/messages/route.js POST hardcodes 'manager')
  is_seen boolean default false,
  created_at timestamptz not null default now()
);
-- idx_custom_messages_chat_id already created by db/migrations/035_add_missing_foreign_key_indexes.sql — not duplicated here.

-- ── crm_categories / crm_inventory / crm_movements / crm_order_lists / crm_publications ──
-- Unlike every other table in this file, these five are reproduced verbatim, byte-for-
-- byte, from the literal `CREATE TABLE IF NOT EXISTS` statements the app itself already
-- runs at request time inside each route's POST handler — see
-- app/api/admin/crm/categories/route.js:32-38,
-- app/api/admin/crm/inventory/route.js:32-39,
-- app/api/admin/crm/movements/route.js:32-40,
-- app/api/admin/crm/order-lists/route.js:32-39,
-- app/api/admin/crm/publications/route.js:32-39.
-- These are the single most authoritative source in this whole migration — there is no
-- inference involved, just literal duplication so the shape is documented in
-- db/migrations/ instead of only living inside route handler code. Note these use
-- SERIAL (not UUID) primary keys, unlike the rest of this file — that mismatch is
-- exactly what the app code creates, not a transcription error.
create table if not exists public.crm_categories (
  id serial primary key,
  name text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.crm_inventory (
  id serial primary key,
  item text not null,
  quantity integer default 0,
  created_at timestamp with time zone default now()
);

create table if not exists public.crm_movements (
  id serial primary key,
  type text not null,
  item text not null,
  qty integer default 0,
  created_at timestamp with time zone default now()
);

create table if not exists public.crm_order_lists (
  id serial primary key,
  name text not null,
  count integer default 0,
  created_at timestamp with time zone default now()
);

create table if not exists public.crm_publications (
  id serial primary key,
  title text not null,
  status text,
  created_at timestamp with time zone default now()
);

-- ── kompas_jobs_v2 ──────────────────────────────────────────────────────────────
-- Base shape source: scripts/seed-stage7.ts:27-39 (original CREATE TABLE, verbatim —
-- id/title/company_name/location/salary_range/employment_type/description/
-- requirements/status/created_at/updated_at).
-- ai_match_reasoning / ai_match_score are NOT in that original CREATE TABLE but ARE
-- inserted live by app/api/admin/crm/jobs/route.js:40-54 (INSERT ... ai_match_reasoning,
-- ai_match_score), so the live table must have them — added here as a documented delta.
-- status = 'active' filter confirmed in app/api/member/jobs/route.ts:7 and
-- db/migrations/024_security_rls_lockdown.sql:19-21 (RLS policy USING (status =
-- 'active')) — motivates the status index below.
-- Cross-checked (no new columns, keyword search only) against app/api/chat/route.ts:70-74.
-- NOTE: scripts/create-jobs-tables.js is a second, inconsistent, apparently-abandoned
-- attempt at this same table that uses `is_active boolean` instead of `status` — every
-- live code path that actually queries kompas_jobs_v2 today uses `status`, so that
-- script's shape was NOT used here; is_active is not included.
create table if not exists public.kompas_jobs_v2 (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  company_name varchar(255) not null,
  location varchar(255),
  salary_range varchar(100),
  employment_type varchar(100),
  description text,
  requirements jsonb not null default '[]'::jsonb,
  ai_match_reasoning text, -- BEST-EFFORT: column confirmed to exist (inserted by app/api/admin/crm/jobs/route.js) but not present in scripts/seed-stage7.ts's original CREATE TABLE — type/nullability guessed as free text with no default.
  ai_match_score integer default 80, -- BEST-EFFORT default: scripts/create-jobs-tables.js (the abandoned alternate attempt above) used DEFAULT 80 for this same column name; app/api/admin/crm/jobs/route.js separately falls back to 85 in application code if the field is omitted from the request body. The actual DB-level default is unverified — confirm against live schema.
  status varchar(50) default 'active',
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);
create index if not exists idx_kompas_jobs_v2_status on public.kompas_jobs_v2(status);

-- ── kompas_legal_cases_v2 ───────────────────────────────────────────────────────
-- Base shape source: scripts/seed-stage7.ts:41-50 (original CREATE TABLE, verbatim —
-- id/case_type/status/current_stage/deadline/notes/created_at/updated_at).
-- user_id was added historically via ALTER TABLE by
-- db/migrations/024_security_rls_lockdown.sql:35-38 (`ADD COLUMN IF NOT EXISTS user_id
-- BIGINT REFERENCES kompas_users(id) ON DELETE CASCADE`) — embedded directly in the
-- CREATE TABLE here so a from-scratch bootstrap ends up with the same final shape.
-- Note the type mismatch is intentional and confirmed, not a typo: this table's own id
-- is UUID (matching its "v2" sibling kompas_jobs_v2 and the rest of this file's ad-hoc
-- tables) while user_id is BIGINT because it references kompas_users(id), which is
-- `bigserial` (see db/schema.sql's kompas_users definition).
-- All columns cross-checked against app/api/member/legal/route.ts:10-13,20-31
-- (SELECT * ... WHERE user_id = $1; reads id/case_type/status/created_at/deadline/
-- current_stage/notes).
create table if not exists public.kompas_legal_cases_v2 (
  id uuid primary key default gen_random_uuid(),
  case_type text not null,
  status text not null default 'Oczekuje na dokumenty',
  current_stage text,
  deadline date,
  notes text,
  user_id bigint references public.kompas_users(id) on delete cascade,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);
-- idx_legal_cases_v2_user_id already created by db/migrations/024_security_rls_lockdown.sql — not duplicated here.
