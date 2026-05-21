import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

const ORANGE = '#f97316';
const NAVY   = '#0f172a';

// null amountGrosze = WhatsApp inquiry
const CATEGORIES = [
  {
    id: 'legalization',
    title: 'Легалізація побиту',
    icon: '🏠',
    rows: [
      { name: 'Часовий побит',                                        price: '1 200',    amountGrosze: 120000 },
      { name: 'Часовий побит — ускладнені обставини',                 price: '1 650',    amountGrosze: 165000 },
      { name: 'Часовий побит — діти',                                 price: '950',      amountGrosze: 95000 },
      { name: 'Сталий побит',                                         price: '2 100',    amountGrosze: 210000 },
      { name: 'Резидент ЄС',                                          price: '2 100',    amountGrosze: 210000 },
      { name: 'Громадянство Польщі (через Воєводу)',                  price: '2 400',    amountGrosze: 240000 },
      { name: 'Громадянство Польщі (Президент)',                      price: '2 900',    amountGrosze: 290000 },
      { name: 'Резидент + Громадянство',                              price: '4 700',    amountGrosze: 470000 },
      { name: 'Прискорення карти побиту (вивід на комітет рішень)',   price: '450',      amountGrosze: 45000 },
      { name: 'Прискорення карти побиту (апеляція / складна справа)', price: '1 050',    amountGrosze: 105000 },
      { name: 'Прискорення отримання карти Резидента ЄС',            price: '1 050',    amountGrosze: 105000 },
      { name: 'Консультація телефонічна',                             price: '180',      amountGrosze: 18000 },
      { name: 'Консультація + узасаднєніє',                          price: '450',      amountGrosze: 45000 },
    ],
  },
  {
    id: 'marriage',
    title: 'Шлюб та сімейне право',
    icon: '💍',
    rows: [
      { name: 'Супровід по шлюбу',                                    price: '950',      amountGrosze: 95000 },
      { name: 'Довідка для шлюбу без консульства',                    price: '250–420',  amountGrosze: null },
      { name: 'Розлучення в Україні без присутності сторін',          price: '2 100',    amountGrosze: 210000 },
      { name: 'Медіація між сторонами',                               price: '1–2 год.', amountGrosze: null },
    ],
  },
  {
    id: 'translations',
    title: 'Переклади',
    icon: '📄',
    rows: [
      { name: 'Свідоцтво про народження / шлюб / розлучення / посвідчення водія', price: '120', amountGrosze: 12000 },
      { name: 'Індивідуальні тексти',                                 price: 'Індивідуально', amountGrosze: null },
      { name: 'Доставка — пачкомат InPost',                           price: '29',       amountGrosze: 2900 },
      { name: 'Доставка — кур\'єр',                                   price: '44',       amountGrosze: 4400 },
    ],
  },
  {
    id: 'bureaucracy',
    title: 'Бюрократичні справи',
    icon: '📋',
    rows: [
      { name: 'Відновлення 800+',                                     price: '950',      amountGrosze: 95000 },
      { name: 'Розробка договору',                                    price: '450',      amountGrosze: 45000 },
      { name: 'Вичитка договору (пошук «підводних каменів»)',         price: '180',      amountGrosze: 18000 },
      { name: 'Лист-запит до державної установи',                     price: '180',      amountGrosze: 18000 },
      { name: 'Підписання / розірвання договорів з орендодавцем',     price: '180',      amountGrosze: 18000 },
      { name: 'Нетипове резюме (польська та англійська)',             price: '180',      amountGrosze: 18000 },
    ],
  },
  {
    id: 'legal',
    title: 'Юридичні послуги',
    icon: '⚖️',
    rows: [
      { name: 'Допомога в підготовці документів на візи та дозволи',  price: 'Індивідуально', amountGrosze: null },
      { name: 'Міжнародний захист',                                   price: '1 900',    amountGrosze: 190000 },
      { name: 'Захист прав мігрантів (порушення / дискримінація)',    price: 'Індивідуально', amountGrosze: null },
      { name: 'Грошовий спір з роботодавцем',                        price: '1–2 год.', amountGrosze: null },
      { name: 'Колекторський спір',                                   price: '1–2 год.', amountGrosze: null },
      { name: 'Підготовка та розробка бізнес-плану',                  price: '1–2 год.', amountGrosze: null },
      { name: 'Аналіз ринку та пошук партнерів',                     price: '4 год.',   amountGrosze: null },
    ],
  },
  {
    id: 'free',
    title: 'Безкоштовно',
    icon: '🎁',
    free: true,
    rows: [
      { name: 'Пошук роботи',              price: 'Безкоштовно', amountGrosze: null },
      { name: 'Пошук житла',               price: 'Безкоштовно', amountGrosze: null },
      { name: 'Інтеграція та дозвілля',    price: 'Безкоштовно', amountGrosze: null },
      { name: 'Запобігання шахрайству',    price: 'Безкоштовно', amountGrosze: null },
      { name: 'Фінансова сторона міграції',price: 'Безкоштовно', amountGrosze: null },
    ],
  },
];

function PayModal({ service, onClose }) {
  const [email, setEmail]   = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const amountZl = (service.amountGrosze / 100).toLocaleString('uk-UA');

  const pay = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Введіть коректний email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: service.amountGrosze,
          description: `${service.name} — Kompas Migracji`,
          email,
          lang: 'ua',
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || "Помилка з'єднання. Спробуйте ще раз.");
        setLoading(false);
      }
    } catch {
      setError("Помилка з'єднання. Спробуйте ще раз.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`@keyframes pm-in { from { opacity:0; transform:translateY(20px) scale(0.97) } to { opacity:1; transform:none } }`}</style>
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{ background:NAVY, borderRadius:20, padding:'36px 32px', maxWidth:440, width:'100%', position:'relative', border:'1px solid rgba(249,115,22,0.25)', fontFamily:"'Syne', sans-serif", animation:'pm-in 0.32s cubic-bezier(0.22,1,0.36,1) both' }}
        >
          <button onClick={onClose} style={{ position:'absolute', top:14, right:16, background:'none', border:'none', color:'#475569', fontSize:22, cursor:'pointer', lineHeight:1, padding:4 }}
            onMouseEnter={e => { e.currentTarget.style.color='#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color='#475569'; }}
          >✕</button>

          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', color:ORANGE, textTransform:'uppercase', margin:'0 0 14px' }}>Przelewy24</p>
          <p style={{ fontSize:15, fontWeight:800, color:'#fff', margin:'0 0 4px', lineHeight:1.4 }}>{service.name}</p>
          <div style={{ display:'flex', alignItems:'baseline', gap:5, margin:'0 0 24px' }}>
            <span style={{ fontSize:40, fontWeight:900, color:ORANGE, letterSpacing:'-0.04em', lineHeight:1 }}>{amountZl}</span>
            <span style={{ fontSize:20, fontWeight:900, color:ORANGE }}>PLN</span>
          </div>

          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#94a3b8', marginBottom:6 }}>Email для чеку</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && pay()}
            placeholder="example@gmail.com" autoFocus
            style={{ width:'100%', padding:'11px 14px', borderRadius:10, fontSize:14, border:`1.5px solid ${error ? '#ef4444' : '#1e293b'}`, background:'#1e293b', color:'#fff', outline:'none', fontFamily:'inherit', boxSizing:'border-box', marginBottom: error ? 6 : 16 }}
          />
          {error && <p style={{ fontSize:12, color:'#ef4444', margin:'0 0 12px' }}>{error}</p>}

          <label style={{ display:'flex', gap:10, alignItems:'flex-start', cursor:'pointer', margin:'0 0 16px', userSelect:'none' }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              style={{ marginTop:3, accentColor:ORANGE, width:16, height:16, flexShrink:0, cursor:'pointer' }}
            />
            <span style={{ fontSize:12, color:'#64748b', lineHeight:1.6 }}>
              Я ознайомився та погоджуюсь з{' '}
              <Link to="/regulamin" onClick={e => e.stopPropagation()} style={{ color:ORANGE, textDecoration:'none', fontWeight:600 }}>Regulamin</Link>
            </span>
          </label>

          <button onClick={pay} disabled={loading || !agreed}
            style={{ width:'100%', padding:'13px 0', borderRadius:10, border:'none', cursor: loading || !agreed ? 'not-allowed' : 'pointer', background: loading || !agreed ? '#1e293b' : ORANGE, color: loading || !agreed ? '#475569' : '#fff', fontWeight:700, fontSize:14, fontFamily:'inherit', transition:'background 0.15s' }}
          >
            {loading ? 'Перенаправлення...' : 'Перейти до оплати →'}
          </button>
          <p style={{ fontSize:10, color:'#334155', textAlign:'center', margin:'10px 0 0' }}>🔒 Безпечна оплата · Przelewy24 · SSL</p>
        </div>
      </div>
    </>
  );
}

function PriceRow({ row, onBuy, isEven }) {
  const isFixed = row.amountGrosze !== null;
  const isFree = row.price === 'Безкоштовно';

  const handleWhatsApp = async () => {
    if (supabase) await supabase.from('leads').insert({ service: row.name, source: 'pricing-page' }).catch(() => {});
    window.open(`https://wa.me/48729271848?text=${encodeURIComponent(`Цікавить послуга: ${row.name}`)}`, '_blank');
  };

  return (
    <tr style={{ background: isEven ? 'rgba(0,0,0,0.02)' : 'transparent', borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '14px 16px', fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{row.name}</td>
      <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 700, color: isFree ? '#059669' : NAVY }}>
        {isFree ? row.price : isFixed ? `${row.price} zł` : row.price}
      </td>
      <td style={{ padding: '14px 16px 14px 8px', textAlign: 'right', whiteSpace: 'nowrap' }}>
        {isFree ? (
          <Link to="/blog" style={{ fontSize: 12, color: '#059669', fontWeight: 600, textDecoration: 'none' }}>
            Читати →
          </Link>
        ) : isFixed ? (
          <button onClick={() => onBuy(row)}
            style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: ORANGE, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', transition: 'opacity 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.82'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Купити
          </button>
        ) : (
          <button onClick={handleWhatsApp}
            style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'transparent', color: '#64748b', fontWeight: 600, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
          >
            Записатися
          </button>
        )}
      </td>
    </tr>
  );
}

export default function PricingPage() {
  const [payService, setPayService] = useState(null);

  return (
    <div className="min-h-screen bg-white text-navy">
      <Header />

      <main style={{ paddingTop: 96 }}>
        {/* Hero */}
        <section style={{ background: NAVY, padding: 'clamp(48px,8vw,80px) 24px clamp(40px,6vw,64px)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: ORANGE, textTransform: 'uppercase', margin: '0 0 14px', fontFamily: "'Syne', sans-serif" }}>
            Прозоро · Без прихованих платежів
          </p>
          <h1 style={{ fontSize: 'clamp(38px,7vw,64px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 20px', color: '#fff', fontFamily: "'Syne', sans-serif" }}>
            Послуги та Ціни
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.7, fontFamily: "'Syne', sans-serif" }}>
            Юридична година — базова одиниця взаємодії зі спеціалістом. Охоплює консультації, аналіз ситуації,
            підготовку документів, формування стратегії та підготовку до подачі чи співбесіди.
          </p>
          {/* Base unit card */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: 'rgba(249,115,22,0.12)', border: '1.5px solid rgba(249,115,22,0.35)', borderRadius: 16, padding: '18px 28px', fontFamily: "'Syne', sans-serif" }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px' }}>Юридична година</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 44, fontWeight: 900, color: ORANGE, letterSpacing: '-0.04em', lineHeight: 1 }}>450</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: ORANGE }}>zł</span>
                <span style={{ fontSize: 12, color: '#64748b', marginLeft: 4 }}>≈ 105 €</span>
              </div>
            </div>
            <button
              onClick={() => setPayService({ name: 'Юридична година', amountGrosze: 45000 })}
              style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: ORANGE, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              Купити →
            </button>
          </div>
        </section>

        {/* Categories */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '56px 24px 80px' }}>
          {CATEGORIES.map(cat => (
            <div key={cat.id} style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 22 }}>{cat.icon}</span>
                <h2 style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: NAVY, margin: 0, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>
                  {cat.title}
                </h2>
                {cat.free && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(5,150,105,0.1)', color: '#059669', letterSpacing: '0.08em' }}>
                    В БЛОЗІ
                  </span>
                )}
              </div>

              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <colgroup>
                    <col style={{ width: '55%' }} />
                    <col style={{ width: '25%' }} />
                    <col style={{ width: '20%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Послуга</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ціна</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.rows.map((row, i) => (
                      <PriceRow key={i} row={row} isEven={i % 2 === 0} onBuy={setPayService} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Note */}
          <div style={{ background: '#fff7ed', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: '16px 20px', fontSize: 13, color: '#92400e', lineHeight: 1.7 }}>
            <strong>Важливо:</strong> Ціни позначені «Індивідуально» розраховуються партнерською фірмою у кожному випадку залежно від обставин. Ми не продаємо черги в консульство та не торгуємо запрошеннями.
          </div>
        </section>

        {/* WhatsApp CTA */}
        <section style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 8px', fontFamily: "'Syne', sans-serif" }}>
            Не знаєте з чого почати?
          </p>
          <h3 style={{ fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 800, color: NAVY, margin: '0 0 20px', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>
            Перші 2 хвилини — безкоштовно
          </h3>
          <a
            href="https://wa.me/48729271848"
            target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 12, background: '#25d366', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: "'Syne', sans-serif", transition: 'opacity 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            💬 Написати у WhatsApp
          </a>
        </section>

        {/* Company info */}
        <section style={{ borderTop: '1px solid #e2e8f0', padding: '32px 24px', textAlign: 'center', background: '#fff' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#64748b', margin: '0 0 6px', fontFamily: "'Syne', sans-serif" }}>DOMUS V Sp. z o.o.</p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.8 }}>
            NIP: 5223350030 · KRS: 0001198474<br />
            ul. Dzieci Warszawy 27, 02-495 Warszawa<br />
            Nr konta: <span style={{ fontFamily: 'monospace', letterSpacing: '0.04em' }}>10 1050 1025 1000 0090 8594 6938</span>
          </p>
        </section>
      </main>

      <Footer />
      {/* <CookieBanner /> */}

      {payService && <PayModal service={payService} onClose={() => setPayService(null)} />}
    </div>
  );
}
