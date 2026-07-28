-- Applied directly to Supabase project uxbgrzmggeujgmryfohl (KompasMigracji) on 2026-07-28
-- via Supabase advisor audit. Documented here for migration history consistency.

-- These 6 tables had RLS "enabled" but with policies that evaluate to `true` for the
-- `public`/`anon`/`authenticated` roles, combined with full CRUD grants to anon/authenticated.
-- That means any internet user with the public anon key could read/write/delete all rows:
-- client PII (leads), call logs (crm_calls), CRM config (crm_settings), campaign data
-- (email_campaigns), templates (message_templates), and an unused table (bot_sessions).
-- Verified via code search: none of these tables are accessed through the anon-key Supabase
-- client anywhere in the app — all access goes through lib/db.js's privileged Postgres
-- connection, which is unaffected by RLS/grants. So these open policies served no functional
-- purpose; removing them only removes exposure.

drop policy if exists "service insert sessions" on public.bot_sessions;
revoke all on table public.bot_sessions from anon, authenticated;

drop policy if exists "service all crm_calls" on public.crm_calls;
revoke all on table public.crm_calls from anon, authenticated;

drop policy if exists "service all crm_settings" on public.crm_settings;
revoke all on table public.crm_settings from anon, authenticated;

drop policy if exists "service all email_campaigns" on public.email_campaigns;
revoke all on table public.email_campaigns from anon, authenticated;

drop policy if exists "service all templates" on public.message_templates;
revoke all on table public.message_templates from anon, authenticated;

drop policy if exists "Allow select for all" on public.leads;
drop policy if exists "Enable insert for authenticated users only" on public.leads;
drop policy if exists "service insert leads" on public.leads;
revoke all on table public.leads from anon, authenticated;
