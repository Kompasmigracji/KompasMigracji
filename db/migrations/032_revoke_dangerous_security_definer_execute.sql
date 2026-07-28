-- Applied directly to Supabase project uxbgrzmggeujgmryfohl (KompasMigracji) on 2026-07-28
-- via Supabase advisor audit. Documented here for migration history consistency.

-- CRITICAL: gdpr_erase_client_case_data(bigint) is a SECURITY DEFINER function that
-- irreversibly erases/anonymizes a client's case documents, notes and activity log for any
-- p_client_id passed in, with no internal authorization check. It was executable by the
-- `anon` role via POST /rest/v1/rpc/gdpr_erase_client_case_data — i.e. any unauthenticated
-- internet user could erase any client's case data. Restrict execution to service_role/postgres.
revoke execute on function public.gdpr_erase_client_case_data(bigint) from public, anon, authenticated;

-- rls_auto_enable() is an event-trigger function (returns event_trigger); it is only ever
-- invoked by the DDL event-trigger system, never as a normal callable. It served no purpose
-- being exposed as a public.rls_auto_enable RPC endpoint to anon/authenticated.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
