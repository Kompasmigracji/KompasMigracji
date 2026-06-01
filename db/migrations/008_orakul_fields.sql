-- Migration 008: add email + message fields to leads and kompas_leads
-- Run in Supabase SQL Editor

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS email   TEXT,
  ADD COLUMN IF NOT EXISTS message TEXT;

ALTER TABLE kompas_leads
  ADD COLUMN IF NOT EXISTS email TEXT;
