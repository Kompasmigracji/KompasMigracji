-- The panel's "create lead" modal (app/admin/(panel)/leads/page.jsx) offers
-- a 'dropped' status option that migration 030 missed. The mirror-insert to
-- kompas_leads (app/api/admin/leads/route.js) is wrapped in try/catch and
-- only console.error's on failure, so this doesn't crash the request — but
-- it silently means leads marked "Відмова" from that panel never appear in
-- the CRM funnel Kanban (app/admin/crm/funnels), which reads kompas_leads.

ALTER TABLE kompas_leads DROP CONSTRAINT IF EXISTS kompas_leads_status_check;
ALTER TABLE kompas_leads ADD CONSTRAINT kompas_leads_status_check
  CHECK (status IN ('new','in_progress','converted','closed','contacted','pending','won','lost','dropped'));
