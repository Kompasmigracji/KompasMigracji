-- ================================================================
-- MIGRATION: 024_security_rls_lockdown.sql
-- Compatible: PostgreSQL 15+ / Supabase
--
-- Closes a Supabase advisor finding: kompas_partners, kompas_jobs_v2,
-- kompas_legal_cases_v2 had RLS disabled and were fully readable
-- (and, in principle, writable) by the anon key.
-- ================================================================

-- ── kompas_partners ────────────────────────────────────────────────
-- Reactivates the existing (previously dormant, RLS-off) policy:
-- "Anyone can view verified partners" FOR SELECT USING (verification_status = 'Verified')
ALTER TABLE public.kompas_partners ENABLE ROW LEVEL SECURITY;

-- ── kompas_jobs_v2 ─────────────────────────────────────────────────
-- Public/anon read limited to active listings; no anon write policy.
ALTER TABLE public.kompas_jobs_v2 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.kompas_jobs_v2;
CREATE POLICY "Anyone can view active jobs" ON public.kompas_jobs_v2
  FOR SELECT USING (status = 'active');

-- ── kompas_legal_cases_v2 ──────────────────────────────────────────
-- Table had no ownership column at all, so a "member sees only their
-- own case" RLS policy was impossible; combined with RLS being off,
-- every anon-key request (member portal + public chatbot tool) could
-- read every client's case, including free-text notes.
--
-- Fix: add user_id, then enable RLS with NO select policy — the anon
-- key can no longer read this table at all. The member portal and
-- chatbot are switched (in app code, see app/api/member/legal/route.ts
-- and app/api/chat/route.ts) to query via the server-only pg pool
-- (lib/db.js), which bypasses RLS but is now gated by requireAuth()
-- and an explicit WHERE user_id = $1 filter.
ALTER TABLE public.kompas_legal_cases_v2
  ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES kompas_users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_legal_cases_v2_user_id ON public.kompas_legal_cases_v2(user_id);

ALTER TABLE public.kompas_legal_cases_v2 ENABLE ROW LEVEL SECURITY;
