-- Migration: 017_lifeos_engines_logs.sql
-- Description: Adds tables for Architect Panel, FateEngine, SoulEngine, and System Logs

-- 1. System Modules (Feature Flags & Engine states)
CREATE TABLE IF NOT EXISTS system_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL, -- e.g., 'FateEngine', 'SoulEngine', 'OmegaLayer'
  is_active boolean DEFAULT false,
  settings jsonb DEFAULT '{}'::jsonb,
  last_updated_at timestamptz DEFAULT now()
);

-- Insert default modules if they don't exist
INSERT INTO system_modules (name, is_active)
VALUES 
  ('FateEngine', true),
  ('SoulEngine', true),
  ('OmegaLayer', false)
ON CONFLICT (name) DO NOTHING;

-- 2. Architect Settings (Global config)
CREATE TABLE IF NOT EXISTS architect_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO architect_settings (key, value)
VALUES 
  ('theme', '"cyber-neon"'),
  ('system_mode', '"production"'),
  ('ai_model', '"claude-3-5-sonnet-20241022"')
ON CONFLICT (key) DO NOTHING;

-- 3. System Logs (Events & Errors)
CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL CHECK (level IN ('info', 'warn', 'error', 'critical')),
  source text NOT NULL, -- e.g., 'ALEX-DIGITAL', 'FateEngine', 'Deploy'
  message text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- 4. Soul Engine (Journal & Spiritual tracking)
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  energy_level int CHECK (energy_level BETWEEN 1 AND 10),
  ai_analysis jsonb,
  created_at timestamptz DEFAULT now()
);

-- 5. AI Agent Messages (Memory for ALEX-DIGITAL)
CREATE TABLE IF NOT EXISTS agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'agent', 'system')),
  mode text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE architect_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated users to read/write for now
CREATE POLICY "Enable read access for authenticated users" ON system_modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON architect_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON system_logs FOR SELECT TO authenticated USING (true);

-- Users can read/write their own journal and messages
CREATE POLICY "Users can manage their own journal" ON journal_entries FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own AI messages" ON agent_messages FOR ALL TO authenticated USING (auth.uid() = user_id);
