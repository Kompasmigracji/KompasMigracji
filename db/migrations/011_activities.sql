-- ================================================================
-- MIGRATION: 011_activities.sql
-- Author: Genius/KompasCRM
-- Version: 1.0.0
-- Compatible: PostgreSQL 15+ / Supabase
-- ================================================================

CREATE TABLE IF NOT EXISTS kompas_activities (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type  VARCHAR(50) NOT NULL CHECK (entity_type IN ('lead', 'member', 'deal', 'case')),
  entity_id    VARCHAR(255) NOT NULL,
  actor_id     BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  type         VARCHAR(50) NOT NULL CHECK (type IN ('note', 'email', 'call', 'meeting', 'status_change', 'file', 'system')),
  title        VARCHAR(255),
  body         TEXT,
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for speedy timelines on any specific record
CREATE INDEX IF NOT EXISTS idx_activities_entity ON kompas_activities(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_actor  ON kompas_activities(actor_id);
