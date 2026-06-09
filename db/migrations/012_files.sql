-- ================================================================
-- MIGRATION: 012_files.sql
-- Author: Genius/KompasCRM
-- Version: 1.0.0
-- Compatible: PostgreSQL 15+ / Supabase
-- ================================================================

CREATE TABLE IF NOT EXISTS kompas_files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type   VARCHAR(50) CHECK (entity_type IN ('lead', 'member', 'deal', 'case')),
  entity_id     VARCHAR(255),
  filename      VARCHAR(500) NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  mime_type     VARCHAR(100),
  size_bytes    BIGINT,
  storage_path  VARCHAR(1000) NOT NULL UNIQUE,
  uploaded_by   BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_files_entity ON kompas_files(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON kompas_files(uploaded_by);
