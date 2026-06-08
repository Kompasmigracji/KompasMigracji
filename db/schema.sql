-- ============================================================
-- KompasCRM — схема базы данных
-- Все таблицы с префиксом kompas_ — изоляция от существующих таблиц.
-- Запуск:  psql "$DATABASE_URL" -f db/schema.sql
-- ============================================================

-- Пользователи CMS: администраторы, модераторы и участники профсоюза.
create table if not exists kompas_users (
  id            bigserial primary key,
  email         text unique not null,
  password_hash text not null,
  full_name     text not null,
  role          text not null default 'member'
                 check (role in ('admin','moderator','member')),
  status        text not null default 'active'
                 check (status in ('active','suspended','pending')),
  phone         text,
  last_login    timestamptz,
  created_at    timestamptz not null default now()
);

-- Расширенный профиль участника профсоюза (1:1 с kompas_users где role='member').
create table if not exists kompas_member_profiles (
  user_id     bigint primary key references kompas_users(id) on delete cascade,
  member_no   text unique,
  category    text default 'standard',  -- standard / premium / honorary
  city        text,
  country     text default 'Polska',
  join_date   date default current_date,
  dues_status text default 'unpaid'
               check (dues_status in ('paid','unpaid','exempt')),
  notes       text
);

-- Членские взносы.
create table if not exists kompas_dues (
  id         bigserial primary key,
  user_id    bigint not null references kompas_users(id) on delete cascade,
  period     text not null,            -- '2026-05'
  amount     numeric(10,2) not null default 0,
  paid       boolean not null default false,
  paid_at    timestamptz,
  created_at timestamptz not null default now()
);

-- Юридические дела / обращения участников.
create table if not exists kompas_cases (
  id          bigserial primary key,
  user_id     bigint references kompas_users(id) on delete set null,
  title       text not null,
  description text,
  status      text not null default 'open'
               check (status in ('open','in_progress','resolved','closed')),
  assigned_to bigint references kompas_users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Лиды воронки. Можно направить сюда /api/leads (бот/сайт/FB/IG)
-- или в коде заменить запросы на свою существующую таблицу лидов.
create table if not exists kompas_leads (
  id          bigserial primary key,
  source      text not null default 'site'
               check (source in ('bot','site','facebook','instagram','other')),
  name        text,
  contact     text,
  message     text,
  status      text not null default 'new'
               check (status in ('new','in_progress','converted','closed')),
  assigned_to bigint references kompas_users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Блоки контента сайта — оферта, цены, регламент, политика приватности.
create table if not exists kompas_content (
  id         bigserial primary key,
  slug       text unique not null,     -- offer / pricing / regulamin / privacy
  title      text not null,
  body       text default '',
  published  boolean not null default false,
  updated_by bigint references kompas_users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Журнал действий.
create table if not exists kompas_audit_log (
  id         bigserial primary key,
  user_id    bigint references kompas_users(id) on delete set null,
  action     text not null,
  entity     text,
  entity_id  text,
  meta       jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_kompas_leads_status   on kompas_leads(status);
create index if not exists idx_kompas_leads_created  on kompas_leads(created_at);
create index if not exists idx_kompas_users_role     on kompas_users(role);
create index if not exists idx_kompas_cases_user     on kompas_cases(user_id);
create index if not exists idx_kompas_dues_user      on kompas_dues(user_id);

-- Электронная почта
create table if not exists kompas_emails (
  id uuid primary key default gen_random_uuid(),
  message_id varchar(500),
  from_address varchar(255) not null,
  to_addresses text[] not null,
  cc_addresses text[],
  subject varchar(1000),
  body_html text,
  body_text text,
  folder varchar(50) default 'inbox',
  status varchar(20) default 'received',
  is_read boolean default false,
  entity_type varchar(50),
  entity_id varchar(255),
  sent_by bigint references kompas_users(id),
  sent_at timestamptz,
  received_at timestamptz,
  created_at timestamptz default now()
);

-- Почтовые аккаунты
create table if not exists kompas_email_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id bigint references kompas_users(id),
  name varchar(255) not null,
  email_address varchar(255) not null,
  imap_host varchar(255), imap_port integer, imap_ssl boolean default true,
  smtp_host varchar(255), smtp_port integer, smtp_ssl boolean default true,
  username varchar(255),
  password_encrypted text,
  is_active boolean default true,
  last_sync timestamptz,
  created_at timestamptz default now()
);
