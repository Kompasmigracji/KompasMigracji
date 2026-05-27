-- ============================================================
-- KompasCRM — начальные данные
-- Запуск:  psql "$DATABASE_URL" -f db/seed.sql
-- Первого администратора создаёт скрипт: node scripts/create-admin.mjs
-- ============================================================

-- Блоки контента под юридический чек-лист сайта kompasmigracji.com.
insert into kompas_content (slug, title, body, published) values
  ('offer',     'Oferta',                 '', false),
  ('pricing',   'Cennik',                 '', false),
  ('regulamin', 'Regulamin sklepu',       '', false),
  ('privacy',   'Polityka prywatności',   '', false)
on conflict (slug) do nothing;
