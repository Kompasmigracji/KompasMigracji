-- Migration 004: Universal tasks system with documents, logs, AI chat
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS tasks (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT DEFAULT 'general',  -- general | legal | admin | research
  stage        TEXT DEFAULT 'todo',     -- todo | in_progress | review | done
  status       TEXT DEFAULT 'active',   -- active | closed
  priority     TEXT DEFAULT 'normal',   -- low | normal | high | urgent
  assigned_to  BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  deadline     DATE,
  created_by   BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_documents (
  id           BIGSERIAL PRIMARY KEY,
  task_id      BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  url          TEXT NOT NULL,
  notes        TEXT,
  uploaded_by  BIGINT REFERENCES kompas_users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_logs (
  id           BIGSERIAL PRIMARY KEY,
  task_id      BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  event        TEXT NOT NULL,
  actor_name   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_ai_chat (
  id           BIGSERIAL PRIMARY KEY,
  task_id      BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  role         TEXT NOT NULL,  -- user | assistant
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_stage       ON tasks(stage);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status      ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_task_docs_task    ON task_documents(task_id);
CREATE INDEX IF NOT EXISTS idx_task_logs_task    ON task_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_task_ai_task      ON task_ai_chat(task_id);
