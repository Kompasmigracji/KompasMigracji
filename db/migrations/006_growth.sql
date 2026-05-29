-- Migration 006: Growth Engine
-- Innovation 8: Subscription Plans (F1-F4)
-- Innovation 9: Appointment Bookings (F6-F8)
-- Innovation 10: NPS Surveys (F5, F6 auto-send)
-- F13: Email notification log
-- F14-F15: Welcome + case-update email triggers

-- ── Subscription Plans catalog ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kompas_subscription_plans (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  price_pln   NUMERIC(10,2) NOT NULL,
  price_eur   NUMERIC(10,2),
  billing_cycle TEXT DEFAULT 'monthly' CHECK(billing_cycle IN ('monthly','yearly')),
  features    JSONB DEFAULT '[]',
  is_popular  BOOLEAN DEFAULT false,
  is_active   BOOLEAN DEFAULT true,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO kompas_subscription_plans
  (name, slug, price_pln, price_eur, billing_cycle, features, is_popular, sort_order)
VALUES
  ('Basic', 'basic', 49.00, 12.00, 'monthly',
   '["Konsultacja online 30 min", "Dostep do poradnikow PDF", "Bot Telegram 24/7", "Status sprawy online"]',
   false, 1),
  ('Standard', 'standard', 149.00, 35.00, 'monthly',
   '["Wszystko z Basic", "Konsultacja 60 min/mies.", "Dedykowany doradca", "Priorytetowa obsluga", "Powiadomienia Telegram"]',
   true, 2),
  ('Premium', 'premium', 349.00, 82.00, 'monthly',
   '["Wszystko z Standard", "Nieograniczone konsultacje", "Reprezentacja prawna", "Przygotowanie dokumentow", "Gwarancja rezultatu"]',
   false, 3)
ON CONFLICT (slug) DO NOTHING;

-- ── Active subscriptions ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kompas_subscriptions (
  id              BIGSERIAL PRIMARY KEY,
  lead_id         BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  member_id       BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  plan_slug       TEXT NOT NULL,
  plan_name       TEXT,
  status          TEXT DEFAULT 'active'
                  CHECK(status IN ('active','cancelled','past_due','expired','trial')),
  amount_pln      NUMERIC(10,2),
  starts_at       TIMESTAMPTZ DEFAULT now(),
  ends_at         TIMESTAMPTZ,
  next_billing_at TIMESTAMPTZ,
  session_id      TEXT UNIQUE,
  email           TEXT,
  client_name     TEXT,
  renewal_notified BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── Appointment Bookings ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kompas_appointments (
  id              BIGSERIAL PRIMARY KEY,
  lead_id         BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  member_id       BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  assigned_to     BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  client_name     TEXT NOT NULL,
  client_email    TEXT,
  client_phone    TEXT,
  service         TEXT,
  appointment_at  TIMESTAMPTZ NOT NULL,
  duration_min    INT DEFAULT 30,
  status          TEXT DEFAULT 'pending'
                  CHECK(status IN ('pending','confirmed','cancelled','completed','no_show')),
  meeting_link    TEXT,
  notes           TEXT,
  reminder_sent   BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── NPS Surveys ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kompas_nps_surveys (
  id            BIGSERIAL PRIMARY KEY,
  case_id       BIGINT,
  lead_id       BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  client_name   TEXT,
  client_email  TEXT,
  score         INT CHECK(score >= 0 AND score <= 10),
  comment       TEXT,
  token         TEXT UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
  sent_at       TIMESTAMPTZ,
  submitted_at  TIMESTAMPTZ
);

-- ── Email notification log ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kompas_email_log (
  id          BIGSERIAL PRIMARY KEY,
  recipient   TEXT NOT NULL,
  subject     TEXT,
  template    TEXT,
  status      TEXT DEFAULT 'sent' CHECK(status IN ('sent','failed','bounced')),
  error       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_kompas_subscriptions_status     ON kompas_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_kompas_subscriptions_next_bill  ON kompas_subscriptions(next_billing_at);
CREATE INDEX IF NOT EXISTS idx_kompas_appointments_at          ON kompas_appointments(appointment_at);
CREATE INDEX IF NOT EXISTS idx_kompas_appointments_status      ON kompas_appointments(status);
CREATE INDEX IF NOT EXISTS idx_kompas_nps_token                ON kompas_nps_surveys(token);
