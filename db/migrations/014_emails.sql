-- ================================================================
-- MIGRATION: 014_emails.sql
-- Author: Genius/KompasCRM
-- Version: 1.0.0
-- Compatible: PostgreSQL 15+ / Supabase
-- ================================================================

-- Электронная почта
CREATE TABLE IF NOT EXISTS kompas_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id VARCHAR(500),
  from_address VARCHAR(255) NOT NULL,
  to_addresses TEXT[] NOT NULL,
  cc_addresses TEXT[],
  subject VARCHAR(1000),
  body_html TEXT,
  body_text TEXT,
  folder VARCHAR(50) DEFAULT 'inbox',
  status VARCHAR(20) DEFAULT 'received',
  is_read BOOLEAN DEFAULT FALSE,
  entity_type VARCHAR(50), -- 'lead','member','deal','case'
  entity_id VARCHAR(255),
  sent_by BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Почтовые аккаунты
CREATE TABLE IF NOT EXISTS kompas_email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES kompas_users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  imap_host VARCHAR(255), imap_port INTEGER, imap_ssl BOOLEAN DEFAULT TRUE,
  smtp_host VARCHAR(255), smtp_port INTEGER, smtp_ssl BOOLEAN DEFAULT TRUE,
  username VARCHAR(255),
  password_encrypted TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_emails_from_addr ON kompas_emails(from_address);
CREATE INDEX IF NOT EXISTS idx_emails_folder ON kompas_emails(folder);
CREATE INDEX IF NOT EXISTS idx_emails_entity ON kompas_emails(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_accounts_user ON kompas_email_accounts(user_id);
