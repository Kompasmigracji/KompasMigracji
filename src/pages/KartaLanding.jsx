import React, { useState } from 'react';

const ORANGE = '#f97316';
const MINT   = '#86efac';
const DARK   = '#1c1c1c';
const GRAY   = '#6b7280';
const LIGHT  = '#374151';
const LGRAY  = '#e5e7eb';

const small = { fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', margin: 0 };

/* ─── TRANSLATIONS ──────────────────────────────────────── */
const LANGS = {
  ua: {
    flag: '🇺🇦', label: 'Українська',
    ticker: ['ПРИСКОРЕННЯ КАРТИ ПОБУТУ ', '✦', ' 450 ЗЛ — 1 ЮРИДИЧНА ГОДИНА'],
    order: 'Замовити →',
    tag: 'ПОСЛУГА ПРИСКОРЕННЯ',
    h1: ['Втомився', 'чекати?'],
    pains: [
      { pre: 'Подав документи — і тиша. Уженд не відповідає.', bold: ' Тижні стали місяцями.' },
      { pre: 'Потрапив у воєводство де розглядають роками.', bold: ' Застряг. Не можеш рухатися.' },
      { pre: "Прив'язаний до одного роботодавця.", bold: ' Не можеш змінити роботу. Не можеш рости.' },
      { pre: 'Без карти —', bold: ' немає кредиту, немає іпотеки.', post: ' Ти "тимчасовий" у власному житті.' },
      { pre: "Хочеш поїхати до сім'ї —", bold: ' боїшся залишити справу без нагляду.' },
      { pre: 'Живеш у підвішеному стані', bold: ' вже рік. Або два.', post: ' Кінця не видно.' },
    ],
    notNormal: 'Це не нормально.',
    notNormalSub: "І ти не зобов'язаний з цим миритися.",
    bq: ['Система має інструменти. Закон має строки. Уженд ', "зобов'язаний", ' відповідати. Вони просто розраховують на те, що ти цього не знаєш.'],
    weKnow: 'Ми знаємо.',
    howTag: 'ЯК ЦЕ ПРАЦЮЄ',
    steps: [
      { n: '01', title: "Оплата — і ми зв'язуємося", pre: 'Ти оплачуєш юридичну годину. Ми збираємо деталі твоєї справи.', bold: ' Якщо не зможемо взятися — повертаємо гроші за 1 день.' },
      { n: '02', title: 'Унікальний пакет документів', pre: 'Ти отримуєш готовий пакет під твою справу.', bold: ' Роздрукував. Підписав. Надіслав.', post: ' Більше нічого від тебе не потрібно.' },
      { n: '03', title: 'Справа виходить на комітет рішень', pre: 'Протягом двох місяців — результат. Якщо уженд мовчить —', bold: ' скарга на бездіяльність.', post: ' Якщо знову мовчить — суд. Три етапи. Ми знаємо кожен.' },
    ],
    pricingTag: 'ТАРИФИ',
    p1tag: 'КАРТА ПОБУТУ', p1name: 'Пакет Прискорення', p1price: '450 ЗЛ', p1sub: '= 1 юридична година',
    p1f: ['Консультація по твоїй справі', 'Скарга на бездіяльність уженду', 'Унікальний пакет документів', 'Підготовка до суду — якщо потрібно'],
    p2tag: 'КАРТА РЕЗИДЕНТА ЄС', p2name: 'Пакет Резидент', p2price: '900 ЗЛ', p2sub: '= 2 юридичні години',
    p2f: ['Все те саме + складніша стратегія', 'Багатоетапний план виводу на рішення', 'Повний статус на 3+ роки', 'Підготовка до суду: 4 год. окремо'],
    gTitle: 'Гарантія — 1 день',
    gText: ["Якщо після оплати з'ясується, що ми не можемо взяти твою справу — ", 'повертаємо кошти за один день.', ' Жодної корупції. Жодних схем. Виключно по закону — знаємо де тиснути, знаємо що писати.'],
    fTitle: 'Олександр Василишин — чому ця стратегія працює і чому їй слід довіряти',
    fSub: 'Засновник Kompas Migracji · 8 років у міграційному праві · Особисто відповідає на дзвінки',
    ctaH: ['Твоя справа.', 'Наш хід.'],
    ctaSub: 'Напиши або зателефонуй — розберемося з твоєю ситуацією',
    ctaBtn: 'Замовити зараз',
    callTag: 'ЗАТЕЛЕФОНУВАТИ', callDesc: 'Особиста консультація від Олександра Василишина. Пн–Нд: 10:00 — 22:00',
    quote: 'Закладаю власну репутацію. Якщо щось не так — дзвоніть. Беру трубку завжди. — Олександр',
    ft1tag: 'ПРО ПРОЕКТ', ft1desc: "Захист українців від дискримінації. Єдине вікно з розв'язання усіх бюрократичних задач — нотаріус, адвокат, медіатор, юридичний асистент.",
    ft2tag: 'ОСОБИСТІ КОНСУЛЬТАЦІЇ', ft2name: 'Олександр Василишин', ft2desc: 'Побудова дорожньої карти в еміграції.\nПн–Нд: 10:00 — 22:00',
    ft3tag: 'ЕКСТРЕНА ЮРИДИЧНА ДОПОМОГА', ft3sub: 'Цілодобово · 24/7',
    copy: 'Жодної корупції · Виключно по закону · Для українців в ЄС',
  },

  pl: {
    flag: '🇵🇱', label: 'Polski',
    ticker: ['PRZYSPIESZENIE KARTY POBYTU ', '✦', ' 450 ZŁ — 1 GODZINA PRAWNA'],
    order: 'Zamów →',
    tag: 'USŁUGA PRZYSPIESZENIA',
    h1: ['Zmęczony', 'czekaniem?'],
    pains: [
      { pre: 'Złożyłeś dokumenty — i cisza. Urząd nie odpowiada.', bold: ' Tygodnie stały się miesiącami.' },
      { pre: 'Trafiłeś do województwa gdzie rozpatrują latami.', bold: ' Utknąłeś. Nie możesz się ruszyć.' },
      { pre: 'Jesteś przywiązany do jednego pracodawcy.', bold: ' Nie możesz zmienić pracy. Nie możesz rosnąć.' },
      { pre: 'Bez karty —', bold: ' nie ma kredytu, nie ma hipoteki.', post: ' Jesteś "tymczasowy" we własnym życiu.' },
      { pre: 'Chcesz pojechać do rodziny —', bold: ' boisz się zostawić sprawę bez nadzoru.' },
      { pre: 'Żyjesz w zawieszeniu', bold: ' już rok. Albo dwa.', post: ' Końca nie widać.' },
    ],
    notNormal: 'To nie jest normalne.',
    notNormalSub: 'I nie musisz się z tym godzić.',
    bq: ['System ma narzędzia. Prawo ma terminy. Urząd ', 'jest zobowiązany', ' odpowiadać. Po prostu liczą na to, że tego nie wiesz.'],
    weKnow: 'My wiemy.',
    howTag: 'JAK TO DZIAŁA',
    steps: [
      { n: '01', title: 'Płatność — i kontaktujemy się', pre: 'Płacisz za godzinę prawną. Zbieramy szczegóły Twojej sprawy.', bold: ' Jeśli nie możemy się podjąć — zwracamy pieniądze w 1 dzień.' },
      { n: '02', title: 'Unikalny pakiet dokumentów', pre: 'Otrzymujesz gotowy pakiet pod Twoją sprawę.', bold: ' Wydrukuj. Podpisz. Wyślij.', post: ' Nic więcej od Ciebie nie potrzeba.' },
      { n: '03', title: 'Sprawa trafia do komitetu decyzyjnego', pre: 'W ciągu dwóch miesięcy — wynik. Jeśli urząd milczy —', bold: ' skarga na bezczynność.', post: ' Jeśli znów milczy — sąd. Trzy etapy. Znamy każdy.' },
    ],
    pricingTag: 'CENNIK',
    p1tag: 'KARTA POBYTU', p1name: 'Pakiet Przyspieszenia', p1price: '450 ZŁ', p1sub: '= 1 godzina prawna',
    p1f: ['Konsultacja Twojej sprawy', 'Skarga na bezczynność urzędu', 'Unikalny pakiet dokumentów', 'Przygotowanie do sądu — jeśli potrzeba'],
    p2tag: 'KARTA REZYDENTA UE', p2name: 'Pakiet Rezydent', p2price: '900 ZŁ', p2sub: '= 2 godziny prawne',
    p2f: ['Wszystko to samo + bardziej złożona strategia', 'Wieloetapowy plan prowadzący do decyzji', 'Pełny status na 3+ lata', 'Przygotowanie do sądu: 4 godz. osobno'],
    gTitle: 'Gwarancja — 1 dzień',
    gText: ['Jeśli po płatności okaże się, że nie możemy podjąć Twojej sprawy — ', 'zwracamy środki w jeden dzień.', ' Zero korupcji. Zero schematów. Wyłącznie zgodnie z prawem — wiemy gdzie naciskać, wiemy co pisać.'],
    fTitle: 'Oleksandr Vasylyshyn — dlaczego ta strategia działa i dlaczego można jej ufać',
    fSub: 'Założyciel Kompas Migracji · 8 lat w prawie migracyjnym · Osobiście odbiera telefony',
    ctaH: ['Twoja sprawa.', 'Nasz ruch.'],
    ctaSub: 'Napisz lub zadzwoń — zajmiemy się Twoją sytuacją',
    ctaBtn: 'Zamów teraz',
    callTag: 'ZADZWOŃ', callDesc: 'Osobista konsultacja Oleksandra Vasylyshyna. Pon–Nd: 10:00 — 22:00',
    quote: 'Stawiam swoją reputację. Jeśli coś nie tak — dzwońcie. Zawsze odbieram. — Oleksandr',
    ft1tag: 'O PROJEKCIE', ft1desc: 'Ochrona Ukraińców przed dyskryminacją. Jedno okienko rozwiązujące wszystkie zadania biurokratyczne — notariusz, prawnik, mediator, asystent prawny.',
    ft2tag: 'KONSULTACJE OSOBISTE', ft2name: 'Oleksandr Vasylyshyn', ft2desc: 'Budowanie mapy drogowej w emigracji.\nPon–Nd: 10:00 — 22:00',
    ft3tag: 'PILNA POMOC PRAWNA', ft3sub: 'Całą dobę · 24/7',
    copy: 'Zero korupcji · Wyłącznie zgodnie z prawem · Dla Ukraińców w UE',
  },

  ru: {
    flag: '🇷🇺', label: 'Русский',
    ticker: ['УСКОРЕНИЕ КАРТЫ ПОБЫТУ ', '✦', ' 450 ЗЛ — 1 ЮРИДИЧЕСКИЙ ЧАС'],
    order: 'Заказать →',
    tag: 'УСЛУГА УСКОРЕНИЯ',
    h1: ['Устал', 'ждать?'],
    pains: [
      { pre: 'Подал документы — и тишина. Ужонд не отвечает.', bold: ' Недели стали месяцами.' },
      { pre: 'Попал в воеводство, где рассматривают годами.', bold: ' Застрял. Не можешь двигаться.' },
      { pre: 'Привязан к одному работодателю.', bold: ' Не можешь сменить работу. Не можешь расти.' },
      { pre: 'Без карты —', bold: ' нет кредита, нет ипотеки.', post: ' Ты "временный" в собственной жизни.' },
      { pre: 'Хочешь поехать к семье —', bold: ' боишься оставить дело без присмотра.' },
      { pre: 'Живёшь в подвешенном состоянии', bold: ' уже год. Или два.', post: ' Конца не видно.' },
    ],
    notNormal: 'Это ненормально.',
    notNormalSub: 'И ты не обязан с этим мириться.',
    bq: ['Система имеет инструменты. Закон имеет сроки. Ужонд ', 'обязан', ' отвечать. Они просто рассчитывают на то, что ты этого не знаешь.'],
    weKnow: 'Мы знаем.',
    howTag: 'КАК ЭТО РАБОТАЕТ',
    steps: [
      { n: '01', title: 'Оплата — и мы связываемся', pre: 'Ты оплачиваешь юридический час. Мы собираем детали твоего дела.', bold: ' Если не сможем взяться — возвращаем деньги за 1 день.' },
      { n: '02', title: 'Уникальный пакет документов', pre: 'Ты получаешь готовый пакет под твоё дело.', bold: ' Распечатал. Подписал. Отправил.', post: ' Больше ничего от тебя не нужно.' },
      { n: '03', title: 'Дело выходит на комитет решений', pre: 'В течение двух месяцев — результат. Если ужонд молчит —', bold: ' жалоба на бездействие.', post: ' Если снова молчит — суд. Три этапа. Мы знаем каждый.' },
    ],
    pricingTag: 'ТАРИФЫ',
    p1tag: 'КАРТА ПОБЫТУ', p1name: 'Пакет Ускорения', p1price: '450 ЗЛ', p1sub: '= 1 юридический час',
    p1f: ['Консультация по твоему делу', 'Жалоба на бездействие ужонда', 'Уникальный пакет документов', 'Подготовка к суду — если нужно'],
    p2tag: 'КАРТА РЕЗИДЕНТА ЕС', p2name: 'Пакет Резидент', p2price: '900 ЗЛ', p2sub: '= 2 юридических часа',
    p2f: ['Всё то же + более сложная стратегия', 'Многоэтапный план выхода на решение', 'Полный статус на 3+ года', 'Подготовка к суду: 4 ч. отдельно'],
    gTitle: 'Гарантия — 1 день',
    gText: ['Если после оплаты выяснится, что мы не можем взять твоё дело — ', 'возвращаем средства за один день.', ' Никакой коррупции. Никаких схем. Исключительно по закону — знаем где давить, знаем что писать.'],
    fTitle: 'Александр Василишин — почему эта стратегия работает и почему ей стоит доверять',
    fSub: 'Основатель Kompas Migracji · 8 лет в миграционном праве · Лично отвечает на звонки',
    ctaH: ['Твоё дело.', 'Наш ход.'],
    ctaSub: 'Напиши или позвони — разберёмся с твоей ситуацией',
    ctaBtn: 'Заказать сейчас',
    quote: 'Ставлю собственную репутацию. Если что-то не так — звоните. Беру трубку всегда. — Александр',
    ft1tag: 'О ПРОЕКТЕ', ft1desc: 'Защита украинцев от дискриминации. Единое окно для решения всех бюрократических задач — нотариус, адвокат, медиатор, юридический ассистент.',
    ft2tag: 'ЛИЧНЫЕ КОНСУЛЬТАЦИИ', ft2name: 'Александр Василишин', ft2desc: 'Построение дорожной карты в эмиграции.\nПн–Вс: 10:00 — 22:00',
    ft3tag: 'СРОЧНАЯ ЮРИДИЧЕСКАЯ ПОМОЩЬ', ft3sub: 'Круглосуточно · 24/7',
    copy: 'Никакой коррупции · Исключительно по закону · Для украинцев в ЕС',
  },

  en: {
    flag: '🇬🇧', label: 'English',
    ticker: ['RESIDENCE CARD ACCELERATION ', '✦', ' 450 PLN — 1 LEGAL HOUR'],
    order: 'Order →',
    tag: 'ACCELERATION SERVICE',
    h1: ['Tired of', 'waiting?'],
    pains: [
      { pre: 'You filed documents — and silence. The office does not respond.', bold: ' Weeks became months.' },
      { pre: 'You ended up in a district that processes for years.', bold: ' Stuck. You cannot move forward.' },
      { pre: 'You are tied to one employer.', bold: ' You cannot change jobs. You cannot grow.' },
      { pre: 'Without the card —', bold: ' no credit, no mortgage.', post: ' You are "temporary" in your own life.' },
      { pre: 'You want to visit your family —', bold: ' you are afraid to leave your case unattended.' },
      { pre: 'You have been living in limbo for', bold: ' a year. Or two.', post: ' No end in sight.' },
    ],
    notNormal: 'This is not normal.',
    notNormalSub: 'And you do not have to accept it.',
    bq: ['The system has tools. The law has deadlines. The office ', 'is obligated', ' to respond. They simply count on you not knowing this.'],
    weKnow: 'We know.',
    howTag: 'HOW IT WORKS',
    steps: [
      { n: '01', title: 'Payment — and we get in touch', pre: 'You pay for a legal hour. We gather details of your case.', bold: ' If we cannot take it — we refund within 1 day.' },
      { n: '02', title: 'Unique document package', pre: 'You receive a ready-made package tailored to your case.', bold: ' Print. Sign. Send.', post: ' Nothing more is needed from you.' },
      { n: '03', title: 'Case reaches the decision committee', pre: 'Within two months — a result. If the office is silent —', bold: ' complaint for inaction.', post: ' If silent again — court. Three stages. We know each one.' },
    ],
    pricingTag: 'PRICING',
    p1tag: 'RESIDENCE CARD', p1name: 'Acceleration Package', p1price: '450 PLN', p1sub: '= 1 legal hour',
    p1f: ['Consultation on your case', 'Complaint for office inaction', 'Unique document package', 'Court preparation — if needed'],
    p2tag: 'EU RESIDENT CARD', p2name: 'Resident Package', p2price: '900 PLN', p2sub: '= 2 legal hours',
    p2f: ['Everything above + complex strategy', 'Multi-step plan leading to decision', 'Full status for 3+ years', 'Court preparation: 4 hrs separately'],
    gTitle: 'Guarantee — 1 day',
    gText: ['If after payment it turns out we cannot take your case — ', 'we refund within one day.', ' Zero corruption. Zero schemes. Strictly by the law — we know where to press, we know what to write.'],
    fTitle: 'Oleksandr Vasylyshyn — why this strategy works and why it can be trusted',
    fSub: 'Founder of Kompas Migracji · 8 years in immigration law · Personally answers calls',
    ctaH: ['Your case.', 'Our move.'],
    ctaSub: 'Write or call — we will sort out your situation',
    ctaBtn: 'Order now',
    callTag: 'CALL US', callDesc: 'Personal consultation from Oleksandr Vasylyshyn. Mon–Sun: 10:00 — 22:00',
    quote: 'I stake my own reputation. If something is wrong — call. I always answer. — Oleksandr',
    ft1tag: 'ABOUT', ft1desc: 'Protecting Ukrainians from discrimination. A one-stop window for all bureaucratic tasks — notary, lawyer, mediator, legal assistant.',
    ft2tag: 'PERSONAL CONSULTATIONS', ft2name: 'Oleksandr Vasylyshyn', ft2desc: 'Building a roadmap in emigration.\nMon–Sun: 10:00 — 22:00',
    ft3tag: 'EMERGENCY LEGAL AID', ft3sub: '24/7',
    copy: 'Zero corruption · Strictly by the law · For Ukrainians in the EU',
  },
};

/* ─── HELPERS ───────────────────────────────────────────── */
function Tag({ color, children }) {
  return <p style={{ ...small, color, marginBottom: 12 }}>{children}</p>;
}

function MixedText({ pre, bold, post, size = 15, lineHeight = 1.7 }) {
  return (
    <p style={{ margin: 0, fontSize: size, lineHeight, color: LIGHT }}>
      <span style={{ color: LIGHT }}>{pre}</span>
      <strong style={{ color: DARK, fontWeight: 700 }}>{bold}</strong>
      {post && <span style={{ color: LIGHT }}>{post}</span>}
    </p>
  );
}

/* ─── COMPONENT ─────────────────────────────────────────── */
export default function KartaLanding() {
  const [lang, setLang] = useState('ua');
  const t = LANGS[lang];

  const handleOrder = () => {
    const msgs = {
      ua: 'Хочу замовити Пакет Прискорення — Карта побуту',
      pl: 'Chcę zamówić Pakiet Przyspieszenia — Karta pobytu',
      ru: 'Хочу заказать Пакет Ускорения — Карта побыту',
      en: 'I want to order the Acceleration Package — Residence Card',
    };
    window.open(`https://wa.me/48729271848?text=${encodeURIComponent(msgs[lang])}`, '_blank');
  };

  return (
    <>
      <style>{`
        @keyframes karta-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .karta-ticker { animation: karta-scroll 30s linear infinite; display: inline-block; white-space: nowrap; }
        .karta-card:hover { border-color: ${ORANGE} !important; }
        .karta-cta-btn {
          display: inline-block;
          background: ${ORANGE};
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
          padding: 14px 36px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
          text-decoration: none;
        }
        .karta-cta-btn:hover { opacity: 0.88; }

        #karta-root { overflow-x: hidden; }
        #karta-root p, #karta-root span, #karta-root li {
          word-break: break-word;
          overflow-wrap: break-word;
        }
        #karta-root * { box-sizing: border-box; }

        @media (max-width: 480px) {
          .karta-price { font-size: clamp(32px, 11vw, 46px) !important; }
          .karta-step-num { font-size: 28px !important; margin-bottom: 6px !important; }
          .karta-pkg-name { font-size: 16px !important; }
          .karta-hero-h1 { letter-spacing: -0.035em !important; }
        }
      `}</style>

      <div id="karta-root" style={{ fontFamily: "'Syne', sans-serif", background: '#fff', color: DARK }}>

        {/* ── LANG BAR ── */}
        <div style={{ borderBottom: `1px solid ${LGRAY}`, padding: '10px 24px', display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
          {Object.entries(LANGS).map(([key, val]) => (
            <button key={key} onClick={() => setLang(key)} style={{
              padding: '4px 12px',
              border: `1.5px solid ${lang === key ? ORANGE : LGRAY}`,
              borderRadius: 6,
              background: lang === key ? '#fff7ed' : 'transparent',
              color: lang === key ? ORANGE : GRAY,
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              {val.flag} {val.label}
            </button>
          ))}
        </div>

        {/* ── TICKER ── */}
        <div style={{ background: DARK, overflow: 'hidden', padding: '8px 0' }}>
          <div className="karta-ticker">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#fff', marginRight: 48 }}>
                {t.ticker[0]}<span style={{ color: ORANGE }}>{t.ticker[1]}</span>{t.ticker[2]}
              </span>
            ))}
          </div>
        </div>

        {/* ── NAV ── */}
        <div style={{ borderBottom: `1px solid ${LGRAY}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>
            <span style={{ color: ORANGE }}>Kompas </span><span style={{ color: DARK }}>Migracji</span>
          </span>
          <button onClick={handleOrder} style={{
            background: 'transparent', border: 'none',
            color: GRAY, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.02em',
          }}>
            {t.order}
          </button>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>

          {/* HERO */}
          <section style={{ padding: '48px 0 32px' }}>
            <Tag color={ORANGE}>{t.tag}</Tag>
            <h1 className="karta-hero-h1" style={{ fontSize: 'clamp(34px, 10vw, 86px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', margin: 0 }}>
              <span style={{ display: 'block', color: DARK }}>{t.h1[0]}</span>
              <span style={{ display: 'block', color: ORANGE }}>{t.h1[1]}</span>
            </h1>
          </section>

          {/* PAIN POINTS */}
          <section style={{ borderTop: `1px solid ${LGRAY}` }}>
            {t.pains.map((p, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${LGRAY}`, padding: '16px 0', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: ORANGE, fontWeight: 800, flexShrink: 0, lineHeight: '1.7', fontSize: 14 }}>—</span>
                <MixedText pre={p.pre} bold={p.bold} post={p.post} size={14} />
              </div>
            ))}
          </section>

          {/* NOT NORMAL */}
          <section style={{ padding: '32px 0 0' }}>
            <p style={{ margin: '0 0 2px', fontWeight: 800, fontSize: 14, color: DARK }}>{t.notNormal}</p>
            <p style={{ margin: '0 0 28px', fontWeight: 700, fontSize: 14, color: ORANGE }}>{t.notNormalSub}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '3px 1fr', gap: 20, marginBottom: 48 }}>
              <div style={{ background: MINT, borderRadius: 2 }} />
              <div>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: '#4b5563', lineHeight: 1.8 }}>
                  <span style={{ color: '#4b5563' }}>{t.bq[0]}</span>
                  <strong style={{ color: DARK }}>{t.bq[1]}</strong>
                  <span style={{ color: '#4b5563' }}>{t.bq[2]}</span>
                </p>
                <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: MINT, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  {t.weKnow}
                </p>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section>
            <Tag color={GRAY}>{t.howTag}</Tag>
            <div style={{ borderTop: `2px solid ${LGRAY}`, marginBottom: 0 }} />
            {t.steps.map((s, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${LGRAY}`, padding: '24px 0' }}>
                <p className="karta-step-num" style={{ fontSize: 40, fontWeight: 900, color: '#d1d5db', margin: '0 0 8px', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</p>
                <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: DARK, lineHeight: 1.4 }}>{s.title}</p>
                <MixedText pre={s.pre} bold={s.bold} post={s.post} size={13} />
              </div>
            ))}
          </section>

          {/* PRICING */}
          <section style={{ paddingTop: 44, paddingBottom: 52 }}>
            <Tag color={GRAY}>{t.pricingTag}</Tag>
            <div style={{ borderTop: `2px solid ${ORANGE}`, marginBottom: 36 }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 40 }}>
              {/* pkg 1 */}
              <div>
                <Tag color={ORANGE}>{t.p1tag}</Tag>
                <p className="karta-pkg-name" style={{ fontSize: 20, fontWeight: 800, margin: '0 0 2px', color: DARK }}>{t.p1name}</p>
                <p className="karta-price" style={{ fontSize: 46, fontWeight: 900, color: ORANGE, margin: '0 0 2px', lineHeight: 1, letterSpacing: '-0.03em' }}>{t.p1price}</p>
                <p style={{ fontSize: 12, color: GRAY, margin: '0 0 20px' }}>{t.p1sub}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {t.p1f.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: LIGHT }}>
                      <span style={{ color: ORANGE, flexShrink: 0, fontWeight: 700, lineHeight: '1.6' }}>→</span>
                      <span style={{ color: LIGHT }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* pkg 2 */}
              <div>
                <Tag color={MINT}>{t.p2tag}</Tag>
                <p className="karta-pkg-name" style={{ fontSize: 20, fontWeight: 800, margin: '0 0 2px', color: DARK }}>{t.p2name}</p>
                <p className="karta-price" style={{ fontSize: 46, fontWeight: 900, color: MINT, margin: '0 0 2px', lineHeight: 1, letterSpacing: '-0.03em' }}>{t.p2price}</p>
                <p style={{ fontSize: 12, color: GRAY, margin: '0 0 20px' }}>{t.p2sub}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {t.p2f.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: LIGHT }}>
                      <span style={{ color: MINT, flexShrink: 0, fontWeight: 700, lineHeight: '1.6' }}>→</span>
                      <span style={{ color: LIGHT }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* GUARANTEE */}
          <section style={{ paddingBottom: 52 }}>
            <div style={{ border: `1px solid ${LGRAY}`, borderRadius: 16, padding: '36px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>🛡️</div>
              <p style={{ fontSize: 'clamp(20px, 4vw, 34px)', fontWeight: 900, color: MINT, margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                {t.gTitle}
              </p>
              <p style={{ fontSize: 13, color: GRAY, maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
                <span style={{ color: GRAY }}>{t.gText[0]}</span>
                <strong style={{ color: DARK }}>{t.gText[1]}</strong>
                <span style={{ color: GRAY }}>{t.gText[2]}</span>
              </p>
            </div>
          </section>

          {/* FOUNDER */}
          <section style={{ paddingBottom: 52 }}>
            <div style={{ border: `1px solid ${LGRAY}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: '#fafafa', padding: '36px 24px', textAlign: 'center' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  border: `2px solid ${ORANGE}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: 20, color: ORANGE, cursor: 'pointer',
                }}>▶</div>
                <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 8px', color: DARK, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
                  {t.fTitle}
                </p>
                <p style={{ fontSize: 12, color: GRAY, margin: 0 }}>{t.fSub}</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section style={{ borderTop: `1px solid ${LGRAY}`, paddingTop: 52, paddingBottom: 48, textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(30px, 8vw, 68px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', margin: '0 0 14px' }}>
              <span style={{ display: 'block', color: DARK }}>{t.ctaH[0]}</span>
              <span style={{ display: 'block', color: ORANGE }}>{t.ctaH[1]}</span>
            </h2>
            <p style={{ fontSize: 14, color: GRAY, margin: '0 0 28px' }}>{t.ctaSub}</p>
            <button onClick={handleOrder} className="karta-cta-btn">{t.ctaBtn}</button>
          </section>

          {/* CONTACT */}
          <section style={{ paddingBottom: 56, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic', lineHeight: 1.75, maxWidth: 500, margin: '0 auto 0' }}>
              {t.quote}
            </p>
          </section>

        </div>{/* /content */}

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${LGRAY}`, padding: '36px 24px', maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28, marginBottom: 28 }}>
            <div>
              <Tag color={ORANGE}>{t.ft1tag}</Tag>
              <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 6px', color: DARK }}>Kompas Migracji</p>
              <p style={{ fontSize: 12, color: GRAY, margin: 0, lineHeight: 1.7 }}>{t.ft1desc}</p>
            </div>
            <div>
              <Tag color={ORANGE}>{t.ft2tag}</Tag>
              <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 4px', color: DARK }}>{t.ft2name}</p>
              <p style={{ fontSize: 12, color: GRAY, margin: '0 0 20px', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{t.ft2desc}</p>
              <Tag color={ORANGE}>{t.ft3tag}</Tag>
              <a href="viber://chat?number=%2B48729271848" style={{
                display: 'block',
                fontSize: 24, fontWeight: 900, color: DARK,
                margin: '10px 0 4px', letterSpacing: '-0.03em', lineHeight: 1,
                fontFamily: "'Syne', sans-serif", textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}>+48 729 271 848</a>
              <p style={{ fontSize: 11, color: GRAY, margin: '0 0 18px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t.ft3sub}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'stretch' }}>
                <a
                  href="viber://chat?number=%2B48729271848"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: '#7360f2', color: '#fff',
                    fontSize: 13, fontWeight: 700, letterSpacing: '0.02em',
                    padding: '11px 22px', borderRadius: 10,
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(115,96,242,0.35)',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M11.4 0C5.5 0 .8 4.4.8 9.8c0 3 1.5 5.7 3.9 7.5v3.7l3.5-1.9c1 .3 2 .4 3.1.4 5.9 0 10.6-4.4 10.6-9.8S17.3 0 11.4 0zm1 13.2l-2.5-2.7-4.9 2.7 5.4-5.8 2.6 2.7 4.8-2.7-5.4 5.8z"/></svg>
                  Viber
                </a>
                <a
                  href="https://wa.me/48729271848"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: '#25d366', color: '#fff',
                    fontSize: 13, fontWeight: 700, letterSpacing: '0.02em',
                    padding: '11px 22px', borderRadius: 10,
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(37,211,102,0.35)',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.5 0-.2-.1-.4-.2-.5-.1-.2-.6-1.5-.9-2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.1 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.6.2-1.2.2-1.3 0-.1-.3-.2-.5-.3z"/><path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.5 5.9L0 24l6.3-1.6C8.1 23.4 10 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0zm0 21.8c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.8 1 1-3.7-.2-.4C2.3 15.5 1.8 13.8 1.8 12 1.8 6.4 6.4 1.8 12 1.8S22.2 6.4 22.2 12 17.6 21.8 12 21.8z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${LGRAY}`, paddingTop: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', margin: '0 0 14px', letterSpacing: '0.08em' }}>DOMUS V Sp. z o.o.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 28px', marginBottom: 10 }}>
              {[['NIP', '5223350030'], ['KRS', '0001198474'], ['ADRES SIEDZIBY', 'Dzieci Warszawy 27, 02-495 Warszawa']].map(([label, val]) => (
                <div key={label}>
                  <p style={{ fontSize: 9, color: '#9ca3af', margin: '0 0 2px', letterSpacing: '0.08em' }}>{label}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: GRAY, margin: 0 }}>{val}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 9, color: '#9ca3af', margin: '0 0 2px', letterSpacing: '0.08em' }}>NR KONTA</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: GRAY, margin: 0 }}>10 1050 1025 1000 0090 8594 6938</p>
            </div>
            <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', margin: 0, lineHeight: 2 }}>
              <span style={{ color: ORANGE }}>Kompas Migracji</span> · DOMUS V Sp. z o.o. © 2026<br />
              {t.copy}
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
