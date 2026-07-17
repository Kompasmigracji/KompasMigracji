-- Мілена / Міленіум — бот продажу платних юридичних послуг.
-- Схема точно за технічним пакетом власника бізнесу (8 таблиць).

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  direction text NOT NULL,
  subservice text,
  status text NOT NULL DEFAULT 'needs_legal_review'
    CHECK (status IN ('actual','needs_update','historical','do_not_use','needs_legal_review')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  stage text NOT NULL,
  intent_label text NOT NULL,
  trigger_phrases text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge_cards (
  id text PRIMARY KEY,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  stage text NOT NULL,
  intent text NOT NULL,
  required_context text[],
  answer_short text NOT NULL,
  answer_full text NOT NULL,
  disclaimer text,
  next_question text,
  next_action text,
  handoff_condition text[],
  status text NOT NULL DEFAULT 'needs_legal_review'
    CHECK (status IN ('actual','needs_update','historical','do_not_use','needs_legal_review')),
  last_reviewed_at timestamptz,
  source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dialog_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  current_stage text NOT NULL,
  required_fields text[] NOT NULL,
  optional_fields text[],
  next_stage_on_complete text,
  next_stage_on_incomplete text,
  max_clarifying_questions int DEFAULT 2,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS handoff_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id),
  condition_label text NOT NULL,
  handoff_to text NOT NULL,
  priority text DEFAULT 'normal' CHECK (priority IN ('normal','urgent')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name_latin text,
  birth_date date,
  parents_names text,
  pesel text,
  address text,
  phone_pl text,
  email text,
  preferred_contact text,
  case_summary text,
  responsible_person text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  channel text NOT NULL,
  service_id uuid REFERENCES services(id),
  current_stage text,
  collected_context jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'active' CHECK (status IN ('active','handed_off','closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('client','bot','human_agent')),
  content text NOT NULL,
  knowledge_card_id text REFERENCES knowledge_cards(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_cards_service ON knowledge_cards(service_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_cards_status ON knowledge_cards(status);
CREATE INDEX IF NOT EXISTS idx_conversations_client ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_intents_service ON intents(service_id);
CREATE INDEX IF NOT EXISTS idx_dialog_flows_service_stage ON dialog_flows(service_id, current_stage);
CREATE INDEX IF NOT EXISTS idx_handoff_rules_service ON handoff_rules(service_id);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service all services" ON services;
CREATE POLICY "service all services" ON services FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE intents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service all intents" ON intents;
CREATE POLICY "service all intents" ON intents FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE knowledge_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service all knowledge_cards" ON knowledge_cards;
CREATE POLICY "service all knowledge_cards" ON knowledge_cards FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE dialog_flows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service all dialog_flows" ON dialog_flows;
CREATE POLICY "service all dialog_flows" ON dialog_flows FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE handoff_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service all handoff_rules" ON handoff_rules;
CREATE POLICY "service all handoff_rules" ON handoff_rules FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service all clients" ON clients;
CREATE POLICY "service all clients" ON clients FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service all conversations" ON conversations;
CREATE POLICY "service all conversations" ON conversations FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service all messages" ON messages;
CREATE POLICY "service all messages" ON messages FOR ALL USING (true) WITH CHECK (true);
