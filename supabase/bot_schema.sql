-- Kompas Migracji — Telegram Bot schema
-- Run in Supabase → SQL Editor

create table if not exists bot_sessions (
  chat_id   bigint primary key,
  step      integer     not null default 0,
  data      jsonb       not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id          uuid        primary key default gen_random_uuid(),
  chat_id     text,
  first_name  text,
  username    text,
  country     text,
  service     text,
  urgency     text,
  situation   text,
  contact     text,
  status      text        not null default 'new',  -- new | contacted | closed | dropped
  created_at  timestamptz not null default now()
);

-- RLS: дозволяємо insert з anon key (для serverless функції)
alter table bot_sessions enable row level security;
alter table leads         enable row level security;

create policy "service insert sessions" on bot_sessions for all using (true) with check (true);
create policy "service insert leads"    on leads         for all using (true) with check (true);
