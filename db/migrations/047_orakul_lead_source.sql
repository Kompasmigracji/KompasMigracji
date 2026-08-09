-- 047_orakul_lead_source.sql
-- Оракул-анкети (welding EWU widget) писались у kompas_leads із source
-- жорстко зашитим як 'other', бо власного значення 'orakul' у CHECK-констрейнті
-- не було. Наслідок (09.08.2026): 40 анкет з 17.07 неможливо відфільтрувати
-- чи порахувати за джерелом у CRM-воронці — той самий клас бага, що вже
-- ламав INSERT з /api/payment для 'pricing' (див. 046, п.7).
--
-- Заразом kompas_leads.id ніколи не писався назад у leads.kompas_lead_id
-- (виправлено в коді, app/api/orakul/chat/route.ts) — цю міграцію потрібно
-- застосувати ДО деплою того фіксу, інакше INSERT з source='orakul' сам
-- впаде на CHECK-констрейнті.

ALTER TABLE kompas_leads DROP CONSTRAINT IF EXISTS kompas_leads_source_check;
ALTER TABLE kompas_leads ADD CONSTRAINT kompas_leads_source_check
  CHECK (source IN (
    'bot','site','facebook','instagram','other','pricing','payment','landing',
    'form','telegram','viber','whatsapp','ai_chat','referral','crm','import','orakul'
  ));
