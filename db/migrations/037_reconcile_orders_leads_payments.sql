-- Migration 037: reconcile orders / kompas_leads / crm_payments schema
--
-- Problem: the public P24/PayU/Stripe/mock payment webhooks mark a `leads`
-- row as paid (status='closed', paid_at=now()) but never touch
-- `kompas_leads`, the table the CRM funnel UI actually reads. A
-- payment-initiated lead is never even mirrored into `kompas_leads` in the
-- first place (unlike /api/lead and /api/admin/leads, which do mirror).
-- Net effect: a customer can pay via P24 and the CRM never shows it.
--
-- Separately, `orders` and `custom_payments` (both created ad hoc via
-- scripts/setup-db.js and scripts/_archive/seed_payments.js, never via a
-- tracked migration) have no FK relationship to each other or to any lead
-- table at all, and no CHECK constraints. Both are empty in production as
-- of this migration, so constraints can be added with zero data risk.

-- 1. leads -> kompas_leads: a real FK so payment status can be propagated
--    by id instead of duplicate-inserting matching values with no shared
--    key (the pattern /api/lead and /api/admin/leads already use).
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS kompas_lead_id BIGINT REFERENCES kompas_leads(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_leads_kompas_lead_id ON leads(kompas_lead_id);

-- 2. custom_payments -> orders: a payment previously had no relationship
--    to the order it was collected for.
ALTER TABLE custom_payments
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_custom_payments_order_id ON custom_payments(order_id);

ALTER TABLE custom_payments
  DROP CONSTRAINT IF EXISTS custom_payments_status_check;
ALTER TABLE custom_payments
  ADD CONSTRAINT custom_payments_status_check
    CHECK (status IN ('paid', 'pending', 'cancelled'));

-- 3. orders.status: normalize the default to the vocabulary the admin UI
--    (app/admin/crm/orders/page.jsx) and API (app/api/admin/crm/orders/route.ts)
--    actually use ('новый', lowercase Russian) instead of the old Ukrainian
--    'Новий' default from scripts/setup-db.js, and add a CHECK so a future
--    writer can't introduce a third vocabulary alongside it.
ALTER TABLE orders
  ALTER COLUMN status SET DEFAULT 'новый';

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
    CHECK (status IN ('новый', 'согласование', 'производство', 'доставка', 'выполнено', 'отменено'));

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders
  ADD CONSTRAINT orders_payment_status_check
    CHECK (payment_status IN ('Неоплачено', 'Оплачено', 'Частково'));
