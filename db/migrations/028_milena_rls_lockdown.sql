-- Closes a Supabase advisor finding on the Milena sales-bot tables added in
-- 026_milena_sales_bot.sql: each one got an RLS policy of
-- `FOR ALL USING (true) WITH CHECK (true)`, which grants the anon/authenticated
-- Supabase keys full read+write on every row — same class of bug
-- 024_security_rls_lockdown.sql fixed for kompas_partners/kompas_jobs_v2/
-- kompas_legal_cases_v2. The app never queries these tables through
-- PostgREST/anon key; app/api/bot/milena/message/route.ts and lib/milena-*.ts
-- go through lib/db.js's direct Postgres connection (PGUSER=postgres),
-- which bypasses RLS entirely. So dropping the permissive policy here only
-- removes public/anon access — the bot itself is unaffected.
--
-- `clients` holds full_name_latin, pesel, address, phone_pl, email;
-- `conversations`/`messages` hold full chat transcripts — this closes real
-- PII exposure, not a theoretical one.

DROP POLICY IF EXISTS "service all services" ON services;
DROP POLICY IF EXISTS "service all intents" ON intents;
DROP POLICY IF EXISTS "service all knowledge_cards" ON knowledge_cards;
DROP POLICY IF EXISTS "service all dialog_flows" ON dialog_flows;
DROP POLICY IF EXISTS "service all handoff_rules" ON handoff_rules;
DROP POLICY IF EXISTS "service all clients" ON clients;
DROP POLICY IF EXISTS "service all conversations" ON conversations;
DROP POLICY IF EXISTS "service all messages" ON messages;

-- RLS stays enabled on all 8 tables (from 026) with zero policies now,
-- which is default-deny for anon/authenticated. postgres/service_role
-- connections (BYPASSRLS) are unaffected.
