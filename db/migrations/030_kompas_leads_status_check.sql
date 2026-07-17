-- Widens kompas_leads.status CHECK constraint to match the CRM Kanban
-- funnel vocabulary (app/admin/crm/funnels, app/admin/crm/leads), which has
-- always used new/contacted/pending/won/lost — a different set than the
-- original schema.sql constraint (new/in_progress/converted/closed). Every
-- non-"new" drag-and-drop status change on the funnel board has been
-- crashing PATCH /api/admin/crm/leads/:id with a 500 since the Kanban UI
-- shipped, because Postgres rejected the update outright. Additive only —
-- keeps the original four values too, so no existing row can violate it.

ALTER TABLE kompas_leads DROP CONSTRAINT IF EXISTS kompas_leads_status_check;
ALTER TABLE kompas_leads ADD CONSTRAINT kompas_leads_status_check
  CHECK (status IN ('new','in_progress','converted','closed','contacted','pending','won','lost'));
