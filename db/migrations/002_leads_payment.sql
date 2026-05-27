-- Migration 002: add payment + bot columns to leads + message_templates
-- Run in Supabase → SQL Editor

-- ── Нові колонки в leads ──────────────────────────────────────────────
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS source        TEXT NOT NULL DEFAULT 'site',
  ADD COLUMN IF NOT EXISTS qualification TEXT,
  ADD COLUMN IF NOT EXISTS session_id    TEXT,
  ADD COLUMN IF NOT EXISTS paid_at       TIMESTAMPTZ;

-- Унікальний індекс на session_id (NULL ігноруються)
CREATE UNIQUE INDEX IF NOT EXISTS leads_session_id_idx
  ON leads (session_id)
  WHERE session_id IS NOT NULL;

-- Індекс для швидкого пошуку по paid_at
CREATE INDEX IF NOT EXISTS leads_paid_at_idx
  ON leads (paid_at)
  WHERE paid_at IS NOT NULL;

-- ── message_templates ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS message_templates (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT        NOT NULL,
  slug       TEXT        NOT NULL UNIQUE,
  category   TEXT        NOT NULL DEFAULT 'general',
  body       TEXT        NOT NULL DEFAULT '',
  auto_send  BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: дозволяємо всі операції через service role
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service all templates" ON message_templates;
CREATE POLICY "service all templates" ON message_templates
  FOR ALL USING (true) WITH CHECK (true);

-- Приклад шаблону підтвердження оплати (авто-відправка)
INSERT INTO message_templates (title, slug, category, body, auto_send, sort_order)
VALUES (
  'Підтвердження оплати',
  'payment-confirm',
  'payment',
  '✅ <b>Оплату підтверджено!</b>

Вітаємо, {{name}}! Ваш платіж за послугу "<b>{{service}}</b>" успішно отримано.

Ваш менеджер зв''яжеться з вами найближчим часом.
Питання? Телефонуйте: <b>{{contact}}</b>',
  true,
  1
)
ON CONFLICT (slug) DO NOTHING;
