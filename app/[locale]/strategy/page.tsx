'use client';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type StageStatus = 'live' | 'active' | 'planned';

interface Stage {
  id: string; label: string; sublabel: string; icon: string;
  color: string; width: number; count: string; desc: string;
  actions: string[]; sources: string[];
}
interface Source {
  id: string; icon: string; name: string; status: StageStatus;
  potential: string; potentialNum: number; color: string;
  desc: string; actions: string[]; kpi: string;
}
interface Product {
  name: string; price: number; unit: string; target: number;
  mrr: number; color: string; icon: string; desc: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FUNNEL: Stage[] = [
  {
    id: 'awareness', label: 'Awareness', sublabel: 'Усвідомлення проблеми',
    icon: '📡', color: '#3b82f6', width: 100, count: '~10 000/міс',
    desc: 'Перший дотик: соцмережі, пошук, сарафанне радіо, реклама. Людина ще не знає що шукати — тільки відчуває проблему.',
    actions: ['Публікації у Facebook/TikTok/Reels', 'SEO-статті: "karta pobytu", "deportacja pomoc"', 'Платна реклама Google Ads + FB Lead Ads', 'Партнерський трафік від роботодавців'],
    sources: ['Facebook 40k', 'TikTok/Reels', 'Google Органіка', 'Партнери'],
  },
  {
    id: 'lead', label: 'Лід', sublabel: 'Перший контакт',
    icon: '📥', color: '#6366f1', width: 83, count: '~500/міс',
    desc: 'Написав у WA/Viber, заповнив форму, підписався на Telegram-бота або клікнув Lead Ads.',
    actions: ['Telegram-бот вітає і починає кваліфікацію', 'CRM (Supabase) фіксує джерело + UTM', 'Автовідповідь у WA/Viber протягом 2 хв', 'FB Lead Ads форма → Webhook → CRM'],
    sources: ['WhatsApp', 'Viber', 'Telegram', 'Сайт-форма', 'FB Lead Ads'],
  },
  {
    id: 'qualify', label: 'Кваліфікація', sublabel: 'Визначення ситуації',
    icon: '🔍', color: '#8b5cf6', width: 67, count: '~280/міс',
    desc: 'Бот або менеджер з\'ясовує тип справи, терміновість, бюджет і сегментує ліда по тегах.',
    actions: ['5 кваліфікаційних питань у Telegram-боті', 'SituationQuiz на сайті (5 варіантів)', 'Скоринг ліда 1-10 у CRM', 'Сегментація: депортація / карта / документи / сім\'я'],
    sources: ['Telegram Bot', 'SituationQuiz', 'CRM теги'],
  },
  {
    id: 'consult', label: 'Консультація', sublabel: 'Безкоштовна оцінка',
    icon: '💬', color: '#a855f7', width: 52, count: '~140/міс',
    desc: '15-хв безкоштовна оцінка ситуації. Головна точка конверсії в платного клієнта.',
    actions: ['Запис через форму на сайті або Calendly', 'Нагадування через Telegram за 1 год', 'Юрист готує питання по тегах ліда', 'Збір документів перед зустріччю'],
    sources: ['Сайт-форма', 'WhatsApp', 'Telegram'],
  },
  {
    id: 'client', label: 'Клієнт', sublabel: 'Оплата послуги',
    icon: '💳', color: '#ec4899', width: 37, count: '~60/міс',
    desc: 'Вибрав і оплатив послугу. Конверсія консультація → клієнт: ~43%. Ключова метрика.',
    actions: ['Przelewy24 онлайн-платіж (P24)', 'Підписка через P24 recurring', 'Виставлення рахунку для B2B', 'Підписання договору (PDF)'],
    sources: ['Przelewy24', 'Банківський переказ', 'P24 підписка'],
  },
  {
    id: 'retain', label: 'Утримання', sublabel: 'Повторні звернення',
    icon: '🔄', color: '#f97316', width: 25, count: '~35/міс',
    desc: 'Клієнт повертається з новим питанням або подовжує підписку. LTV ціль > 500 zł.',
    actions: ['Щомісячний Newsletter з новинами законодавства', 'Telegram дедлайн-нагадування', 'Email-sequence: нагадування про поновлення', 'ReturnVisitor банер на сайті'],
    sources: ['Email Newsletter', 'Telegram', 'CRM automation'],
  },
  {
    id: 'advocate', label: 'Адвокат', sublabel: 'Рекомендує іншим',
    icon: '🗣️', color: '#22c55e', width: 15, count: '~15/міс',
    desc: 'Задоволений клієнт рекомендує Kompas своїм знайомим. CAC ≈ 0 для реферальних лідів.',
    actions: ['Реферальна програма: -20% за кожного рекомендованого', 'Запит Google Review після закриття справи', 'Кейс-публікація у Facebook (з дозволу)', 'Партнерський відгук для B2B'],
    sources: ['Реферальна програма', 'Google Reviews', 'Facebook спільноти'],
  },
  {
    id: 'union', label: 'Профспілка', sublabel: 'Член спільноти',
    icon: '🤝', color: '#14b8a6', width: 8, count: '~5/міс',
    desc: 'Амбасадор бренду, довгостроковий член спільноти, co-creator контенту і довіри.',
    actions: ['Пропозиція членства після 2+ закритих послуг', 'Ексклюзивні переваги для членів', 'Доступ до закритої Telegram-групи', 'Участь у онлайн-зустрічах та вебінарах'],
    sources: ['Особисте запрошення', 'Telegram-спільнота'],
  },
];

const SOURCES_DATA: Source[] = [
  {
    id: 'telegram', icon: '✈️', name: 'Telegram Bot', status: 'live',
    potential: '80 лідів/міс', potentialNum: 80, color: '#0088cc',
    desc: 'Вже живе. Кваліфікаційний бот — від першого питання до запису на консультацію через CRM.',
    actions: ['✅ Бот запущений, кваліфікує ліди', '✅ Зв\'язок з Supabase CRM', '📅 A/B тест вітального повідомлення', '📅 Підключити Calendly для самозапису', '📅 Broadcast 1000+ підписників щонеділі'],
    kpi: 'Конверсія бот → запис: ціль 15%',
  },
  {
    id: 'facebook', icon: '👥', name: 'Facebook 40k', status: 'active',
    potential: '120 лідів/міс', potentialNum: 120, color: '#1877f2',
    desc: '40 000 підписників — невикористаний актив. Lead Ads + Messenger-бот + реактивація аудиторії.',
    actions: ['📅 Lead Ads кампанія (бюджет 500 zł/міс)', '📅 ManyChat автовідповідь у Messenger', '📅 3 пости/тиждень: кейси, новини, FAQ', '📅 Facebook Live Q&A щомісяця', '📅 Lookalike audience з бази клієнтів'],
    kpi: 'CPL < 20 zł · ціль 120 лідів/міс',
  },
  {
    id: 'google', icon: '🔍', name: 'Google SEO/Ads', status: 'planned',
    potential: '200 лідів/міс', potentialNum: 200, color: '#ea4335',
    desc: 'Найвищий потенціал. Люди активно шукають "karta pobytu", "deportacja pomoc". SEO + Ads.',
    actions: ['📅 10 SEO-статей на гарячі ключові запити', '📅 Google Ads на 3 фрази (800 zł/міс)', '📅 Оптимізація Google My Business', '📅 Schema markup для FAQ-секції', '📅 Отримати 20+ Google Reviews'],
    kpi: 'Топ-3 за "pomoc deportacja Polska"',
  },
  {
    id: 'viber', icon: '💬', name: 'Viber/WhatsApp', status: 'active',
    potential: '60 лідів/міс', potentialNum: 60, color: '#7360f2',
    desc: 'Діаспора активно використовує Viber. Прямий канал для термінових звернень і розсилок.',
    actions: ['✅ Viber Business акаунт активний', '✅ WhatsApp Business профіль', '📅 Щотижнева розсилка 500 контактів', '📅 Автовідповідь на нічні та вихідні запити', '📅 Broadcast про акції та дедлайни'],
    kpi: 'Open rate розсилки > 60%',
  },
  {
    id: 'tiktok', icon: '🎵', name: 'TikTok/Reels', status: 'planned',
    potential: '50 лідів/міс', potentialNum: 50, color: '#ff0050',
    desc: 'Молодь 18-35 років. Короткі відео: "5 помилок при подачі карти побуту", реальні кейси.',
    actions: ['📅 4 відео/тиждень (телефон + CapCut)', '📅 Серія "Питання-Відповідь" в Reels', '📅 Колаборація з блогерами-мігрантами в Польщі', '📅 TikTok Lead Generation форма'],
    kpi: '10k переглядів/відео · 5 лідів/відео',
  },
  {
    id: 'website', icon: '🌐', name: 'kompasmigracji.com', status: 'live',
    potential: '80 лідів/міс', potentialNum: 80, color: '#2563eb',
    desc: 'Центральний хаб. Оновлений з 21 нововведенням для конверсії панічних клієнтів.',
    actions: ['✅ SituationQuiz + PanicStrip + MobileCTABar', '✅ Форма з рівнем терміновості', '✅ Countdown таймер до акції (06.06)', '📅 Chatbot навчити більше кейсів', '📅 Блог: 2 статті/тиждень'],
    kpi: 'Conversion rate > 4% · < 45 сек до CTA',
  },
  {
    id: 'b2b', icon: '🏢', name: 'Партнери/B2B', status: 'planned',
    potential: '30 лідів/міс', potentialNum: 30, color: '#475569',
    desc: 'Роботодавці що наймають іноземців, агентства зайнятості, гуртожитки, ринки.',
    actions: ['📅 Список 50 роботодавців у Варшаві', '📅 B2B пропозиція: абонемент від 200 zł/міс', '📅 Реферальна угода з агентствами праці', '📅 Участь у ярмарках праці та виставках'],
    kpi: '5 B2B партнерів · ~10 лідів/партнер',
  },
  {
    id: 'email', icon: '📧', name: 'Email Newsletter', status: 'planned',
    potential: '25 лідів/міс', potentialNum: 25, color: '#059669',
    desc: 'База попередніх клієнтів і лідів. Щотижневий дайджест: новини, дедлайни, поради.',
    actions: ['📅 Зібрати базу 1000+ контактів з CRM', '📅 Newsletter через Resend щонеділі', '📅 Welcome-sequence: 5 листів для нових', '📅 Automation: нагадування про дедлайни'],
    kpi: 'Open rate > 35% · CTR > 8%',
  },
  {
    id: 'referral', icon: '🎁', name: 'Реферальна програма', status: 'planned',
    potential: '40 лідів/міс', potentialNum: 40, color: '#f59e0b',
    desc: 'Задоволений клієнт = найкращий маркетинг. Знижка -20% за кожного рекомендованого клієнта.',
    actions: ['📅 Реферальне посилання в особистому кабінеті', '📅 WA/SMS після закриття кожної справи', '📅 Двостороння знижка (рекомендувач + новий клієнт)', '📅 Telegram-бот для трекінгу рефералів'],
    kpi: '20% нових лідів через рефералів',
  },
];

const PRODUCTS_DATA: Product[] = [
  { name: 'Безкоштовна оцінка', price: 0, unit: '', target: 150, mrr: 0, color: '#6b7280', icon: '🎯', desc: 'Лід-магніт, 15 хв, конвертує у платні послуги' },
  { name: 'Консультація 60 хв', price: 150, unit: 'zł', target: 60, mrr: 9000, color: '#3b82f6', icon: '💬', desc: 'Повна юридична консультація з планом дій' },
  { name: 'Підписка Базова', price: 49, unit: 'zł/міс', target: 200, mrr: 9800, color: '#8b5cf6', icon: '📋', desc: 'Необмежені запитання, відповідь до 24 год' },
  { name: 'Підписка Стандарт', price: 99, unit: 'zł/міс', target: 80, mrr: 7920, color: '#6366f1', icon: '🚀', desc: 'Консультація + пріоритетна підтримка' },
  { name: 'Підписка Преміум', price: 199, unit: 'zł/міс', target: 20, mrr: 3980, color: '#a855f7', icon: '👑', desc: 'Повний супровід + необмежені консультації' },
  { name: 'Юр. година (акція)', price: 450, unit: 'zł', target: 16, mrr: 7200, color: '#f97316', icon: '⚡', desc: 'Знижка 33% до 06.06 (звичайна ціна 600 zł)' },
  { name: 'B2B корпоративний', price: 500, unit: 'zł/міс', target: 4, mrr: 2000, color: '#334155', icon: '🏢', desc: 'Для роботодавців і агентств зайнятості' },
  { name: 'Ведення справи', price: 1200, unit: 'zł', target: 0, mrr: 0, color: '#dc2626', icon: '⚖️', desc: 'Складні міграційні справи — індивідуально' },
];

const MRR_TARGET = 37700;

const CRM_MODULES = [
  { name: 'Захоплення ліда', icon: '📥', items: ['Сайт-форма → Supabase leads', 'Telegram Bot → Supabase', 'FB Lead Ads → Webhook → CRM', 'WhatsApp → ручне внесення'] },
  { name: 'Кваліфікація', icon: '🔍', items: ['Тег: тип справи', 'Тег: терміновість (норм/терміново/крит)', 'Тег: бюджет та джерело', 'Скоринг ліда 1-10'] },
  { name: 'Комунікація', icon: '💬', items: ['WA/Viber → ручний чат', 'Telegram → автобот', 'Email → Resend sequences', 'Телефон → CRM нотатки'] },
  { name: 'Конверсія', icon: '💳', items: ['Przelewy24 webhook → CRM', 'Статус: лід → клієнт', 'Призначення юриста', 'Договір PDF → підпис'] },
  { name: 'Утримання', icon: '🔄', items: ['Email-sequences (Resend)', 'Telegram дедлайн-нагадування', 'NPS після закриття справи', 'Дедлайн-трекер у CRM'] },
  { name: 'Аналітика', icon: '📊', items: ['Supabase Dashboard', 'Конверсія по джерелах', 'MRR трекер по продуктах', 'Telegram звіт щодня менеджеру'] },
];

const INTEGRATIONS = [
  { name: 'Supabase', icon: '🐘', desc: 'PostgreSQL БД: ліди, клієнти, задачі, платежі' },
  { name: 'Resend', icon: '📧', desc: 'Email розсилки та транзакційні листи' },
  { name: 'Przelewy24', icon: '💳', desc: 'Онлайн платежі та підписки (P24)' },
  { name: 'Telegram API', icon: '✈️', desc: 'Бот, сповіщення менеджерам, broadcast' },
  { name: 'Claude AI', icon: '🤖', desc: 'AI-асистент: класифікація, відповіді, аналіз' },
  { name: 'Vercel', icon: '▲', desc: 'Хостинг, edge functions, auto-deploy' },
];

// ─── Funnel Section ───────────────────────────────────────────────────────────

function FunnelSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <p style={{ color: '#64748b', fontSize: 13, marginBottom: 28 }}>
        Натисніть на будь-який рівень щоб побачити детальні дії та джерела трафіку
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {FUNNEL.map(stage => (
          <div key={stage.id}>
            <div
              style={{ width: `${stage.width}%`, margin: '0 auto', cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === stage.id ? null : stage.id)}
            >
              <div style={{
                background: expanded === stage.id ? stage.color + '28' : stage.color + '14',
                border: `2px solid ${expanded === stage.id ? stage.color : stage.color + '55'}`,
                borderRadius: 10, padding: '11px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.18s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{stage.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{stage.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{stage.sublabel}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: stage.color, fontWeight: 700 }}>{stage.count}</span>
                  <span style={{ color: '#475569', fontSize: 12, display: 'inline-block', transition: 'transform 0.2s', transform: expanded === stage.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                </div>
              </div>
            </div>

            {expanded === stage.id && (
              <div style={{
                width: '100%', marginTop: 6,
                background: '#1e293b', borderRadius: 10, padding: 20,
                border: `1px solid ${stage.color}44`,
              }}>
                <p style={{ color: '#cbd5e1', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>{stage.desc}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: stage.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Дії</div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {stage.actions.map((a, i) => (
                        <li key={i} style={{ fontSize: 13, color: '#94a3b8', display: 'flex', gap: 8 }}>
                          <span style={{ color: stage.color, flexShrink: 0 }}>→</span>{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: stage.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Джерела трафіку</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {stage.sources.map((s, i) => (
                        <span key={i} style={{ padding: '4px 10px', borderRadius: 20, background: stage.color + '22', color: stage.color, fontSize: 12, fontWeight: 600 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sources Section ──────────────────────────────────────────────────────────

function SourcesSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const totalPotential = SOURCES_DATA.reduce((s, src) => s + src.potentialNum, 0);

  const STATUS_LABEL: Record<StageStatus, string> = { live: '🟢 Живе', active: '🟡 Активне', planned: '⚪ Плануємо' };
  const STATUS_COLOR: Record<StageStatus, string> = { live: '#22c55e', active: '#f59e0b', planned: '#475569' };

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { label: 'Загальний потенціал', value: `${totalPotential}`, sub: 'лідів/місяць', color: '#f97316' },
          { label: 'Активних каналів', value: '3 / 9', sub: 'запущені та активні', color: '#22c55e' },
          { label: 'До запуску', value: '5', sub: 'каналів у плані', color: '#6366f1' },
          { label: 'Бюджет Ads', value: '~1 300 zł', sub: 'Google + Facebook/міс', color: '#f59e0b' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#1e293b', borderRadius: 10, padding: '14px 20px', flex: 1, minWidth: 150 }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 14 }}>
        {SOURCES_DATA.map(src => (
          <div
            key={src.id}
            style={{
              background: '#1e293b', borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
              border: `2px solid ${expanded === src.id ? src.color : '#334155'}`,
              transition: 'border-color 0.18s',
            }}
            onClick={() => setExpanded(expanded === src.id ? null : src.id)}
          >
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 26 }}>{src.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{src.name}</div>
                    <div style={{ fontSize: 11, color: STATUS_COLOR[src.status] }}>{STATUS_LABEL[src.status]}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: src.color, lineHeight: 1 }}>{src.potentialNum}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>лідів/міс</div>
                </div>
              </div>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{src.desc}</p>
            </div>

            {expanded === src.id && (
              <div style={{ padding: '14px 18px 16px', borderTop: `1px solid ${src.color}33` }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: src.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Детальний план</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {src.actions.map((a, i) => (
                      <li key={i} style={{ fontSize: 13, color: '#cbd5e1' }}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ background: src.color + '22', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: src.color, fontWeight: 600 }}>
                  🎯 KPI: {src.kpi}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CRM Section ──────────────────────────────────────────────────────────────

function CRMSection() {
  const FLOW = ['Сайт / Telegram / WA', 'Supabase leads', 'Telegram сповіщення', 'Кваліфікація', 'CRM статус', 'Комунікація', 'Оплата P24', 'Клієнт ✓'];

  return (
    <div>
      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Потік даних ліда</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          {FLOW.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 13,
                background: '#0f172a',
                color: i === 0 ? '#3b82f6' : i === FLOW.length - 1 ? '#22c55e' : '#cbd5e1',
                fontWeight: i === 0 || i === FLOW.length - 1 ? 700 : 400,
                border: `1px solid ${i === 0 ? '#3b82f655' : i === FLOW.length - 1 ? '#22c55e55' : '#33415577'}`,
              }}>
                {step}
              </div>
              {i < FLOW.length - 1 && <span style={{ color: '#334155', fontSize: 16 }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginBottom: 20 }}>
        {CRM_MODULES.map((mod, i) => (
          <div key={i} style={{ background: '#1e293b', borderRadius: 12, padding: 20, border: '2px solid #334155' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>{mod.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{mod.name}</span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {mod.items.map((item, j) => (
                <li key={j} style={{ fontSize: 13, color: '#94a3b8', display: 'flex', gap: 8 }}>
                  <span style={{ color: '#f97316', flexShrink: 0 }}>·</span>{item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Технічні інтеграції</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {INTEGRATIONS.map((int, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 14, background: '#0f172a', borderRadius: 8 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{int.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9' }}>{int.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4, marginTop: 2 }}>{int.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MRR Section ──────────────────────────────────────────────────────────────

function MRRSection() {
  const totalMRR = PRODUCTS_DATA.reduce((s, p) => s + p.mrr, 0);
  const progress = Math.min(100, (totalMRR / MRR_TARGET) * 100);

  const MONTHS = ['Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
  const MILESTONES = [5000, 10000, 18000, 25000, 32000, 37700];

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: 12, padding: 28, marginBottom: 20, border: '2px solid #f97316' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Ціль MRR — 6 місяців (Липень–Грудень 2026)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: '#f97316', lineHeight: 1 }}>{totalMRR.toLocaleString()}</div>
          <div style={{ fontSize: 18, color: '#94a3b8', paddingBottom: 8 }}>/ {MRR_TARGET.toLocaleString()} zł/міс</div>
        </div>
        <div style={{ background: '#0f172a', borderRadius: 20, height: 12, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #f97316, #dc2626)', borderRadius: 20 }} />
        </div>
        <div style={{ fontSize: 13, color: '#64748b' }}>
          {progress.toFixed(1)}% від цілі · Потрібно ще +{(MRR_TARGET - totalMRR).toLocaleString()} zł MRR
        </div>
      </div>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
          Дорожня карта по місяцях
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 130 }}>
          {MONTHS.map((m, i) => {
            const val = MILESTONES[i];
            const barH = Math.round((val / MRR_TARGET) * 110);
            const isLast = i === MONTHS.length - 1;
            return (
              <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: 10, color: isLast ? '#f97316' : '#94a3b8', fontWeight: isLast ? 700 : 400 }}>
                  {(val / 1000).toFixed(0)}k
                </div>
                <div style={{
                  width: '100%', height: `${barH}px`,
                  background: isLast ? 'linear-gradient(180deg, #f97316, #dc2626)' : '#334155',
                  borderRadius: '5px 5px 2px 2px', minHeight: 6,
                }} />
                <div style={{ fontSize: 12, color: isLast ? '#f97316' : '#94a3b8', fontWeight: isLast ? 700 : 400 }}>{m}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {PRODUCTS_DATA.map((p, i) => {
          const contribution = p.mrr > 0 ? (p.mrr / MRR_TARGET) * 100 : 0;
          return (
            <div key={i} style={{
              background: '#1e293b', borderRadius: 12, padding: 20,
              border: `2px solid ${p.mrr > 0 ? p.color + '44' : '#33415555'}`,
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{p.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{p.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: p.mrr > 0 ? 10 : 0 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: p.color, lineHeight: 1 }}>
                    {p.price > 0 ? p.price : 'FREE'}
                    {p.unit && <span style={{ fontSize: 11, fontWeight: 400, color: '#64748b', marginLeft: 3 }}>{p.unit}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {p.target > 0 && <div style={{ fontSize: 12, color: '#64748b' }}>ціль: {p.target}×</div>}
                  <div style={{ fontSize: 16, fontWeight: 700, color: p.mrr > 0 ? '#22c55e' : '#475569' }}>
                    {p.mrr > 0 ? `${p.mrr.toLocaleString()} zł` : '—'}
                  </div>
                </div>
              </div>
              {p.mrr > 0 && (
                <>
                  <div style={{ background: '#0f172a', borderRadius: 20, height: 4, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ height: '100%', width: `${contribution}%`, background: p.color, borderRadius: 20 }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{contribution.toFixed(1)}% від загального MRR</div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'funnel' | 'sources' | 'crm' | 'mrr';

const TABS: { id: Tab; icon: string; label: string; sub: string }[] = [
  { id: 'funnel', icon: '⚡', label: 'Воронка', sub: 'Awareness → Профспілка' },
  { id: 'sources', icon: '📡', label: 'Джерела', sub: '9 каналів лідів' },
  { id: 'crm', icon: '🧠', label: 'CRM Ядро', sub: 'Модулі та інтеграції' },
  { id: 'mrr', icon: '💰', label: 'Продукти MRR', sub: 'Ціль 37 700 zł/міс' },
];

export default function StrategyPage() {
  const [tab, setTab] = useState<Tab>('funnel');

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#f97316', textTransform: 'uppercase', marginBottom: 4 }}>
              🧭 Kompas Migracji
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 2px' }}>Стратегічна Панель</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: 13 }}>Воронка · Джерела · CRM · Продукти та MRR ціль 37 700 zł/міс</p>
          </div>
          <a
            href="/"
            style={{ padding: '8px 16px', borderRadius: 8, background: '#334155', color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}
          >
            ← Сайт
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', overflowX: 'auto' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: `3px solid ${tab === t.id ? '#f97316' : 'transparent'}`,
                color: tab === t.id ? '#f97316' : '#64748b',
                fontWeight: tab === t.id ? 700 : 400,
                fontSize: 14, whiteSpace: 'nowrap', transition: 'all 0.15s', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1,
              }}
            >
              <span>{t.icon} {t.label}</span>
              <span style={{ fontSize: 10, color: tab === t.id ? '#f97316' : '#475569', fontWeight: 400 }}>{t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 60px' }}>
        {tab === 'funnel' && <FunnelSection />}
        {tab === 'sources' && <SourcesSection />}
        {tab === 'crm' && <CRMSection />}
        {tab === 'mrr' && <MRRSection />}
      </div>
    </div>
  );
}
