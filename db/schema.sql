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
  created_at    timestamptz not null default now(),
  two_factor_secret  text,
  two_factor_enabled boolean not null default false
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

-- Работники / Сотрудники (workers)
create table if not exists kompas_workers (
  id            bigserial primary key,
  user_id       bigint references kompas_users(id) on delete set null,
  department    text,
  position      text,
  hourly_rate   numeric(10,2),
  hire_date     date,
  status        text default 'active',
  created_at    timestamptz not null default now()
);

-- Задачи (tasks)
create table if not exists kompas_tasks (
  id            bigserial primary key,
  title         text not null,
  description   text,
  status        text not null default 'pending'
                 check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_to   bigint references kompas_users(id) on delete set null,
  due_date      timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Рассылки (broadcasts)
create table if not exists kompas_broadcasts (
  id            bigserial primary key,
  title         text not null,
  message       text not null,
  status        text not null default 'draft'
                 check (status in ('draft', 'scheduled', 'sent', 'failed')),
  sent_at       timestamptz,
  created_by    bigint references kompas_users(id) on delete set null,
  created_at    timestamptz not null default now()
);

-- Рефералы (referrals)
create table if not exists kompas_referrals (
  id             bigserial primary key,
  referrer_id    bigint references kompas_users(id) on delete cascade,
  referred_email text not null,
  status         text not null default 'pending'
                  check (status in ('pending', 'completed', 'rejected')),
  reward_paid    boolean not null default false,
  created_at     timestamptz not null default now()
);

-- Подписки (subscriptions)
create table if not exists kompas_subscriptions (
  id                 bigserial primary key,
  user_id            bigint references kompas_users(id) on delete cascade,
  plan_id            text not null,
  status             text not null default 'active'
                      check (status in ('active', 'past_due', 'canceled', 'unpaid')),
  current_period_end timestamptz,
  created_at         timestamptz not null default now()
);

-- Встречи (appointments)
create table if not exists kompas_appointments (
  id          bigserial primary key,
  user_id     bigint references kompas_users(id) on delete cascade,
  worker_id   bigint references kompas_workers(id) on delete set null,
  start_time  timestamptz not null,
  end_time    timestamptz not null,
  status      text not null default 'scheduled'
               check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes       text,
  created_at  timestamptz not null default now()
);

-- Автоматизации (automations)
create table if not exists kompas_automations (
  id           bigserial primary key,
  name         text not null,
  trigger_type text not null,
  action_type  text not null,
  config       jsonb,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Снимки доходов (revenue_snapshots)
create table if not exists kompas_revenue_snapshots (
  id             bigserial primary key,
  period         text not null, -- e.g. '2026-05'
  total_revenue  numeric(12,2) not null default 0,
  mrr            numeric(12,2) not null default 0,
  created_at     timestamptz not null default now()
);

-- Сделки (deals)
create table if not exists kompas_deals (
  id                  bigserial primary key,
  title               text not null,
  value               numeric(12,2) not null default 0,
  pipeline_stage      text not null default 'new',
  expected_close_date date,
  assigned_to         bigint references kompas_users(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Активности (activities)
create table if not exists kompas_activities (
  id            bigserial primary key,
  deal_id       bigint references kompas_deals(id) on delete cascade,
  type          text not null, -- call, email, meeting
  description   text,
  due_date      timestamptz,
  status        text not null default 'pending',
  assigned_to   bigint references kompas_users(id) on delete set null,
  created_at    timestamptz not null default now()
);

-- Файлы (files)
create table if not exists kompas_files (
  id            bigserial primary key,
  name          text not null,
  url           text not null,
  size          integer,
  mime_type     text,
  uploaded_by   bigint references kompas_users(id) on delete set null,
  entity_type   text,
  entity_id     text,
  created_at    timestamptz not null default now()
);

-- Уведомления (notifications)
create table if not exists kompas_notifications (
  id          bigserial primary key,
  user_id     bigint references kompas_users(id) on delete cascade,
  type        text not null,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Отчеты (reports)
create table if not exists kompas_reports (
  id          bigserial primary key,
  name        text not null,
  type        text not null,
  parameters  jsonb,
  created_by  bigint references kompas_users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Indexes for new tables
create index if not exists idx_kompas_tasks_assigned on kompas_tasks(assigned_to);
create index if not exists idx_kompas_deals_assigned on kompas_deals(assigned_to);
create index if not exists idx_kompas_activities_deal on kompas_activities(deal_id);
create index if not exists idx_kompas_files_entity on kompas_files(entity_type, entity_id);
create index if not exists idx_kompas_notifications_user on kompas_notifications(user_id);
create index if not exists idx_kompas_appointments_user on kompas_appointments(user_id);
create index if not exists idx_kompas_subscriptions_user on kompas_subscriptions(user_id);

-- GDPR Consent Log table (for legal audit proof)
create table if not exists kompas_rodo_consent_logs (
    id bigserial primary key,
    user_id bigint references kompas_users(id) on delete set null,
    email text,
    phone text,
    action_type text not null, -- 'give_consent', 'withdraw_consent', 'request_deletion'
    ip_address text,
    user_agent text,
    created_at timestamptz not null default now()
);

-- Expenses tracking table
create table if not exists kompas_expenses (
    id bigserial primary key,
    category text not null, -- 'marketing', 'legal_partners', 'salaries', 'infrastructure'
    amount numeric(10, 2) not null,
    currency text default 'PLN',
    description text,
    paid_at date not null,
    recorded_by bigint references kompas_users(id),
    invoice_file_url text,
    created_at timestamptz not null default now()
);

-- Invoices reference table (auto-generated invoices)
create table if not exists kompas_invoices (
    id bigserial primary key,
    due_id bigint references kompas_dues(id),
    invoice_number text unique not null,
    pdf_url text,
    vat_rate numeric(4,2) default 23.00,
    net_amount numeric(10,2) not null,
    gross_amount numeric(10,2) not null,
    issued_at timestamptz not null default now()
);

-- Configurable Team Commission Rules
create table if not exists kompas_commission_rules (
    id bigserial primary key,
    user_id bigint references kompas_users(id), -- team member
    rule_type text not null, -- 'percent_total', 'flat_lead', 'percent_service'
    rule_value numeric(10, 2) not null, -- value of % or flat fee
    service_slug text, -- optional filter if rule_type is 'percent_service'
    is_active boolean default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Generated payouts ledger
create table if not exists kompas_commissions_earned (
    id bigserial primary key,
    rule_id bigint references kompas_commission_rules(id),
    due_id bigint references kompas_dues(id),
    lead_id bigint references kompas_leads(id),
    user_id bigint references kompas_users(id),
    calculated_amount numeric(10, 2) not null,
    status text default 'calculated', -- 'calculated', 'approved', 'paid'
    created_at timestamptz not null default now()
);

-- Indexes for new Phase 6 tables
create index if not exists idx_kompas_rodo_user on kompas_rodo_consent_logs(user_id);
create index if not exists idx_kompas_commissions_user on kompas_commissions_earned(user_id);
create index if not exists idx_kompas_invoices_due on kompas_invoices(due_id);

