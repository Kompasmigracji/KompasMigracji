-- ================================================================
-- MIGRATION: 013_reports.sql
-- Author: Genius/KompasCRM
-- Version: 1.0.0
-- Compatible: PostgreSQL 15+ / Supabase
-- ================================================================

CREATE TABLE IF NOT EXISTS kompas_reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(255) NOT NULL,
  type        VARCHAR(20) NOT NULL DEFAULT 'list' CHECK (type IN ('list', 'summary', 'chart')),
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('leads', 'members', 'deals', 'cases')),
  config      JSONB NOT NULL DEFAULT '{}',
  created_by  BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  is_shared   BOOLEAN NOT NULL DEFAULT FALSE,
  schedule    VARCHAR(50) CHECK (schedule IN ('daily', 'weekly', 'monthly', NULL)),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for listings
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON kompas_reports(created_by);

-- Drop trigger if exists and recreate to keep updated_at in sync
DROP TRIGGER IF EXISTS trg_reports_updated_at ON kompas_reports;
CREATE TRIGGER trg_reports_updated_at
  BEFORE UPDATE ON kompas_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
