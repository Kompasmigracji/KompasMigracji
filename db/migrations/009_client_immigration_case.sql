-- ================================================================
-- MIGRATION: 009_client_immigration_case.sql
-- Author: Genius/KompasCRM
-- Version: 1.0.0
-- Compatible: PostgreSQL 15+ / Supabase
-- ================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ----------------------------------------------------------------
-- INTEGRATE AUTH LINK WITH SUPABASE
-- ----------------------------------------------------------------
ALTER TABLE kompas_users ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;
CREATE UNIQUE INDEX IF NOT EXISTS idx_kompas_users_auth_uid ON kompas_users(auth_user_id);

CREATE OR REPLACE FUNCTION auth_user_role() RETURNS TEXT AS $$
  SELECT role FROM kompas_users WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth_user_id() RETURNS BIGINT AS $$
  SELECT id FROM kompas_users WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ----------------------------------------------------------------
-- ENUM TYPES — Sealed state machine for case lifecycle
-- ----------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'case_type_enum') THEN
    CREATE TYPE case_type_enum AS ENUM (
      'karta_pobytu_czasowego',   -- Temporary Residence Permit
      'karta_pobytu_stalego',     -- Permanent Residence Permit
      'karta_polaka',             -- Pole's Card
      'obywatelstwo',             -- Polish Citizenship
      'zezwolenie_na_prace',      -- Work Permit (zezwolenie)
      'oswiadczenie',             -- Oświadczenie (simplified work declaration)
      'niebieska_karta',          -- EU Blue Card
      'łączenie_rodzin',          -- Family Reunification
      'azyl_ochrona',             -- Asylum & Subsidiary Protection
      'odwolanie_wsa',            -- Administrative Court Appeal (WSA)
      'odwolanie_nsa',            -- Supreme Administrative Court (NSA)
      'zmiana_pracodawcy',        -- Employer Change (work permit amendment)
      'inne'                      -- Other / Custom
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'case_status_enum') THEN
    CREATE TYPE case_status_enum AS ENUM (
      'draft',                    -- Case created, not yet submitted to client
      'intake',                   -- Client onboarding in progress
      'documents_required',       -- Waiting for client to upload documents
      'documents_review',         -- Lawyer reviewing uploaded documents
      'documents_verified',       -- All documents confirmed complete & valid
      'appointment_scheduled',    -- Appointment at Urząd booked
      'submitted_to_urząd',       -- Application physically submitted
      'waiting_urząd_decision',   -- Awaiting official government decision
      'additional_docs_requested',-- Urząd requested additional documents (wezwanie)
      'decision_positive',        -- Positive decision received
      'decision_negative',        -- Negative decision received (appeal possible)
      'appeal_filed',             -- KPA/WSA appeal filed
      'completed',                -- Case successfully closed
      'rejected_final',           -- All appeals exhausted / case closed negatively
      'cancelled',                -- Cancelled by client or company
      'archived'                  -- Archived (read-only)
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_type_enum') THEN
    CREATE TYPE document_type_enum AS ENUM (
      'passport',
      'previous_permit',
      'employment_contract',
      'employer_statement',       -- Oświadczenie pracodawcy
      'pesel_confirmation',
      'residence_registration',   -- Zameldowanie
      'zus_rca_confirmation',
      'bank_statement',
      'photo_biometric',
      'translation_certified',    -- Tłumaczenie przysięgłe
      'marriage_certificate',
      'birth_certificate',
      'diploma_education',
      'tax_declaration_pit',
      'insurance_certificate',
      'company_krs_extract',
      'urząd_decision_letter',    -- Decision from Urząd (positive/negative)
      'wezwanie_do_uzupelnienia', -- Official supplementation request
      'court_complaint',          -- WSA/NSA court filing
      'power_of_attorney',        -- Pełnomocnictwo
      'other'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_enum') THEN
    CREATE TYPE priority_enum AS ENUM ('low', 'normal', 'high', 'critical');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_status_enum') THEN
    CREATE TYPE billing_status_enum AS ENUM (
      'pending', 'partially_paid', 'paid', 'overdue', 'waived', 'refunded'
    );
  END IF;
END
$$;

-- ----------------------------------------------------------------
-- TABLE 1: immigration_cases — Core case entity
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS immigration_cases (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number           TEXT UNIQUE NOT NULL,
  client_id             BIGINT NOT NULL REFERENCES kompas_users(id) ON DELETE RESTRICT,
  assigned_lawyer_id    BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  assigned_agent_id     BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  branch_id             BIGINT,
  case_type             case_type_enum NOT NULL,
  status                case_status_enum NOT NULL DEFAULT 'intake',
  priority              priority_enum NOT NULL DEFAULT 'normal',
  destination_country   TEXT NOT NULL DEFAULT 'Polska',
  destination_city      TEXT,
  voivodeship           TEXT,
  urząd_branch          TEXT,
  intake_date           DATE NOT NULL DEFAULT CURRENT_DATE,
  appointment_date      TIMESTAMPTZ,
  submission_date       DATE,
  decision_date         DATE,
  permit_valid_from     DATE,
  permit_valid_until    DATE,
  sla_target_date       DATE,
  application_details   JSONB DEFAULT '{}',
  application_ref_no    TEXT,
  decision_letter_no    TEXT,
  decision_notes        TEXT,
  internal_notes        TEXT,
  client_notes          TEXT,
  agreed_service_fee    NUMERIC(10,2),
  fee_currency          TEXT DEFAULT 'PLN',
  billing_status        billing_status_enum NOT NULL DEFAULT 'pending',
  government_fees_paid  NUMERIC(10,2) DEFAULT 0,
  lead_id               BIGINT,
  referral_code         TEXT,
  rodo_consented_at     TIMESTAMPTZ,
  rodo_consent_version  TEXT DEFAULT '2.0',
  data_retention_until  DATE,
  deleted_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-generate sequential case number: KM-YYYY-NNNNN
CREATE SEQUENCE IF NOT EXISTS immigration_case_seq START 1;
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.case_number := 'KM-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
    LPAD(nextval('immigration_case_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_case_number ON immigration_cases;
CREATE TRIGGER trg_case_number
  BEFORE INSERT ON immigration_cases
  FOR EACH ROW WHEN (NEW.case_number IS NULL)
  EXECUTE FUNCTION generate_case_number();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cases_updated_at ON immigration_cases;
CREATE TRIGGER trg_cases_updated_at
  BEFORE UPDATE ON immigration_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ----------------------------------------------------------------
-- TABLE 2: case_documents
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS case_documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id             UUID NOT NULL REFERENCES immigration_cases(id) ON DELETE CASCADE,
  uploaded_by         BIGINT NOT NULL REFERENCES kompas_users(id),
  document_type       document_type_enum NOT NULL,
  document_name       TEXT NOT NULL,
  original_filename   TEXT NOT NULL,
  storage_bucket      TEXT NOT NULL DEFAULT 'case-documents',
  storage_path        TEXT NOT NULL UNIQUE,
  storage_url         TEXT,
  mime_type           TEXT NOT NULL,
  size_bytes          BIGINT NOT NULL,
  checksum_sha256     TEXT,
  status              TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'expired', 'superseded')),
  rejection_reason    TEXT,
  document_date       DATE,
  valid_until         DATE,
  is_certified_copy   BOOLEAN DEFAULT FALSE,
  issuing_country     TEXT,
  version             INTEGER NOT NULL DEFAULT 1,
  previous_version_id UUID REFERENCES case_documents(id),
  marked_for_deletion BOOLEAN DEFAULT FALSE,
  deletion_scheduled  DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_docs_updated_at ON case_documents;
CREATE TRIGGER trg_docs_updated_at
  BEFORE UPDATE ON case_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ----------------------------------------------------------------
-- TABLE 3: document_verification
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS document_verification (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id       UUID NOT NULL REFERENCES case_documents(id) ON DELETE CASCADE,
  verified_by       BIGINT NOT NULL REFERENCES kompas_users(id),
  verdict           TEXT NOT NULL CHECK (verdict IN ('approved', 'rejected', 'needs_clarification')),
  notes             TEXT,
  checklist         JSONB DEFAULT '{}',
  verified_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE 4: case_status_history
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS case_status_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id         UUID NOT NULL REFERENCES immigration_cases(id) ON DELETE CASCADE,
  changed_by      BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  from_status     case_status_enum,
  to_status       case_status_enum NOT NULL,
  reason          TEXT,
  metadata        JSONB DEFAULT '{}',
  is_automated    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION log_case_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO case_status_history (case_id, from_status, to_status, is_automated)
    VALUES (NEW.id, OLD.status, NEW.status, FALSE);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_status_history ON immigration_cases;
CREATE TRIGGER trg_status_history
  AFTER UPDATE ON immigration_cases
  FOR EACH ROW EXECUTE FUNCTION log_case_status_change();

-- ----------------------------------------------------------------
-- TABLE 5: case_billing
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS case_billing (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id               UUID NOT NULL REFERENCES immigration_cases(id) ON DELETE RESTRICT,
  due_id                BIGINT REFERENCES kompas_dues(id) ON DELETE SET NULL,
  description           TEXT NOT NULL,
  service_stage         TEXT,
  amount                NUMERIC(10,2) NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'PLN',
  vat_rate              NUMERIC(4,2) DEFAULT 23.00,
  vat_amount            NUMERIC(10,2) GENERATED ALWAYS AS (ROUND(amount * vat_rate / 100, 2)) STORED,
  gross_amount          NUMERIC(10,2) GENERATED ALWAYS AS (ROUND(amount + (amount * vat_rate / 100), 2)) STORED,
  status                billing_status_enum NOT NULL DEFAULT 'pending',
  paid_at               TIMESTAMPTZ,
  payment_method        TEXT,
  payment_reference     TEXT,
  invoice_number        TEXT UNIQUE,
  invoice_pdf_url       TEXT,
  invoice_issued_at     TIMESTAMPTZ,
  due_date              DATE,
  reminder_sent_at      TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_billing_updated_at ON case_billing;
CREATE TRIGGER trg_billing_updated_at
  BEFORE UPDATE ON case_billing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION sync_case_billing_status()
RETURNS TRIGGER AS $$
DECLARE
  v_total    NUMERIC;
  v_paid     NUMERIC;
  v_new_status billing_status_enum;
BEGIN
  SELECT
    COALESCE(SUM(gross_amount), 0),
    COALESCE(SUM(CASE WHEN status = 'paid' THEN gross_amount ELSE 0 END), 0)
  INTO v_total, v_paid
  FROM case_billing
  WHERE case_id = NEW.case_id AND status != 'waived';

  IF v_total = 0 THEN
    v_new_status := 'pending';
  ELSIF v_paid = 0 THEN
    v_new_status := 'pending';
  ELSIF v_paid >= v_total THEN
    v_new_status := 'paid';
  ELSE
    v_new_status := 'partially_paid';
  END IF;

  UPDATE immigration_cases SET billing_status = v_new_status
  WHERE id = NEW.case_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_billing ON case_billing;
CREATE TRIGGER trg_sync_billing
  AFTER INSERT OR UPDATE ON case_billing
  FOR EACH ROW EXECUTE FUNCTION sync_case_billing_status();

-- ----------------------------------------------------------------
-- TABLE 6: case_activities
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS case_activities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id       UUID NOT NULL REFERENCES immigration_cases(id) ON DELETE CASCADE,
  actor_id      BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'note', 'client_message', 'status_change', 'document_upload',
    'document_verified', 'document_rejected', 'appointment', 'call_log',
    'email_sent', 'payment_received', 'system_event'
  )),
  title         TEXT,
  body          TEXT,
  metadata      JSONB DEFAULT '{}',
  is_visible_to_client BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_activities_case ON case_activities(case_id, created_at DESC);

-- ----------------------------------------------------------------
-- TABLE 7: case_sla_events
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS case_sla_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id       UUID NOT NULL REFERENCES immigration_cases(id) ON DELETE CASCADE,
  event_name    TEXT NOT NULL,
  description   TEXT,
  deadline_date TIMESTAMPTZ NOT NULL,
  buffer_days   INTEGER DEFAULT 3,
  is_critical   BOOLEAN DEFAULT FALSE,
  is_resolved   BOOLEAN DEFAULT FALSE,
  resolved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sla_upcoming ON case_sla_events(deadline_date) WHERE is_resolved = FALSE;

CREATE OR REPLACE VIEW v_case_sla_with_alerts AS
SELECT
  *,
  deadline_date - (buffer_days * INTERVAL '1 day') AS alert_at,
  deadline_date <= NOW()                             AS is_overdue,
  deadline_date - NOW() < INTERVAL '24 hours'        AS is_due_today
FROM case_sla_events
WHERE is_resolved = FALSE;

-- ----------------------------------------------------------------
-- TABLE 8: case_checklist_items
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS case_checklist_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id       UUID NOT NULL REFERENCES immigration_cases(id) ON DELETE CASCADE,
  item_name     TEXT NOT NULL,
  document_type document_type_enum,
  is_required   BOOLEAN DEFAULT TRUE,
  is_completed  BOOLEAN DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  document_id   UUID REFERENCES case_documents(id) ON DELETE SET NULL,
  sort_order    INTEGER DEFAULT 0,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- INDEXES & PERFORMANCE
-- ----------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_cases_client       ON immigration_cases(client_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cases_lawyer       ON immigration_cases(assigned_lawyer_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cases_status       ON immigration_cases(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cases_type         ON immigration_cases(case_type);
CREATE INDEX IF NOT EXISTS idx_cases_created      ON immigration_cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_permit_exp   ON immigration_cases(permit_valid_until) WHERE status != 'archived' AND status != 'cancelled';
CREATE INDEX IF NOT EXISTS idx_cases_sla          ON immigration_cases(sla_target_date) WHERE deleted_at IS NULL AND status NOT IN ('completed','archived','cancelled');
CREATE INDEX IF NOT EXISTS idx_docs_case          ON case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_docs_status        ON case_documents(status);
CREATE INDEX IF NOT EXISTS idx_docs_expiry        ON case_documents(valid_until) WHERE valid_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_billing_case       ON case_billing(case_id);
CREATE INDEX IF NOT EXISTS idx_billing_status     ON case_billing(status);
CREATE INDEX IF NOT EXISTS idx_status_hist_case   ON case_status_history(case_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cases_fts ON immigration_cases
  USING GIN(to_tsvector('simple', 
    COALESCE(case_number, '') || ' ' ||
    COALESCE(application_ref_no, '') || ' ' ||
    COALESCE(decision_letter_no, '') || ' ' ||
    COALESCE(internal_notes, '')
  ));

-- ----------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------

ALTER TABLE immigration_cases    ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_documents       ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_billing         ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_activities      ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_status_history  ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_sla_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_checklist_items ENABLE ROW LEVEL SECURITY;

-- Admins: see everything
DROP POLICY IF EXISTS "admin_full_cases" ON immigration_cases;
CREATE POLICY "admin_full_cases" ON immigration_cases
  FOR ALL TO authenticated
  USING (auth_user_role() IN ('admin', 'moderator'))
  WITH CHECK (auth_user_role() IN ('admin', 'moderator'));

-- Lawyers/Managers: see only cases assigned to them
DROP POLICY IF EXISTS "lawyer_own_cases" ON immigration_cases;
CREATE POLICY "lawyer_own_cases" ON immigration_cases
  FOR ALL TO authenticated
  USING (
    auth_user_role() IN ('manager', 'lawyer') AND
    (assigned_lawyer_id = auth_user_id() OR assigned_agent_id = auth_user_id())
  )
  WITH CHECK (
    auth_user_role() IN ('manager', 'lawyer') AND
    (assigned_lawyer_id = auth_user_id() OR assigned_agent_id = auth_user_id())
  );

-- Clients: see only their own cases
DROP POLICY IF EXISTS "client_own_cases" ON immigration_cases;
CREATE POLICY "client_own_cases" ON immigration_cases
  FOR SELECT TO authenticated
  USING (
    auth_user_role() = 'member' AND
    client_id = auth_user_id() AND
    deleted_at IS NULL
  );

-- DOCUMENTS RLS
DROP POLICY IF EXISTS "admin_full_docs" ON case_documents;
CREATE POLICY "admin_full_docs" ON case_documents
  FOR ALL TO authenticated
  USING (auth_user_role() IN ('admin', 'moderator'));

DROP POLICY IF EXISTS "lawyer_assigned_docs" ON case_documents;
CREATE POLICY "lawyer_assigned_docs" ON case_documents
  FOR ALL TO authenticated
  USING (
    auth_user_role() IN ('manager', 'lawyer') AND
    EXISTS (
      SELECT 1 FROM immigration_cases c
      WHERE c.id = case_documents.case_id
      AND (c.assigned_lawyer_id = auth_user_id() OR c.assigned_agent_id = auth_user_id())
    )
  );

DROP POLICY IF EXISTS "client_own_docs_read" ON case_documents;
CREATE POLICY "client_own_docs_read" ON case_documents
  FOR SELECT TO authenticated
  USING (
    auth_user_role() = 'member' AND
    EXISTS (
      SELECT 1 FROM immigration_cases c
      WHERE c.id = case_documents.case_id AND c.client_id = auth_user_id()
    )
  );

DROP POLICY IF EXISTS "client_upload_docs" ON case_documents;
CREATE POLICY "client_upload_docs" ON case_documents
  FOR INSERT TO authenticated
  WITH CHECK (
    auth_user_role() = 'member' AND
    uploaded_by = auth_user_id() AND
    EXISTS (
      SELECT 1 FROM immigration_cases c
      WHERE c.id = case_documents.case_id AND c.client_id = auth_user_id()
      AND c.status IN ('documents_required', 'additional_docs_requested')
    )
  );

-- BILLING RLS
DROP POLICY IF EXISTS "admin_full_billing" ON case_billing;
CREATE POLICY "admin_full_billing" ON case_billing
  FOR ALL TO authenticated
  USING (auth_user_role() IN ('admin', 'moderator'));

DROP POLICY IF EXISTS "lawyer_read_billing" ON case_billing;
CREATE POLICY "lawyer_read_billing" ON case_billing
  FOR SELECT TO authenticated
  USING (
    auth_user_role() IN ('manager', 'lawyer') AND
    EXISTS (
      SELECT 1 FROM immigration_cases c
      WHERE c.id = case_billing.case_id
      AND (c.assigned_lawyer_id = auth_user_id() OR c.assigned_agent_id = auth_user_id())
    )
  );

DROP POLICY IF EXISTS "client_own_billing" ON case_billing;
CREATE POLICY "client_own_billing" ON case_billing
  FOR SELECT TO authenticated
  USING (
    auth_user_role() = 'member' AND
    EXISTS (
      SELECT 1 FROM immigration_cases c
      WHERE c.id = case_billing.case_id AND c.client_id = auth_user_id()
    )
  );

-- ACTIVITIES RLS
DROP POLICY IF EXISTS "admin_full_activities" ON case_activities;
CREATE POLICY "admin_full_activities" ON case_activities
  FOR ALL TO authenticated
  USING (auth_user_role() IN ('admin', 'moderator'));

DROP POLICY IF EXISTS "lawyer_case_activities" ON case_activities;
CREATE POLICY "lawyer_case_activities" ON case_activities
  FOR ALL TO authenticated
  USING (
    auth_user_role() IN ('manager', 'lawyer') AND
    EXISTS (
      SELECT 1 FROM immigration_cases c
      WHERE c.id = case_activities.case_id
      AND (c.assigned_lawyer_id = auth_user_id() OR c.assigned_agent_id = auth_user_id())
    )
  );

DROP POLICY IF EXISTS "client_visible_activities" ON case_activities;
CREATE POLICY "client_visible_activities" ON case_activities
  FOR SELECT TO authenticated
  USING (
    auth_user_role() = 'member' AND
    is_visible_to_client = TRUE AND
    EXISTS (
      SELECT 1 FROM immigration_cases c
      WHERE c.id = case_activities.case_id AND c.client_id = auth_user_id()
    )
  );

-- ----------------------------------------------------------------
-- CHECKLIST AUTOPOPULATE FUNCTION & TRIGGER
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION populate_case_checklist()
RETURNS TRIGGER AS $$
DECLARE
  v_items JSONB;
BEGIN
  v_items := CASE NEW.case_type
    WHEN 'karta_pobytu_czasowego' THEN '[
      {"name":"Paszport (oryginał + 2 kopie)","type":"passport","required":true,"order":1},
      {"name":"4 fotografie biometryczne","type":"photo_biometric","required":true,"order":2},
      {"name":"Umowa o pracę lub promesa","type":"employment_contract","required":true,"order":3},
      {"name":"Potwierdzenie zameldowania","type":"residence_registration","required":true,"order":4},
      {"name":"Ubezpieczenie zdrowotne","type":"insurance_certificate","required":true,"order":5},
      {"name":"Wyciąg z konta bankowego (3 mies.)","type":"bank_statement","required":false,"order":6}
    ]'::JSONB
    WHEN 'niebieska_karta' THEN '[
      {"name":"Paszport","type":"passport","required":true,"order":1},
      {"name":"Dyplom wyższego wykształcenia (tłumaczenie)","type":"diploma_education","required":true,"order":2},
      {"name":"Umowa o pracę (min. 5,733 PLN brutto)","type":"employment_contract","required":true,"order":3},
      {"name":"Potwierdzenie zameldowania","type":"residence_registration","required":true,"order":4},
      {"name":"Fotografie biometryczne x4","type":"photo_biometric","required":true,"order":5}
    ]'::JSONB
    WHEN 'odwolanie_wsa' THEN '[
      {"name":"Decyzja odmowna (oryginał)","type":"urząd_decision_letter","required":true,"order":1},
      {"name":"Paszport","type":"passport","required":true,"order":2},
      {"name":"Pełnomocnictwo procesowe","type":"power_of_attorney","required":true,"order":3},
      {"name":"Skarga do WSA","type":"court_complaint","required":true,"order":4},
      {"name":"Potwierdzenie wniesienia opłaty sądowej","type":"bank_statement","required":true,"order":5}
    ]'::JSONB
    ELSE '[
      {"name":"Paszport","type":"passport","required":true,"order":1},
      {"name":"Fotografie biometryczne x4","type":"photo_biometric","required":true,"order":2}
    ]'::JSONB
  END;

  INSERT INTO case_checklist_items (case_id, item_name, document_type, is_required, sort_order)
  SELECT 
    NEW.id,
    (item->>'name')::TEXT,
    (item->>'type')::document_type_enum,
    (item->>'required')::BOOLEAN,
    (item->>'order')::INTEGER
  FROM jsonb_array_elements(v_items) AS item;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_populate_checklist ON immigration_cases;
CREATE TRIGGER trg_populate_checklist
  AFTER INSERT ON immigration_cases
  FOR EACH ROW EXECUTE FUNCTION populate_case_checklist();

-- ----------------------------------------------------------------
-- GDPR RIGHT TO ERASURE FUNCTION
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION gdpr_erase_client_case_data(p_client_id BIGINT)
RETURNS TABLE(erased_entity TEXT, erased_count INTEGER) AS $$
BEGIN
  -- Mark documents for deletion
  UPDATE case_documents
  SET marked_for_deletion = TRUE,
      deletion_scheduled = CURRENT_DATE + INTERVAL '30 days',
      document_name = '[ERASED]',
      original_filename = '[ERASED]'
  WHERE case_id IN (SELECT id FROM immigration_cases WHERE client_id = p_client_id);
  RETURN QUERY SELECT 'documents'::TEXT, ROW_COUNT::INTEGER;

  -- Anonymize case content
  UPDATE immigration_cases
  SET internal_notes = '[ERASED PER GDPR REQUEST]',
      client_notes   = '[ERASED PER GDPR REQUEST]',
      application_details = '{"gdpr_erased": true}'::JSONB,
      deleted_at     = NOW()
  WHERE client_id = p_client_id;
  RETURN QUERY SELECT 'case_content'::TEXT, ROW_COUNT::INTEGER;

  -- Purge activity messages
  UPDATE case_activities
  SET body  = '[ERASED]',
      title = '[ERASED]',
      metadata = '{}'::JSONB
  WHERE case_id IN (SELECT id FROM immigration_cases WHERE client_id = p_client_id);
  RETURN QUERY SELECT 'activities'::TEXT, ROW_COUNT::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------
-- ANALYTICS VIEWS
-- ----------------------------------------------------------------

CREATE OR REPLACE VIEW v_case_analytics AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  case_type,
  status,
  COUNT(*)                         AS case_count,
  AVG(agreed_service_fee)          AS avg_fee,
  SUM(agreed_service_fee)          AS total_revenue,
  AVG(
    EXTRACT(EPOCH FROM (
      COALESCE(decision_date::TIMESTAMPTZ, NOW()) - intake_date::TIMESTAMPTZ
    )) / 86400
  )::INTEGER                       AS avg_processing_days,
  COUNT(*) FILTER (WHERE status = 'decision_positive') AS won_count,
  COUNT(*) FILTER (WHERE status = 'decision_negative') AS lost_count
FROM immigration_cases
WHERE deleted_at IS NULL
GROUP BY 1, 2, 3;

CREATE OR REPLACE VIEW v_expiring_permits AS
SELECT
  c.id, c.case_number, c.case_type, c.status,
  c.permit_valid_until,
  (c.permit_valid_until - CURRENT_DATE) AS days_until_expiry,
  u.full_name AS client_name,
  u.email     AS client_email,
  lu.full_name AS lawyer_name
FROM immigration_cases c
JOIN kompas_users u  ON u.id = c.client_id
LEFT JOIN kompas_users lu ON lu.id = c.assigned_lawyer_id
WHERE c.permit_valid_until IS NOT NULL
  AND c.permit_valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
  AND c.deleted_at IS NULL
ORDER BY c.permit_valid_until ASC;
