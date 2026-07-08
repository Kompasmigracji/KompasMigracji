-- Migration 019: Trade Union Compass - Digital Profile (Stage 1)

-- 1. Extend kompas_member_profiles with AI and skills data
ALTER TABLE kompas_member_profiles
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS language_skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS hard_skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS soft_skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS profile_completion INTEGER DEFAULT 0;

-- 2. Member Documents (Visas, Karta Pobytu, Passports)
CREATE TABLE IF NOT EXISTS kompas_member_documents (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES kompas_users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL, -- 'passport', 'visa', 'karta_pobytu', 'pesel', 'other'
  doc_number TEXT,
  issued_by TEXT,
  issued_at DATE,
  expires_at DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_documents_user ON kompas_member_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_member_documents_expires ON kompas_member_documents(expires_at);

-- 3. Member Experience (Work History)
CREATE TABLE IF NOT EXISTS kompas_member_experience (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES kompas_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_experience_user ON kompas_member_experience(user_id);

-- 4. Member Education
CREATE TABLE IF NOT EXISTS kompas_member_education (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES kompas_users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_education_user ON kompas_member_education(user_id);

-- 5. AI Agent Interactions Log (For Stage 2 but laying groundwork)
CREATE TABLE IF NOT EXISTS kompas_agent_interactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES kompas_users(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL, -- 'employment', 'migration', 'legal', etc.
  interaction_type TEXT NOT NULL, -- 'profile_update', 'recommendation', 'negotiation'
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_interactions_user ON kompas_agent_interactions(user_id);
