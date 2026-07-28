-- Applied directly to Supabase project uxbgrzmggeujgmryfohl (KompasMigracji) on 2026-07-28
-- via Supabase advisor audit. Documented here for migration history consistency.

-- kompas_leads has RLS enabled with zero policies. The public AI chatbot's `record_lead`
-- tool (app/api/chat/route.ts) inserts into this table using the anon-key Supabase client,
-- so every insert has been silently rejected by RLS (caught, logged, shown to the visitor
-- as a generic error). This adds the intended public-contact-form pattern: anyone can INSERT
-- a lead, nobody can read/update/delete via the anon-key client (admin reads go through
-- lib/db.js, which bypasses RLS).
create policy "public_insert_leads" on public.kompas_leads
  for insert
  to anon, authenticated
  with check (true);
