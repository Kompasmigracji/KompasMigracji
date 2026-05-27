-- Migration: add soft-delete to leads table
-- Run: psql "$DATABASE_URL" -f db/migrations/001_leads_trash.sql

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Index for fast trash queries
CREATE INDEX IF NOT EXISTS leads_deleted_at_idx ON leads (deleted_at)
  WHERE deleted_at IS NOT NULL;

-- Comment
COMMENT ON COLUMN leads.deleted_at IS 'Soft-delete timestamp. NULL = active, NOT NULL = in trash.';
