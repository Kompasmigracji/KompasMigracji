import React, { useState } from 'react';

const ORANGE = '#f97316';
const MINT   = '#86efac';
const DARK   = '#1c1c1c';
const GRAY   = '#6b7280';
const LGRAY  = '#e5e7eb';

const ua = {
  ticker: 'ПРИСКОРЕННЯ КАРТИ ПОБУТУ ✦ 450 ЗЛ — 1 ЮРИДИЧНА ГОДИНА',
  order: 'Замовити →',
  tag: 'ПОСЛУГА ПРИСКОРЕННЯ',
  h1: ['Втомився', 'чекати?'],
  pains: [
    { t: 'Подав документи — і тиша. Уженд не відповідає.', b: ' Тижні стали місяцями.' },
    { t: 'Потрапив у воєводство де розглядають роками.', b: ' Застряг. Не можеш рухатися.' },
    { t: "Прив'язаний до одного роботодавця.", b: ' Не можеш змінити роботу. Не можеш рости.' },
    { t: 'Без карти —', b: ' немає кредиту, немає іпотеки.', a: ' Ти "тимчасовий" у власному житті.' },
    { t: "Хочеш поїхати до сім'ї —", b: ' боїшся залишити справу без нагляду.' },
    { t: 'Живеш у підвішеному стані', b: ' вже рік. Або два.', a: ' Кінця не видно.' },
  ],
  notNormal: 'Це не нормально.',
  notNormalSub: 'І ти не зобов\'язаний з цим миритися.',
  blockquote: ['Система має інструменти. Закон має строки. Уженд ', 'зобов\'язаний', ' відповідати. Вони просто розраховують на те, що ти цього не знаєш.'],
  weKnow: 'Ми знаємо.',
  howTag: 'ЯК ЦЕ ПРАЦЮЄ',
  steps: [
    { n: '01', title: "Оплата — і ми зв'язуємося", t: 'Ти оплачуєш юридичну годину. Ми збираємо деталі твоєї справи.', b: ' Якщо не зможемо взятися — повертаємо гроші за 1 день.' },
    { n: '02', title: 'Унікальний пакет документів', t: 'Ти отримуєш готовий пакет під твою справу.', b: ' Роздрукував. Підписав. Надіслав.', a: ' Більше нічого від тебе не потрібно.' },
    { n: '03', title: 'Справа виходить на комітет рішень', t: 'Протягом двох місяців — результат. Якщо уженд мовчить —', b: ' скарга на бездіяльність.', a: ' Якщо знову мовчить — суд. Три етапи. Ми знаємо кожен.' },
  ],
  pricingTag: 'ТАРИФИ',
  pkg1tag: 'КАРТА ПОБУТУ',
  pkg1name: 'Пакет Прискорення',
  pkg1price: '450 ЗЛ',
  pkg1sub: '= 1 юридична година',
  pkg1features: ['Консультація по твоїй справі', 'Скарга на бездіяльність уженду', 'Унікальний пакет документів', 'Підготовка до суду — якщо потрібно'],
  pkg2tag: 'КАРТА РЕЗИДЕНТА ЄС',
  pkg2name: 'Пакет Резидент',
  pkg2price: '900 ЗЛ',
  pkg2sub: '= 2 юридичні години',
  pkg2features: ['Все те саме + складніша стратегія', 'Багатоетапний план виводу на рішення', 'Повний статус на 3+ роки', 'Підготовка до суду: 4 год. окремо'],
  guaranteeTitle: 'Гарантія — 1 день',
  guaranteeText: ["Якщо після оплати з'ясується, що ми не можемо взяти твою справу — ", 'повертаємо кошти за один день.', ' Жодної корупції. Жодних схем. Виключно по закону — знаємо де тиснути, знаємо що писати.'],
  founderTitle: 'Олександр Василишин — чому ця стратегія працює і чому їй слід довіряти',
  founderSub: 'Засновник Kompas Migracji · 8 років у міграційному праві · Особисто відповідає на дзвінки',
  ctaH: ['Твоя справа.', 'Наш хід.'],
  ctaSub: 'Напиши або зателефонуй — розберемося з твоєю ситуацією',
  viberTag: 'НАПИСАТИ У VIBER',
  viberDesc: 'Замовити послугу — виставимо рахунок і запустимо процес',
  viberName: 'Kompas Migracji — робочий',
  phoneTag: 'ЗАТЕЛЕФОНУВАТИ',
  phoneDesc: 'Особиста консультація від Олександра Василишина. Є питання прямо зараз — дзвони.',
  phoneName: 'Олександр Василишин',
  quote: 'Закладаю власну репутацію. Якщо щось не так — дзвоніть. Беру трубку завжди. — Олександр',
  aboutTag: 'ПРО ПРОЕКТ',
  aboutDesc: "Захист українців від дискримінації. Єдине вікно з розв'язання усіх бюрократичних задач — нотаріус, адвокат, медіатор, юридичний асистент.",
  consultTag: 'ОСОБИСТІ КОНСУЛЬТАЦІЇ',
  consultName: 'Олександр Василишин',
  consultDesc: 'Побудова дорожньої карти в еміграції.\nПн–Нд: 10:00 — 22:00',
  emergencyTag: 'ЕКСТРЕНА ЮРИДИЧНА ДОПОМОГА',
  emergencyDesc: 'WhatsApp / Viber — цілодобово.',
  emergencySub: 'Цілодобово · 24/7',
  footerBottom: 'Жодної корупції · Виключно по закону · Для українців в ЄС',
};

const pl = {
  ticker: 'PRZYSPIESZENIE KARTY POBYTU ✦ 450 ZŁ — 1 GODZINA PRAWNA',
  order: 'Zamów →',
  tag: 'USŁUGA PRZYSPIESZENIA',
  h1: ['Zmęczony', 'czekaniem?'],
  pains: [
    { t: 'Złożyłeś dokumenty — i cisza. Urząd nie odpowiada.', b: ' Tygodnie stały się miesiącami.' },
    { t: 'Trafiłeś do województwa gdzie rozpatrują latami.', b: ' Utknąłeś. Nie możesz się ruszyć.' },
    { t: 'Jesteś przywiązany do jednego pracodawcy.', b: ' Nie możesz zmienić pracy. Nie możesz rosnąć.' },
    { t: 'Bez karty —', b: ' nie ma kredytu, nie ma hipoteki.', a: ' Jesteś "tymczasowy" we własnym życiu.' },
    { t: 'Chcesz pojechać do rodziny —', b: ' boisz się zostawić sprawę bez nadzoru.' },
    { t: 'Żyjesz w zawieszeniu', b: ' już rok. Albo dwa.', a: ' Końca nie widać.' },
  ],
  notNormal: 'To nie jest normalne.',
  notNormalSub: 'I nie musisz się z tym godzić.',
  blockquote: ['System ma narzędzia. Prawo ma terminy. Urząd ', 'jest zobowiązany', ' odpowiadać. Po prostu liczą na to, że tego nie wiesz.'],
  weKnow: 'My wiemy.',
  howTag: 'JAK TO DZIAŁA',
  steps: [
    { n: '01', title: 'Płatność — i kontaktujemy się', t: 'Płacisz za godzinę prawną. Zbieramy szczegóły Twojej sprawy.', b: ' Jeśli nie możemy się podjąć — zwracamy pieniądze w 1 dzień.' },
    { n: '02', title: 'Unikalny pakiet dokumentów', t: 'Otrzymujesz gotowy pakiet pod Twoją sprawę.', b: ' Wydrukuj. Podpisz. Wyślij.', a: ' Nic więcej od Ciebie nie potrzeba.' },
    { n: '03', title: 'Sprawa trafia do komitetu decyzyjnego', t: 'W ciągu dwóch miesięcy — wynik. Jeśli urząd milczy —', b: ' skarga na bezczynność.', a: ' Jeśli znów milczy — sąd. Trzy etapy. Znamy każdy.' },
  ],
  pricingTag: 'CENNIK',
  pkg1tag: 'KARTA POBYTU',
  pkg1name: 'Pakiet Przyspieszenia',
  pkg1price: '450 ZŁ',
  pkg1sub: '= 1 godzina prawna',
  pkg1features: ['Konsultacja Twojej sprawy', 'Skarga na bezczynność urzędu', 'Unikalny pakiet dokumentów', 'Przygotowanie do sądu — jeśli potrzeba'],
  pkg2tag: 'KARTA REZYDENTA UE',
  pkg2name: 'Pakiet Rezydent',
  pkg2price: '900 ZŁ',
  pkg2sub: '= 2 godziny prawne',
  pkg2features: ['Wszystko to samo + bardziej złożona strategia', 'Wieloetapowy plan prowadzący do decyzji', 'Pełny status na 3+ lata', 'Przygotowanie do sądu: 4 godz. osobno'],
  guaranteeTitle: 'Gwarancja — 1 dzień',
  guaranteeText: ['Jeśli po płatności okaże się, że nie możemy podjąć Twojej sprawy — ', 'zwracamy środki w jeden dzień.', ' Zero korupcji. Zero schematów. Wyłącznie zgodnie z prawem — wiemy gdzie naciskać, wiemy co pisać.'],
  founderTitle: 'Oleksandr Vasylyshyn — dlaczego ta strategia działa i dlaczego można jej ufać',
  founderSub: 'Założyciel Kompas Migracji · 8 lat w prawie migracyjnym · Osobiście odbiera telefony',
  ctaH: ['Twoja sprawa.', 'Nasz ruch.'],
  ctaSub: 'Napisz lub zadzwoń — zajmiemy się Twoją sytuacją',
  viberTag: 'NAPISZ NA VIBER',
  viberDesc: 'Zamów usługę — wystawimy fakturę i uruchomimy proces',
  viberName: 'Kompas Migracji — roboczy',
  phoneTag: 'ZADZWOŃ',
  phoneDesc: 'Osobista konsultacja Oleksandra Vasylyshyna. Masz pytanie teraz — dzwoń.',
  phoneName: 'Oleksandr Vasylyshyn',
  quote: 'Stawiam swoją reputację. Jeśli coś nie tak — dzwońcie. Zawsze odbieram. — Oleksandr',
  aboutTag: 'O PROJEKCIE',
  aboutDesc: 'Ochrona Ukraińców przed dyskryminacją. Jedno okienko rozwiązujące wszystkie zadania biurokratyczne — notariusz, prawnik, mediator, asystent prawny.',
  consultTag: 'KONSULTACJE OSOBISTE',
  consultName: 'Oleksandr Vasylyshyn',
  consultDesc: 'Budowanie mapy drogowej w emigracji.\nPn–Nd: 10:00 — 22:00',
  emergencyTag: 'PILNA POMOC PRAWNA',
  emergencyDesc: 'WhatsApp / Viber — całą dobę.',
  emergencySub: 'Całą dobę · 24/7',
  footerBottom: 'Zero korupcji · Wyłącznie zgodnie z prawem · Dla Ukraińców w UE',
};

const small = { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 };
const divider = { borderTop: `1px solid ${LGRAY}` };

export default function KartaLanding() {
  const [lang, setLang] = useState('ua');
  const t = lang === 'ua' ? ua : pl;

  const handleOrder = () => {
    const text = lang === 'ua'
      ? 'Хочу замовити Пакет Прискорення — Карта побуту'
      : 'Chcę zamówić Pakiet Przyspieszenia — Karta pobytu';
    window.open(`https://wa.me/48729271848?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      <style>{`
        @keyframes karta-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .karta-ticker { animation: karta-scroll 28s linear infinite; display: inline-block; }
      `}</style>

      <div style={{ fontFamily: "'Syne', sans-serif", background: '#fff', color: DARK, minHeight: '100vh' }}>

        {/* ── LANG BAR ── */}
        <div style={{ borderBottom: `1px solid ${LGRAY}`, padding: '12px 32px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {['ua', 'pl'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: '6px 16px', border: `1.5px solid ${lang === l ? ORANGE : LGRAY}`,
              borderRadius: 6, background: 'transparent', color: lang === l ? ORANGE : GRAY,
              fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
            }}>
              {l === 'ua' ? '🇺🇦 Українська' : '🇵🇱 Polski'}
            </button>
          ))}
        </div>

        {/* ── TICKER ── */}
        <div style={{ background: DARK, overflow: 'hidden', whiteSpace: 'nowrap', padding: '10px 0' }}>
          <div className="karta-ticker">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: '#fff', marginRight: 56 }}>
                {t.ticker.split('✦')[0]}<span style={{ color: ORANGE }}>✦</span>{t.ticker.split('✦')[1]}
              </span>
            ))}
          </div>
        </div>

        {/* ── NAV ── */}
        <div style={{ borderBottom: `1px solid ${LGRAY}`, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>
            <span style={{ color: ORANGE }}>Kompas</span>Migracji
          </span>
          <button onClick={handleOrder} style={{ background: 'transparent', border: 'none', color: GRAY, fontSize: 14, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em' }}>
            {t.order}
          </button>
        </div>

        {/* ── CONTENT WRAPPER ── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px' }}>

          {/* ── HERO ── */}
          <section style={{ padding: '64px 0 40px' }}>
            <p style={{ ...small, color: ORANGE, marginBottom: 24 }}>{t.tag}</p>
            <h1 style={{ fontSize: 'clamp(60px, 9vw, 100px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', margin: 0 }}>
              <span style={{ display: 'block', color: DARK }}>{t.h1[0]}</span>
              <span style={{ display: 'block', color: ORANGE }}>{t.h1[1]}</span>
            </h1>
          </section>

          {/* ── PAIN POINTS ── */}
          <section style={{ ...divider }}>
            {t.pains.map((p, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${LGRAY}`, padding: '20px 0', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ color: ORANGE, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>—</span>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: '#374151' }}>
                  {p.t}<strong style={{ color: DARK }}>{p.b}</strong>{p.a || ''}
                </p>
              </div>
            ))}
          </section>

          {/* ── NOT NORMAL ── */}
          <section style={{ padding: '40px 0 0' }}>
            <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 15 }}>{t.notNormal}</p>
            <p style={{ margin: '0 0 32px', fontWeight: 700, fontSize: 15, color: ORANGE }}>{t.notNormalSub}</p>

            {/* blockquote */}
            <div style={{ display: 'grid', gridTemplateColumns: '3px 1fr', gap: 24, marginBottom: 48 }}>
              <div style={{ background: MINT, borderRadius: 2 }} />
              <div>
                <p style={{ margin: '0 0 16px', fontSize: 14, color: '#4b5563', lineHeight: 1.75 }}>
                  {t.blockquote[0]}<strong style={{ color: DARK }}>{t.blockquote[1]}</strong>{t.blockquote[2]}
                </p>
                <p style={{ margin: 0, fontSize: 40, fontWeight: 800, color: MINT, lineHeight: 1.1 }}>{t.weKnow}</p>
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section>
            <p style={{ ...small, color: GRAY, borderTop: `2px solid ${LGRAY}`, paddingTop: 28, marginBottom: 8 }}>{t.howTag}</p>
            {t.steps.map((s, i) => (
              <div key={i} style={{ borderTop: `1px solid ${LGRAY}`, padding: '32px 0' }}>
                <p style={{ fontSize: 52, fontWeight: 900, color: '#d1d5db', margin: '0 0 10px', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</p>
                <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: DARK }}>{s.title}</p>
                <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.75 }}>
                  {s.t}<strong style={{ color: DARK }}>{s.b}</strong>{s.a || ''}
                </p>
              </div>
            ))}
          </section>

          {/* ── PRICING ── */}
          <section style={{ paddingBottom: 64 }}>
            <p style={{ ...small, color: GRAY, borderTop: `2px solid ${ORANGE}`, paddingTop: 28, marginBottom: 40 }}>{t.pricingTag}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48 }}>
              {/* Package 1 */}
              <div>
                <p style={{ ...small, color: ORANGE, marginBottom: 8 }}>{t.pkg1tag}</p>
                <p style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: DARK }}>{t.pkg1name}</p>
                <p style={{ fontSize: 60, fontWeight: 900, color: ORANGE, margin: '0 0 4px', lineHeight: 1, letterSpacing: '-0.03em' }}>{t.pkg1price}</p>
                <p style={{ fontSize: 13, color: GRAY, margin: '0 0 24px' }}>{t.pkg1sub}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {t.pkg1features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, color: '#374151' }}>
                      <span style={{ color: ORANGE, flexShrink: 0, fontWeight: 700 }}>→</span>{f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Package 2 */}
              <div>
                <p style={{ ...small, color: MINT, marginBottom: 8 }}>{t.pkg2tag}</p>
                <p style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: DARK }}>{t.pkg2name}</p>
                <p style={{ fontSize: 60, fontWeight: 900, color: MINT, margin: '0 0 4px', lineHeight: 1, letterSpacing: '-0.03em' }}>{t.pkg2price}</p>
                <p style={{ fontSize: 13, color: GRAY, margin: '0 0 24px' }}>{t.pkg2sub}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {t.pkg2features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, color: '#374151' }}>
                      <span style={{ color: MINT, flexShrink: 0, fontWeight: 700 }}>→</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── GUARANTEE ── */}
          <section style={{ paddingBottom: 64 }}>
            <div style={{ border: `1px solid ${LGRAY}`, borderRadius: 16, padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>🛡️</div>
              <p style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: MINT, margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                {t.guaranteeTitle}
              </p>
              <p style={{ fontSize: 14, color: GRAY, maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
                {t.guaranteeText[0]}<strong style={{ color: DARK }}>{t.guaranteeText[1]}</strong>{t.guaranteeText[2]}
              </p>
            </div>
          </section>

          {/* ── FOUNDER ── */}
          <section style={{ paddingBottom: 64 }}>
            <div style={{ border: `1px solid ${LGRAY}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: '#f9fafb', padding: '48px 32px', textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', border: `2px solid ${ORANGE}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: 26, cursor: 'pointer', color: ORANGE,
                }}>▶</div>
                <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 8px', color: DARK, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
                  {t.founderTitle}
                </p>
                <p style={{ fontSize: 13, color: GRAY, margin: 0 }}>{t.founderSub}</p>
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section style={{ paddingBottom: 64, textAlign: 'center', borderTop: `1px solid ${LGRAY}`, paddingTop: 64 }}>
            <h2 style={{ fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', margin: '0 0 16px' }}>
              <span style={{ display: 'block', color: DARK }}>{t.ctaH[0]}</span>
              <span style={{ display: 'block', color: ORANGE }}>{t.ctaH[1]}</span>
            </h2>
            <p style={{ fontSize: 15, color: GRAY, margin: 0 }}>{t.ctaSub}</p>
          </section>

          {/* ── CONTACT CARDS ── */}
          <section style={{ paddingBottom: 64 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
              <a href="viber://chat?number=48729271848" style={{ border: `1px solid ${LGRAY}`, borderRadius: 14, padding: 24, textDecoration: 'none', color: 'inherit', display: 'block', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>💬</div>
                <p style={{ ...small, color: ORANGE, marginBottom: 10 }}>{t.viberTag}</p>
                <p style={{ fontSize: 13, color: GRAY, margin: '0 0 10px', lineHeight: 1.6 }}>{t.viberDesc}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: DARK, margin: '0 0 4px' }}>{t.viberName}</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: DARK, margin: 0, letterSpacing: '-0.01em' }}>+48 729 271 848</p>
              </a>

              <a href="tel:+48729271848" style={{ border: `1px solid ${LGRAY}`, borderRadius: 14, padding: 24, textDecoration: 'none', color: 'inherit', display: 'block', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>📞</div>
                <p style={{ ...small, color: MINT, marginBottom: 10 }}>{t.phoneTag}</p>
                <p style={{ fontSize: 13, color: GRAY, margin: '0 0 10px', lineHeight: 1.6 }}>{t.phoneDesc}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: DARK, margin: '0 0 4px' }}>{t.phoneName}</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: DARK, margin: 0, letterSpacing: '-0.01em' }}>+48 729 271 848</p>
              </a>
            </div>

            <p style={{ textAlign: 'center', fontSize: 14, color: '#9ca3af', fontStyle: 'italic', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
              {t.quote}
            </p>
          </section>

        </div>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${LGRAY}`, padding: '40px 32px', maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, marginBottom: 32 }}>
            <div>
              <p style={{ ...small, color: ORANGE, marginBottom: 12 }}>{t.aboutTag}</p>
              <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 6px', color: DARK }}>Kompas Migracji</p>
              <p style={{ fontSize: 13, color: GRAY, margin: 0, lineHeight: 1.7 }}>{t.aboutDesc}</p>
            </div>
            <div>
              <p style={{ ...small, color: ORANGE, marginBottom: 12 }}>{t.consultTag}</p>
              <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 4px', color: DARK }}>{t.consultName}</p>
              <p style={{ fontSize: 13, color: GRAY, margin: '0 0 10px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{t.consultDesc}</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: MINT, margin: '0 0 20px', letterSpacing: '-0.01em' }}>+48 729 271 848</p>

              <p style={{ ...small, color: ORANGE, marginBottom: 8 }}>{t.emergencyTag}</p>
              <p style={{ fontSize: 13, color: GRAY, margin: '0 0 4px' }}>{t.emergencyDesc}</p>
              <p style={{ fontSize: 13, color: GRAY, margin: '0 0 8px' }}>{t.emergencySub}</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: MINT, margin: 0, letterSpacing: '-0.01em' }}>+48 729 271 848</p>
            </div>
          </div>

          {/* Company details */}
          <div style={{ borderTop: `1px solid ${LGRAY}`, paddingTop: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', margin: '0 0 16px', letterSpacing: '0.08em' }}>DOMUS V Sp. z o.o.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px', marginBottom: 12 }}>
              {[
                { label: 'NIP', value: '5223350030' },
                { label: 'KRS', value: '0001198474' },
                { label: 'ADRES SIEDZIBY', value: 'Dzieci Warszawy 27, 02-495 Warszawa' },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: 9, color: '#9ca3af', margin: '0 0 2px', letterSpacing: '0.08em' }}>{item.label}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: GRAY, margin: 0 }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 9, color: '#9ca3af', margin: '0 0 2px', letterSpacing: '0.08em' }}>NR KONTA</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: GRAY, margin: 0 }}>10 1050 1025 1000 0090 8594 6938</p>
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: 0, lineHeight: 1.8 }}>
              <span style={{ color: ORANGE }}>Kompas Migracji</span> · DOMUS V Sp. z o.o. © 2026
              <br />{t.footerBottom}
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
