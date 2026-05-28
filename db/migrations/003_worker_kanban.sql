-- Migration 003: Worker assignment for Ponaglenie cases
-- Run in Supabase SQL Editor

ALTER TABLE cases
  ADD COLUMN IF NOT EXISTS assigned_to bigint REFERENCES kompas_users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_cases_assigned_to ON cases(assigned_to);
