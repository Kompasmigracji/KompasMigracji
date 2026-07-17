-- Дозволяє відстежувати покинуті (не завершені) розмови веб-чату Оракула,
-- дзеркалячи те, що вже робить Telegram-шлях (leads.chat_id + history jsonb).
-- Веб-чат раніше не мав жодного серверного стану — розмова жила лише в
-- браузері, тож "покинуту" заявку з сайту неможливо було виявити взагалі.

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS last_activity_at timestamptz,
  ADD COLUMN IF NOT EXISTS abandoned_notified_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_leads_orakul_web_stale
  ON leads (last_activity_at)
  WHERE source = 'orakul_web';
