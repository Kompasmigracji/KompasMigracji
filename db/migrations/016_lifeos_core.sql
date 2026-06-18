-- 016_lifeos_core.sql
-- Migration: LifeOS Core Architecture
-- Author: ALEX-DIGITAL

BEGIN;

-- 1. Architect Settings
CREATE TABLE IF NOT EXISTS architect_settings (
    id SERIAL PRIMARY KEY,
    key_name VARCHAR(255) UNIQUE NOT NULL,
    value_json JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial default settings
INSERT INTO architect_settings (key_name, value_json) VALUES 
('system_mode', '"dev"'),
('theme', '"cyber-neon"'),
('global_focus', '"architecture"')
ON CONFLICT (key_name) DO NOTHING;

-- 2. System Modules (FateEngine, SoulEngine, etc.)
CREATE TABLE IF NOT EXISTS system_modules (
    id SERIAL PRIMARY KEY,
    module_name VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial modules
INSERT INTO system_modules (module_name, is_active, config) VALUES 
('FateEngine', true, '{"description": "Probability and timeline engine"}'),
('SoulEngine', true, '{"description": "Values and spiritual state processor"}'),
('OmegaLayer', true, '{"description": "Meta-system observer"}'),
('HealthSync', false, '{"description": "Biometric data synchronization"}')
ON CONFLICT (module_name) DO NOTHING;

-- 3. System Logs
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(50) DEFAULT 'info',
    source VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    meta JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Agent Messages (Short-term memory)
CREATE TABLE IF NOT EXISTS agent_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(50) CHECK (role IN ('user', 'agent', 'system')),
    mode VARCHAR(50) DEFAULT 'strategist',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI Context (Long-term memory & profiles)
CREATE TABLE IF NOT EXISTS ai_context (
    id SERIAL PRIMARY KEY,
    context_type VARCHAR(100) NOT NULL, -- e.g., 'spiritual_profile', 'life_goals'
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_architect_settings_updated_at') THEN
        CREATE TRIGGER trg_architect_settings_updated_at BEFORE UPDATE ON architect_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_system_modules_updated_at') THEN
        CREATE TRIGGER trg_system_modules_updated_at BEFORE UPDATE ON system_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_ai_context_updated_at') THEN
        CREATE TRIGGER trg_ai_context_updated_at BEFORE UPDATE ON ai_context FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

COMMIT;
