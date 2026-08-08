-- 046_payments_order_numbers.sql
-- Робить грошовий шлях спостережуваним і незагубним.
--
-- Контекст (07.08.2026): клієнт оплатив 250 zł через BLIK, P24 списав гроші,
-- але /api/payment-notify отримав 401 від transaction/verify і вийшов з 502
-- ДО того, як щось записати. Наслідок: у leads paid_at NULL, у CRM нічого,
-- клієнту сторінка показала «Оплату ще не підтверджено» з кнопкою «Спробувати
-- ще раз». Жодного сліду платежу в базі — окрім листа з P24 на пошту.
--
-- kompas_payments уже існує (створена вручну під час відновлення тієї
-- транзакції), але на неї не посилається жоден рядок коду. Ця міграція
-- добудовує те, чого бракує, щоб код міг на неї спертися.

-- 1. Наскрізна нумерація замовлень: KM-000001, KM-000002, ...
--    Шеф просив саме такий формат у листах клієнту й менеджеру.
CREATE SEQUENCE IF NOT EXISTS kompas_order_number_seq START WITH 1 INCREMENT BY 1;

-- 2. Зв'язок платежу з лідом-джерелом (leads.id — uuid, не bigint).
--    Старий стовпець lead_id був bigint і не міг зберегти uuid ліда;
--    лишаємо його для kompas_leads.id, додаємо окремий для leads.id.
ALTER TABLE kompas_payments
  ADD COLUMN IF NOT EXISTS lead_uuid uuid REFERENCES leads(id) ON DELETE SET NULL;

-- 3. Скільки разів ми пробували верифікувати транзакцію і коли востаннє —
--    щоб /api/cron/payment-reverify міг добирати «зависли» платежі,
--    не крутячи вічно ті самі безнадійні.
ALTER TABLE kompas_payments
  ADD COLUMN IF NOT EXISTS verify_attempts integer NOT NULL DEFAULT 0;
ALTER TABLE kompas_payments
  ADD COLUMN IF NOT EXISTS last_verify_at timestamptz;

-- 4. Хто з менеджерів узяв замовлення в роботу (кнопка «Взяти в роботу»).
--    kompas_users.id — bigint (не uuid, як leads.id): у цій базі співіснують
--    обидва типи ключів, і плутанина між ними вже коштувала робочого крона
--    (lead-followup ганяв uuid через ::bigint[] і падав з 05.08).
ALTER TABLE kompas_payments
  ADD COLUMN IF NOT EXISTS claimed_by bigint REFERENCES kompas_users(id) ON DELETE SET NULL;
ALTER TABLE kompas_payments
  ADD COLUMN IF NOT EXISTS claimed_at timestamptz;

-- 5. Дозволені статуси. verify_failed — реальний стан «гроші списані,
--    але P24 не підтвердив»; його не можна плутати ні з pending, ні з paid.
--
--    УВАГА: констрейнт із такою назвою вже існував (список без 'cancelled',
--    зате з 'notified'). Обгортка IF NOT EXISTS тут мовчки нічого б не
--    зробила, і база відхилила б 'cancelled' при першому ж записі —
--    хоча код типізує його як валідний. Тому DROP + ADD, а не IF NOT EXISTS.
ALTER TABLE kompas_payments DROP CONSTRAINT IF EXISTS kompas_payments_status_check;
ALTER TABLE kompas_payments ADD CONSTRAINT kompas_payments_status_check
  CHECK (status IN ('pending','notified','paid','verify_failed','failed','refunded','cancelled'));

CREATE INDEX IF NOT EXISTS kompas_payments_unresolved_idx
  ON kompas_payments (status, last_verify_at NULLS FIRST)
  WHERE status IN ('pending','verify_failed');

CREATE INDEX IF NOT EXISTS kompas_payments_lead_uuid_idx
  ON kompas_payments (lead_uuid);

-- 6. leads.session_id шукається на кожному вебхуці й на кожному опитуванні
--    сторінки /payment/success — без індексу це seq scan по всій таблиці.
CREATE INDEX IF NOT EXISTS leads_session_id_idx ON leads (session_id)
  WHERE session_id IS NOT NULL;

-- 7. kompas_leads.source: 'pricing' відхилявся чек-констрейнтом, через що
--    INSERT ліда з /api/payment падав, kompas_lead_id лишався NULL і лід
--    не потрапляв у воронку CRM взагалі. Значення додано вручну 07.08 —
--    фіксуємо це міграцією, щоб не загубилося при відновленні бази з нуля.
DO $$
BEGIN
  ALTER TABLE kompas_leads DROP CONSTRAINT IF EXISTS kompas_leads_source_check;
  ALTER TABLE kompas_leads ADD CONSTRAINT kompas_leads_source_check
    CHECK (source IN (
      'bot','site','facebook','instagram','other','pricing','payment','landing',
      'form','telegram','viber','whatsapp','ai_chat','referral','crm','import'
    ));
END $$;

-- 8. kompas_payments_touch мав mutable search_path (Supabase security lint
--    0011) — тригер із SECURITY DEFINER і рухомим search_path це вектор
--    підміни функції через створення однойменної в іншій схемі.
CREATE OR REPLACE FUNCTION kompas_payments_touch()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;
