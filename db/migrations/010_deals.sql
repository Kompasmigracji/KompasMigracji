-- ================================================================
-- MIGRATION: 010_deals.sql
-- Author: Genius/KompasCRM
-- Version: 1.0.0
-- Compatible: PostgreSQL 15+ / Supabase
-- ================================================================

CREATE TABLE IF NOT EXISTS kompas_deals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          VARCHAR(255) NOT NULL,
  lead_id        BIGINT REFERENCES kompas_leads(id) ON DELETE SET NULL,
  member_id      BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  assigned_to    BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  stage          VARCHAR(50) NOT NULL DEFAULT 'prospecting'
                 CHECK (stage IN ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  amount         NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  currency       VARCHAR(3) NOT NULL DEFAULT 'PLN',
  probability    INTEGER NOT NULL DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close DATE,
  closed_at      TIMESTAMPTZ,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for search/filter performance
CREATE INDEX IF NOT EXISTS idx_deals_lead        ON kompas_deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_member      ON kompas_deals(member_id);
CREATE INDEX IF NOT EXISTS idx_deals_assigned    ON kompas_deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_stage       ON kompas_deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_close_date  ON kompas_deals(expected_close);

-- Drop trigger if exists and recreate to keep updated_at in sync
DROP TRIGGER IF EXISTS trg_deals_updated_at ON kompas_deals;
CREATE TRIGGER trg_deals_updated_at
  BEFORE UPDATE ON kompas_deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
