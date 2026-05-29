-- Migration 005: Automation — 7 innovations, 21 functions
-- Run in Supabase SQL Editor

-- ── Innovation 1: Revenue Snapshots (F1-F3) ──────────────────────────
CREATE TABLE IF NOT EXISTS kompas_revenue_snapshots (
  id               BIGSERIAL PRIMARY KEY,
  date             DATE        NOT NULL UNIQUE,
  mrr              NUMERIC(12,2) NOT NULL DEFAULT 0,
  arr              NUMERIC(12,2) NOT NULL DEFAULT 0,
  members_active   INT         NOT NULL DEFAULT 0,
  members_new      INT         NOT NULL DEFAULT 0,
  dues_collected   NUMERIC(12,2) NOT NULL DEFAULT 0,
  leads_new        INT         NOT NULL DEFAULT 0,
  leads_converted  INT         NOT NULL DEFAULT 0,
  churn_risk       INT         NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Innovation 2: Referral Program (F4-F6) ───────────────────────────
CREATE TABLE IF NOT EXISTS kompas_referrals (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT REFERENCES kompas_users(id) ON DELETE CASCADE,
  code          TEXT        NOT NULL UNIQUE,
  clicks        INT         NOT NULL DEFAULT 0,
  conversions   INT         NOT NULL DEFAULT 0,
  reward_total  NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Innovation 3: Broadcasts (F7-F9) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS kompas_broadcasts (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT        NOT NULL,
  body         TEXT        NOT NULL,
  segment      TEXT        NOT NULL DEFAULT 'all',
  channel      TEXT        NOT NULL DEFAULT 'telegram',
  status       TEXT        NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','sending','sent','failed')),
  sent_count   INT         NOT NULL DEFAULT 0,
  failed_count INT         NOT NULL DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  sent_at      TIMESTAMPTZ,
  created_by   BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Innovation 4: Client Portal (F10-F12) ────────────────────────────
CREATE TABLE IF NOT EXISTS kompas_portal_sessions (
  id          BIGSERIAL PRIMARY KEY,
  pin         TEXT        NOT NULL UNIQUE,
  lead_id     UUID,
  client_name TEXT,
  service     TEXT,
  status      TEXT        NOT NULL DEFAULT 'active',
  notes       TEXT,
  accessed_at TIMESTAMPTZ,
  pin_sent_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Innovation 5: Lead Scoring + Auto-Assign (F13-F15) ───────────────
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS score            INT  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS auto_assigned_to BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS ref_code         TEXT,
  ADD COLUMN IF NOT EXISTS escalated_at     TIMESTAMPTZ;

-- ── Innovation 7: Generated Documents (F19-F21) ──────────────────────
CREATE TABLE IF NOT EXISTS kompas_generated_docs (
  id            BIGSERIAL PRIMARY KEY,
  doc_number    TEXT        NOT NULL UNIQUE,
  template_slug TEXT        NOT NULL,
  lead_id       UUID,
  member_id     BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  body_html     TEXT        NOT NULL,
  vars_json     JSONB,
  generated_by  BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sequence for doc numbers: KM-YYYY-NNNN
CREATE SEQUENCE IF NOT EXISTS kompas_doc_seq START 1;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_referrals_code      ON kompas_referrals(code);
CREATE INDEX IF NOT EXISTS idx_referrals_user      ON kompas_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_broadcasts_status   ON kompas_broadcasts(status);
CREATE INDEX IF NOT EXISTS idx_portal_pin          ON kompas_portal_sessions(pin);
CREATE INDEX IF NOT EXISTS idx_portal_lead         ON kompas_portal_sessions(lead_id);
CREATE INDEX IF NOT EXISTS idx_revenue_date        ON kompas_revenue_snapshots(date DESC);
CREATE INDEX IF NOT EXISTS idx_leads_score         ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_generated_docs_num  ON kompas_generated_docs(doc_number);

-- Fix: leads.id is UUID, not BIGINT — alter if tables were created with old BIGINT type
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='kompas_portal_sessions' AND column_name='lead_id' AND data_type='bigint'
  ) THEN
    ALTER TABLE kompas_portal_sessions ALTER COLUMN lead_id TYPE UUID USING NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='kompas_generated_docs' AND column_name='lead_id' AND data_type='bigint'
  ) THEN
    ALTER TABLE kompas_generated_docs ALTER COLUMN lead_id TYPE UUID USING NULL;
  END IF;
END $$;
