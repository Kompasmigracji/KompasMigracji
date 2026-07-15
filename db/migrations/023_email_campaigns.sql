-- ================================================================
-- MIGRATION: 023_email_campaigns.sql
-- Compatible: PostgreSQL 15+ / Supabase
-- ================================================================

-- Разові email-розсилки з адмін-панелі (app/api/admin/emails/campaigns)
CREATE TABLE IF NOT EXISTS email_campaigns (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  subject      TEXT        NOT NULL,
  body         TEXT        NOT NULL,
  target_count INTEGER     NOT NULL DEFAULT 0,
  status       TEXT        NOT NULL DEFAULT 'SENT',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON email_campaigns(created_at DESC);

-- RLS: доступ лише через service role (адмінський API-роут з requireAuth)
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service all email_campaigns" ON email_campaigns;
CREATE POLICY "service all email_campaigns" ON email_campaigns
  FOR ALL USING (true) WITH CHECK (true);
