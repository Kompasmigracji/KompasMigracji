# Kompas Migracji — Next.js 14 + TypeScript + Tailwind CSS

Повноцінна платформа юридичних послуг для мігрантів у Польщі та ЄС.  
Компанія: **DOMUS V Sp. z o.o.** (Варшава).

---

## Стек технологій

| Шар | Технологія |
|-----|-----------|
| Framework | Next.js 14 (App Router) |
| Мова | TypeScript 5.7 |
| UI | React 18 + Tailwind CSS 4 |
| i18n | next-intl 3 (uk / pl / en / ru) |
| AI-чатбот | Claude 3.5 Haiku (Anthropic SDK) |
| База даних | Supabase (PostgreSQL) |
| Оплата | Przelewy24 (SHA-384) |
| Аналітика | Vercel Analytics + Speed Insights |
| Деплой | Vercel (автоматичний через git push) |
| Пакетний менеджер | pnpm |

---

## Структура проєкту:

```
KompasMigracji/
├── app/
│   ├── layout.tsx                  # Кореневий layout
│   ├── page.tsx                    # Редирект → /uk
│   ├── globals.css                 # Глобальні стилі + dark theme CSS vars
│   ├── [locale]/                   # Інтерналізовані сторінки (uk/pl/en/ru)
│   │   ├── layout.tsx              # Locale layout з next-intl провайдером
│   │   ├── page.tsx                # Головна сторінка (лендінг)
│   │   ├── karta/page.tsx          # Сторінка "Кarта Побиту" (прискорення)
│   │   ├── pricing/page.tsx        # Повний прайс всіх послуг
│   │   ├── privacy/page.tsx        # Політика конфіденційності (RODO/GDPR)
│   │   ├── regulamin/page.tsx      # Регламент (публічна оферта)
│   │   ├── payment-success/        # Сторінка після успішної оплати
│   │   └── not-found.tsx           # 404
│   ├── admin/page.tsx              # Адмін-панель (ліди, фільтри, статуси)
│   └── api/
│       ├── chat/route.ts           # Claude AI чатбот + захоплення лідів
│       ├── payment/route.ts        # Ініціювання платежу Przelewy24
│       ├── payment-notify/route.ts # Webhook підтвердження оплати
│       └── admin/
│           ├── leads/route.ts      # Отримання всіх лідів (Supabase)
│           └── status/route.ts     # Оновлення статусу ліда
│
├── components/
│   ├── Header.tsx          # Навігація, перемикач мови, dark mode, телефон
│   ├── Hero.tsx            # Hero-секція, CTA, WhatsApp/Viber кнопки
│   ├── Team.tsx            # Команда
│   ├── Reviews.tsx         # Відгуки клієнтів
│   ├── ServicesGrid.tsx    # Каталог послуг (сітка)
│   ├── HowItWorks.tsx      # Як ми працюємо (4 кроки)
│   ├── Pricing.tsx         # Цінові картки (3 головні послуги)
│   ├── FAQ.tsx             # Колапсний FAQ
│   ├── Blog.tsx            # Блог / новини
│   ├── ContactForm.tsx     # Форма зворотного зв'язку + WhatsApp
│   ├── Footer.tsx          # Футер: реквізити, соцмережі, RODO
│   ├── ChatBot.tsx         # Плаваючий AI-чат (Claude), захоплення ліда
│   ├── KompasAI.tsx        # Банер з фактами про міграцію (auto-rotate)
│   ├── PromoBanner.tsx     # Промо-оголошення
│   ├── CookieBanner.tsx    # GDPR cookie consent (localStorage)
│   └── StarField.tsx       # CSS-анімація зоряного фону
│
├── lib/
│   ├── supabase.ts         # Supabase клієнти: публічний + service role
│   ├── navigation.ts       # next-intl навігаційні хелпери
│   ├── ThemeContext.tsx    # Context dark/light теми (localStorage)
│   └── useCookieConsent.ts # Хук згоди на cookies
│
├── messages/               # JSON-переклади
│   ├── uk.json             # Українська
│   ├── pl.json             # Польська
│   ├── en.json             # Англійська
│   └── ru.json             # Російська
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico / favicon.svg
│   ├── robots.txt / sitemap.xml
│   └── karta-pobytu-landing.pdf
│
├── supabase/
│   └── bot_schema.sql      # SQL-схема таблиці leads
│
├── i18n.ts                 # Конфіг next-intl (локалі + шляхи)
├── middleware.ts           # Middleware для locale routing
├── next.config.mjs         # Next.js конфіг + next-intl plugin
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Функціональність

### Мультимовність (i18n)

4 мови: Ukrainian (`uk`), Polish (`pl`), English (`en`), Russian (`ru`).  
Маршрутизація: `/uk/`, `/pl/`, `/en/`, `/ru/`.  
Усі тексти — у `messages/*.json`. Компоненти використовують `useTranslations()` з `next-intl`.

### AI-чатбот (Claude 3.5 Haiku)

- **Endpoint:** `POST /api/chat`
- Відповідає на питання про міграцію, легалізацію, документи
- **Захоплення ліда:** якщо бот виявляє ім'я та телефон клієнта, автоматично зберігає у Supabase у форматі `[[LEAD:{...}]]`
- Rate limit: 10 запитів / хвилину на клієнта
- Мови відповіді: ua / pl / ru / en (автоматично)

### Система лідів (Supabase)

Таблиця `leads` отримує записи з кількох джерел:

| Джерело | Метод |
|---------|-------|
| AI-чатбот | Автоматична детекція тексту |
| Форма на сайті | `ContactForm.tsx` |
| Сторінка `/karta` | CTA-форма |
| Сторінка `/pricing` | CTA-форма |
| Telegram-бот | поле `chat_id` / `username` |

**Адмін-панель** `/admin`:
- Пароль через `NEXT_PUBLIC_ADMIN_PASSWORD` (сесія у `sessionStorage`)
- Фільтрація: `new / contacted / closed / dropped`
- Пошук по імені, телефону, країні, послузі
- Оперативна зміна статусу ліда

### Оплата Przelewy24

- **Ініціювання:** `POST /api/payment` → отримує посилання на оплату
- **Підтвердження:** `POST /api/payment-notify` (webhook від P24)
- Підпис: SHA-384 HMAC
- Режим: sandbox (`P24_SANDBOX=true`) або production

### Сторінки та послуги

| Сторінка | Маршрут | Опис |
|----------|---------|------|
| Головна | `[locale]/` | Hero, Team, Reviews, ServicesGrid, HowItWorks, Pricing, FAQ, Blog, Contact |
| Карта Побиту | `[locale]/karta` | Послуга прискорення оформлення, деталізований прайс, відгуки |
| Прайс | `[locale]/pricing` | Усі категорії послуг і ціни |
| Privacy | `[locale]/privacy` | Політика конфіденційності (GDPR/RODO) |
| Регламент | `[locale]/regulamin` | Публічна оферта |
| Оплата OK | `[locale]/payment-success` | Підтвердження після оплати |
| Адмін | `/admin` | Панель керування лідами |

**Діапазон цін:** 18 zł (переклад документа) → 2 900 zł (польське громадянство через Президента).

### Теми (Dark / Light)

- Перемикач у Header
- Збереження у `localStorage` за ключем `theme`
- Атрибут `data-theme` на `<html>`, CSS custom properties
- Фон dark: `#070c1a`

---

## Змінні середовища

Створіть `.env.local` у корені проєкту:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Anthropic (Claude API)
ANTHROPIC_API_KEY=

# Przelewy24
P24_MERCHANT_ID=
P24_CRC=
P24_API_KEY=
P24_SANDBOX=true

# Загальне
SITE_URL=https://kompasmigracji.com
NEXT_PUBLIC_ADMIN_PASSWORD=kompas2026
```

---

## Схема бази даних

```sql
-- supabase/bot_schema.sql
CREATE TABLE leads (
  id          SERIAL PRIMARY KEY,
  name        TEXT,
  phone       TEXT,
  email       TEXT,
  service     TEXT,
  message     TEXT,
  situation   TEXT,
  contact     TEXT,
  country     TEXT,
  urgency     TEXT,
  source      TEXT,           -- chatbot | form | pricing-page | karta | telegram
  status      TEXT DEFAULT 'new', -- new | contacted | closed | dropped
  chat_id     BIGINT,         -- Telegram chat id
  first_name  TEXT,
  username    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## Локальний запуск

```bash
# Встановити залежності
pnpm install

# Запустити dev-сервер
pnpm dev
```

Відкрити [http://localhost:3000](http://localhost:3000) — автоматично редиректить на `/uk`.

```bash
# TypeScript перевірка
pnpm typecheck

# Лінтер
pnpm lint

# Production build
pnpm build
pnpm start
```

---

## Деплой на Vercel

1. Push до `main` гілки → Vercel автоматично збирає та деплоїть.
2. Додайте всі env-змінні у **Vercel → Settings → Environment Variables**.
3. Webhooks Przelewy24 вказувати на `https://kompasmigracji.com/api/payment-notify`.

---

## Архітектура API

```
POST /api/chat
  body: { messages: Message[], locale: string }
  → stream text/event-stream (Claude 3.5 Haiku)
  → автозбереження ліда у Supabase при детекції [[LEAD:{...}]]

POST /api/payment
  body: { amount, email, description, returnUrl, locale }
  → { paymentUrl: string }

POST /api/payment-notify
  body: Przelewy24 notification (IPN)
  → верифікація підпису → 200 OK

GET  /api/admin/leads?status=new&search=...
  → { leads: Lead[] }

PATCH /api/admin/status
  body: { id, status }
  → { success: true }
```

---

## Безпека

- Адмін-панель: `sessionStorage` токен + env-пароль
- `/api/chat`: rate limit 10 req/хв по IP
- Przelewy24 webhook: SHA-384 верифікація підпису
- Supabase service key використовується тільки на server-side (API routes)
- RODO/GDPR: мінімальний збір даних, банер згоди на cookies

---

## Компоненти: короткий опис

| Компонент | Призначення |
|-----------|-------------|
| `Header` | Фіксована навігація, dropdown послуг, мовний перемикач, dark mode, телефон |
| `Hero` | Анімований заголовок, підзаголовок, CTA-кнопки (консультація / WhatsApp / Viber) |
| `ChatBot` | Плаваючий AI-чат, стрімінг відповідей, автозахоплення ліда |
| `KompasAI` | Банер з фактами для мігрантів (8 фактів, автозміна) |
| `Pricing` | 3 цінові картки головних послуг |
| `FAQ` | Колапс-акордеон з питаннями |
| `ContactForm` | Форма + відкриття WhatsApp з pre-filled текстом |
| `CookieBanner` | GDPR-банер з `localStorage` персистентністю |
| `StarField` | CSS-анімація зірок на фоні |
| `PromoBanner` | Промо-повідомлення / акції |
