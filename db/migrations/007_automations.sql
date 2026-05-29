-- 007_automations.sql
-- Таблиці для системи автоматизації профспілки

-- Стан кожної автоматизації (увімкнено/вимкнено, статистика)
CREATE TABLE IF NOT EXISTS automation_states (
  id            TEXT PRIMARY KEY,
  enabled       BOOLEAN NOT NULL DEFAULT true,
  last_run      TIMESTAMPTZ,
  runs_total    INTEGER NOT NULL DEFAULT 0,
  errors_total  INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Лог виконання автоматизацій
CREATE TABLE IF NOT EXISTS automation_logs (
  id             BIGSERIAL PRIMARY KEY,
  automation_id  TEXT NOT NULL REFERENCES automation_states(id) ON DELETE CASCADE,
  success        BOOLEAN NOT NULL,
  message        TEXT,
  duration_ms    INTEGER,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS automation_logs_created ON automation_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS automation_logs_auto ON automation_logs (automation_id);

-- Документи членів (для doc-expiry-monitor)
CREATE TABLE IF NOT EXISTS member_documents (
  id         BIGSERIAL PRIMARY KEY,
  member_id  UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  doc_type   TEXT NOT NULL,         -- karta_pobytu, wiza, praca, paszport
  expires_at TIMESTAMPTZ,
  issued_at  TIMESTAMPTZ,
  number     TEXT,
  meta       JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS member_docs_member ON member_documents (member_id);
CREATE INDEX IF NOT EXISTS member_docs_expires ON member_documents (expires_at);

-- Досягнення членів (для milestone-celebrate)
CREATE TABLE IF NOT EXISTS member_milestones (
  id             BIGSERIAL PRIMARY KEY,
  member_id      UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL,    -- karta_pobytu, citizenship, first_job, permit_renewal
  achieved_at    TIMESTAMPTZ DEFAULT NOW(),
  meta           JSONB DEFAULT '{}',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Логи змін статусів справ (для case-status-broadcast)
CREATE TABLE IF NOT EXISTS case_logs (
  id         BIGSERIAL PRIMARY KEY,
  case_id    UUID NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID,
  meta       JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS case_logs_case ON case_logs (case_id);
CREATE INDEX IF NOT EXISTS case_logs_created ON case_logs (created_at DESC);

-- Початкові записи для всіх 21 автоматизацій
INSERT INTO automation_states (id, enabled) VALUES
  ('lead-scorer',          true),
  ('welcome-sequence',     true),
  ('reactivation',         true),
  ('follow-up-nudge',      true),
  ('referral-reward',      true),
  ('doc-expiry-monitor',   true),
  ('doc-checklist-gen',    true),
  ('case-status-broadcast',true),
  ('payment-reminder',     true),
  ('subscription-renewal', true),
  ('mrr-anomaly-alert',    true),
  ('telegram-smart-reply', true),
  ('weekly-legal-digest',  true),
  ('segment-broadcast',    true),
  ('emergency-router',     true),
  ('member-onboarding',    true),
  ('milestone-celebrate',  true),
  ('legal-change-alert',   true),
  ('employer-matcher',     true),
  ('system-health-monitor',true),
  ('mrr-forecast-engine',  true)
ON CONFLICT (id) DO NOTHING;
