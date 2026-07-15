-- ================================================================
-- MIGRATION: 025_crm_calls_and_settings.sql
-- Compatible: PostgreSQL 15+ / Supabase
-- ================================================================

-- Журнал дзвінків, прив'язаний до лідів (app/api/admin/crm/calls)
CREATE TABLE IF NOT EXISTS crm_calls (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         UUID        REFERENCES leads(id) ON DELETE SET NULL,
  direction       TEXT        NOT NULL DEFAULT 'outgoing' CHECK (direction IN ('incoming', 'outgoing')),
  phone           TEXT,
  duration_seconds INTEGER    NOT NULL DEFAULT 0,
  outcome         TEXT        NOT NULL DEFAULT 'answered' CHECK (outcome IN ('answered', 'no_answer', 'voicemail', 'busy')),
  notes           TEXT,
  manager_name    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_calls_lead_id ON crm_calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_calls_created_at ON crm_calls(created_at DESC);

ALTER TABLE crm_calls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service all crm_calls" ON crm_calls;
CREATE POLICY "service all crm_calls" ON crm_calls
  FOR ALL USING (true) WITH CHECK (true);

-- Односрядкові налаштування iPhoenixCRM (app/api/admin/crm/settings)
CREATE TABLE IF NOT EXISTS crm_settings (
  id            INTEGER     PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name  TEXT        NOT NULL DEFAULT 'Kompas Migracji',
  country       TEXT        NOT NULL DEFAULT 'Польща',
  timezone      TEXT        NOT NULL DEFAULT '(UTC +01:00) Warsaw',
  logo_url      TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO crm_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE crm_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service all crm_settings" ON crm_settings;
CREATE POLICY "service all crm_settings" ON crm_settings
  FOR ALL USING (true) WITH CHECK (true);
