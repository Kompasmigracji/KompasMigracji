-- Moves the hardcoded client testimonials out of messages/*.json (static, unverifiable,
-- no way to attach a real date or consent trail) into a real table. Reviews are real clients
-- who consented to publication (per site-audit follow-up, 2026-08-01); this table adds a
-- verified flag + date + source link so that claim stays true going forward instead of
-- being another hardcoded assertion.

create table if not exists public.kompas_reviews (
  id uuid primary key default gen_random_uuid(),
  locale text not null check (locale in ('uk','pl','en','ru','rom')),
  author_name text not null,
  review_text text not null,
  rating smallint not null default 5 check (rating between 1 and 5),
  review_date text,
  verified boolean not null default true,
  source_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_kompas_reviews_locale_active
  on public.kompas_reviews (locale, is_active, display_order);

alter table public.kompas_reviews enable row level security;

-- Public marketing content: anyone can read active rows. No anon/authenticated write access —
-- reviews are managed via direct DB access (service_role) until an admin UI exists.
create policy reviews_public_read on public.kompas_reviews
  for select
  using (is_active = true);

grant select on public.kompas_reviews to anon, authenticated;
