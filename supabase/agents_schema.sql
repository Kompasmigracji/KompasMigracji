-- Supabase schema for Primus orchestrator and Monitor Squad
-- Table to store generic agents (including Primus functional agents)
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'idle',
  last_heartbeat timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Table for tasks dispatched by Primus (or God)
CREATE TABLE IF NOT EXISTS agent_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  type text NOT NULL,
  payload jsonb,
  status text NOT NULL DEFAULT 'queued',
  result jsonb,
  started_at timestamptz,
  finished_at timestamptz
);

-- Table for God policies (global orchestrator settings)
CREATE TABLE IF NOT EXISTS god_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name text NOT NULL UNIQUE,
  policy_json jsonb NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
