'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ORANGE = '#f97316';
const NAVY   = '#0f172a';

const CATEGORIES = [
  {
    id: 'notary',
    title: 'Нотаріальні послуги',
    icon: '✍️',
    rows: [
      { name: 'Разова довіреність',                                   price: '175',      amountGrosze: 17500,  oldPrice: '250' },
      { name: 'Довіреність на транспортний засіб',                    price: '245',      amountGrosze: 24500,  oldPrice: '350' },
      { name: 'Довіреність на нерухомість',                           price: '315',      amountGrosze: 31500,  oldPrice: '450' },
      { name: 'Довіреність на представлення інтересів',               price: '315',      amountGrosze: 31500,  oldPrice: '450' },
      { name: 'Довіреність за участю неповнолітніх',                  price: '182',      amountGrosze: 18200,  oldPrice: '260' },
      { name: 'Заява',                                                price: '266',      amountGrosze: 26600,  oldPrice: '380' },
      { name: 'Довіреність на спадщину',                              price: '315',      amountGrosze: 31500,  oldPrice: '450' },
      { name: 'Комплект «Спадщина» (заява + довіреність)',            price: '504',      amountGrosze: 50400,  oldPrice: '720' },
      { name: 'Довіреність у фінансових установах / бізнес',          price: '406',      amountGrosze: 40600,  oldPrice: '580' },
      { name: 'Підбір адвоката або нотаріуса в Україні',               price: '105',      amountGrosze: 10500,  oldPrice: '150' },
    ],
  },
  {
    id: 'legalization',
    title: 'Легалізація побуту',
    icon: '🏠',
    rows: [
      { name: 'Часовий побут',                                        price: '665',      amountGrosze: 66500,  oldPrice: '950' },
      { name: 'Часовий побут (ускладнені обставини)',                 price: '980',      amountGrosze: 98000,  oldPrice: '1400' },
      { name: 'Часовий побут (діти)',                                 price: '560',      amountGrosze: 56000,  oldPrice: '800' },
      { name: 'Сталий побут',                                         price: '1260',     amountGrosze: 126000, oldPrice: '1800' },
      { name: 'Резидент ЄС',                                          price: '1260',     amountGrosze: 126000, oldPrice: '1800' },
      { name: 'Громадянство Польщі (Воєвода)',                        price: '1400',     amountGrosze: 140000, oldPrice: '2000' },
      { name: 'Громадянство Польщі (Президент)',                      price: '1750',     amountGrosze: 175000, oldPrice: '2500' },
      { name: 'Резидент + Громадянство',                              price: '2800',     amountGrosze: 280000, oldPrice: '4000' },
      { name: 'Прискорення карти побуту (вивід на комітет рішень)',   price: '210',      amountGrosze: 21000,  oldPrice: '300' },
      { name: 'Прискорення карти побуту (апеляція / складна справа)', price: '630',      amountGrosze: 63000,  oldPrice: '900' },
      { name: 'Прискорення Резидента ЄС',                             price: '630',      amountGrosze: 63000,  oldPrice: '900' },
      { name: 'Консультація телефонічна',                             price: '105',      amountGrosze: 10500,  oldPrice: '150' },
      { name: 'Консультація + узасаднення',                          price: '315',      amountGrosze: 31500,  oldPrice: '450' },
    ],
  },
  {
    id: 'marriage',
    title: 'Шлюб та сімейне право',
    icon: '💍',
    rows: [
      { name: 'Супровід по шлюбу',                                    price: '560',      amountGrosze: 56000,  oldPrice: '800' },
      { name: 'Довідка для шлюбу без консульства',                    price: '200–350',  amountGrosze: null },
      { name: 'Розлучення в Україні без присутності сторін',          price: '1260',     amountGrosze: 126000, oldPrice: '1800' },
      { name: 'Медіація між сторонами',                               price: '1–2 юридичні години', amountGrosze: null },
    ],
  },
  {
    id: 'translations',
    title: 'Переклади',
    icon: '📄',
    rows: [
      { name: 'Переклад (свідоцтва, посвідчення водія)',              price: '70',       amountGrosze: 7000,   oldPrice: '100' },
      { name: 'Індивідуальні тексти',                                 price: 'до оцінки', amountGrosze: null },
      { name: 'Доставка InPost',                                      price: '18',       amountGrosze: 1800,   oldPrice: '25' },
      { name: 'Доставка кур\'єром',                                    price: '25',       amountGrosze: 2500,   oldPrice: '35' },
    ],
  },
  {
    id: 'bureaucracy',
    title: 'Бюрократичні справи',
    icon: '📋',
    rows: [
      { name: 'Відновлення 800+',                                     price: '560',      amountGrosze: 56000,  oldPrice: '800' },
      { name: 'Розробка договору',                                    price: '315',      amountGrosze: 31500,  oldPrice: '450' },
      { name: 'Вичитка договору',                                     price: '105',      amountGrosze: 10500,  oldPrice: '150' },
      { name: 'Лист-запит до держустанови',                           price: '105',      amountGrosze: 10500,  oldPrice: '150' },
      { name: 'Підписання / розірвання договорів',                    price: '105',      amountGrosze: 10500,  oldPrice: '150' },
      { name: 'Нетипове резюме PL / ENG',                             price: '105',      amountGrosze: 10500,  oldPrice: '150' },
    ],
  },
  {
    id: 'legal',
    title: 'Юридичні послуги',
    icon: '⚖️',
    rows: [
      { name: 'Підготовка та подача документів (візи, дозволи)',      price: 'індивідуальна оцінка', amountGrosze: null },
      { name: 'Міжнародний захист',                                   price: '1120',     amountGrosze: 112000, oldPrice: '1600' },
      { name: 'Захист прав мігрантів',                                price: 'юридичні години', amountGrosze: null },
      { name: 'Медіація',                                             price: '1–2 юридичні години', amountGrosze: null },
      { name: 'Грошовий спір з роботодавцем',                        price: '1–2 юридичні години', amountGrosze: null },
      { name: 'Колекторський спір',                                   price: '1–2 юридичні години', amountGrosze: null },
      { name: 'Підготовка та аналіз бізнес-плану',                  price: '1–2 юридичні години', amountGrosze: null },
      { name: 'Аналіз ринку та пошук партнерів',                     price: '4 юридичні години',   amountGrosze: null },
    ],
  },
  {
    id: 'free',
    title: 'Безкоштовно',
    icon: '🎁',
    free: true,
    rows: [
      { name: 'Пошук роботи',              price: 'безкоштовно на цьому сайті в розділі «Блог»', amountGrosze: null },
      { name: 'Пошук житла',               price: 'безкоштовно на цьому сайті в розділі «Блог»', amountGrosze: null },
      { name: 'Інтеграція та дозвілля',    price: 'безкоштовно на цьому сайті в розділі «Блог»', amountGrosze: null },
      { name: 'Запобігання шахрайству',    price: 'безкоштовно на цьому сайті в розділі «Блог»', amountGrosze: null },
      { name: 'Фінансова сторона життя в імміграції',price: 'безкоштовно на цьому сайті в розділі «Блог»', amountGrosze: null },
    ],
  },
];

type ServiceRow = { name: string; price: string; amountGrosze: number | null; oldPrice?: string };

function ContactModal({ service, onClose }: { service: ServiceRow; onClose: () => void }) {
  const waMsg = encodeURIComponent(`Цікавить послуга: ${service.name}`);
  return (
    <>
      <style>{`@keyframes cm-in { from { opacity:0; transform:translateY(20px) scale(0.97) } to { opacity:1; transform:none } }`}</style>
      <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
        <div onClick={e => e.stopPropagation()} style={{ background:NAVY, borderRadius:20, padding:'32px', maxWidth:400, width:'100%', position:'relative', border:'1px solid rgba(249,115,22,0.25)', fontFamily:"'Syne', sans-serif", animation:'cm-in 0.32s cubic-bezier(0.22,1,0.36,1) both' }}>
          <button onClick={onClose} style={{ position:'absolute', top:14, right:16, background:'none', border:'none', color:'#475569', fontSize:22, cursor:'pointer', lineHeight:1 }}>✕</button>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', color:ORANGE, textTransform:'uppercase', margin:'0 0 12px' }}>Запис на послугу</p>
          <p style={{ fontSize:15, fontWeight:800, color:'#fff', margin:'0 0 8px', lineHeight:1.4 }}>{service.name}</p>
          <p style={{ fontSize:13, color:'#64748b', margin:'0 0 20px', lineHeight:1.6 }}>Ціна розраховується індивідуально. Оберіть зручний спосіб зв&apos;язку — і наш спеціаліст відповість протягом 2 годин:</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <a href={`https://wa.me/48729271848?text=${waMsg}`} target="_blank" rel="noreferrer"
              style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:10, background:'rgba(37,211,102,0.12)', border:'1px solid rgba(37,211,102,0.3)', textDecoration:'none', color:'#fff', fontWeight:600, fontSize:13 }}>
              <span style={{ fontSize:18 }}>💬</span> WhatsApp · +48 729 271 848
            </a>
            <a href="https://t.me/kompasmigracji" target="_blank" rel="noreferrer"
              style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:10, background:'rgba(41,182,246,0.12)', border:'1px solid rgba(41,182,246,0.3)', textDecoration:'none', color:'#fff', fontWeight:600, fontSize:13 }}>
              <span style={{ fontSize:18 }}>✈️</span> Telegram · @kompasmigracji
            </a>
            <a href="mailto:info@kompasmigracji.com"
              style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:10, background:'rgba(249,115,22,0.08)', border:'1px solid rgba(249,115,22,0.2)', textDecoration:'none', color:'#fff', fontWeight:600, fontSize:13 }}>
              <span style={{ fontSize:18 }}>📧</span> info@kompasmigracji.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

type Channel = 'whatsapp' | 'telegram' | 'viber' | 'email';

const CHANNELS: { id: Channel; icon: string; label: string }[] = [
  { id: 'whatsapp', icon: '💬', label: 'WhatsApp' },
  { id: 'telegram', icon: '✈️', label: 'Telegram' },
  { id: 'viber',    icon: '📳', label: 'Viber'    },
  { id: 'email',    icon: '📧', label: 'Email'    },
];

function PayModal({ service, onClose }: { service: ServiceRow; onClose: () => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [phone,     setPhone]     = useState('');
  const [email,     setEmail]     = useState('');
  const [channel,   setChannel]   = useState<Channel>('whatsapp');
  const [agreed,    setAgreed]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const amountZl = ((service.amountGrosze ?? 0) / 100).toLocaleString('uk-UA');
  const hasCyrillic = /[а-яА-ЯіІїЇєЄ]/;

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
    border: '1.5px solid #1e293b', background: '#1e293b', color: '#fff',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12,
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6,
  };

  const pay = async () => {
    if (!firstName.trim() || firstName.trim().length < 2 || hasCyrillic.test(firstName)) {
      setError("Введіть ім’я латиницею (напр. Ivan)");
      return;
    }
    if (!lastName.trim() || lastName.trim().length < 2 || hasCyrillic.test(lastName)) {
      setError('Введіть прізвище латиницею (напр. Petrenko)');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
      setError('Введіть контактний номер телефону');
      return;
    }
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
          firstName: firstName.trim(),
          lastName:  lastName.trim(),
          phone:     phone.trim(),
          lang:           'uk',
          source:         'pricing',
          contactChannel: channel,
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || "Помилка з’єднання. Спробуйте ще раз.");
        setLoading(false);
      }
    } catch {
      setError("Помилка з’єднання. Спробуйте ще раз.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`@keyframes pm-in { from { opacity:0; transform:translateY(20px) scale(0.97) } to { opacity:1; transform:none } }`}</style>
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, overflowY:'auto' }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{ background:NAVY, borderRadius:20, padding:'36px 32px', maxWidth:440, width:'100%', position:'relative', border:'1px solid rgba(249,115,22,0.25)', fontFamily:"'Syne', sans-serif", animation:'pm-in 0.32s cubic-bezier(0.22,1,0.36,1) both', margin:'auto' }}
        >
          <button onClick={onClose} style={{ position:'absolute', top:14, right:16, background:'none', border:'none', color:'#475569', fontSize:22, cursor:'pointer', lineHeight:1, padding:4 }}
            onMouseEnter={e => { e.currentTarget.style.color='#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color='#475569'; }}
          >✕</button>

          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', color:ORANGE, textTransform:'uppercase', margin:'0 0 14px' }}>Przelewy24</p>
          <p style={{ fontSize:15, fontWeight:800, color:'#fff', margin:'0 0 4px', lineHeight:1.4 }}>{service.name}</p>
          {service.oldPrice && (
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <span style={{ fontSize:16, color:'#475569', textDecoration:'line-through' }}>{service.oldPrice} PLN</span>
              <span style={{ fontSize:11, fontWeight:700, color:'#22c55e', background:'rgba(34,197,94,0.12)', padding:'2px 8px', borderRadius:20 }}>−30%</span>
            </div>
          )}
          <div style={{ display:'flex', alignItems:'baseline', gap:5, margin:'0 0 20px' }}>
            <span style={{ fontSize:40, fontWeight:900, color:ORANGE, letterSpacing:'-0.04em', lineHeight:1 }}>{amountZl}</span>
            <span style={{ fontSize:20, fontWeight:900, color:ORANGE }}>PLN</span>
          </div>

          {/* Ім'я */}
          <label style={lbl}>Ім&apos;я (латиницею)</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
            placeholder="Ivan" autoFocus style={inp} />

          {/* Прізвище */}
          <label style={lbl}>Прізвище (латиницею)</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
            placeholder="Petrenko" style={inp} />

          {/* Телефон */}
          <label style={lbl}>Контактний телефон</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="+48 123 456 789" style={inp} />

          {/* Канал зв'язку */}
          <label style={{ ...lbl, marginBottom: 8 }}>Зручний канал для зв&apos;язку зі спеціалістом</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
            {CHANNELS.map(ch => {
              const active = channel === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setChannel(ch.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '10px 4px', borderRadius: 10, cursor: 'pointer',
                    border: active ? `2px solid ${ORANGE}` : '2px solid #1e293b',
                    background: active ? 'rgba(249,115,22,0.12)' : '#1e293b',
                    color: active ? ORANGE : '#64748b',
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{ch.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>{ch.label}</span>
                </button>
              );
            })}
          </div>

          {/* Email */}
          <label style={lbl}>Email для чеку</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && pay()}
            placeholder="example@gmail.com"
            style={{ ...inp, marginBottom: error ? 6 : 16 }}
          />
          {error && <p style={{ fontSize:12, color:'#ef4444', margin:'0 0 12px' }}>{error}</p>}

          <label style={{ display:'flex', gap:10, alignItems:'flex-start', cursor:'pointer', margin:'0 0 16px', userSelect:'none' }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              style={{ marginTop:3, accentColor:ORANGE, width:16, height:16, flexShrink:0, cursor:'pointer' }}
            />
            <span style={{ fontSize:12, color:'#64748b', lineHeight:1.6 }}>
              Я ознайомився та погоджуюсь з{' '}
              <Link href="/regulamin" onClick={e => e.stopPropagation()} style={{ color:ORANGE, textDecoration:'none', fontWeight:600 }}>Regulamin</Link>
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

function PriceRow({ row, onBuy, onContact, isEven }: { row: ServiceRow; onBuy: (row: ServiceRow) => void; onContact: (row: ServiceRow) => void; isEven: boolean }) {
  const isFixed = row.amountGrosze !== null && row.amountGrosze > 0;
  const isFree = row.amountGrosze === null && row.price.toLowerCase().includes('безкоштовно');

  return (
    <tr style={{ background: isEven ? 'rgba(0,0,0,0.02)' : 'transparent', borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '14px 16px', fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{row.name}</td>
      <td style={{ padding: '10px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
        {isFree ? (
          <span style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>{row.price}</span>
        ) : row.oldPrice ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(34,197,94,0.13)', color: '#059669', padding: '1px 6px', borderRadius: 20 }}>−30%</span>
              <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>{row.oldPrice} zł</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: ORANGE, letterSpacing: '-0.03em', lineHeight: 1 }}>{row.price}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: ORANGE }}>zł</span>
            </div>
          </div>
        ) : (
          <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>
            {(isFixed || row.price.includes('–')) ? `${row.price} zł` : row.price}
          </span>
        )}
      </td>
      <td style={{ padding: '14px 16px 14px 8px', textAlign: 'right', whiteSpace: 'nowrap' }}>
        {isFree ? (
          <a href="/blog" style={{ fontSize: 12, color: '#059669', fontWeight: 600, textDecoration: 'none' }}>
            Читати →
          </a>
        ) : isFixed ? (
          <button onClick={() => onBuy(row)}
            style={{ padding: '8px 20px', borderRadius: 9, border: 'none', background: ORANGE, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', transition: 'transform 0.12s, box-shadow 0.12s', boxShadow: '0 2px 8px rgba(249,115,22,0.35)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(249,115,22,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(249,115,22,0.35)'; }}
          >
            Купити →
          </button>
        ) : (
          <button onClick={() => onContact(row)}
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
  const [payService,     setPayService]     = useState<ServiceRow | null>(null);
  const [contactService, setContactService] = useState<ServiceRow | null>(null);
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
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #f97316, #dc2626)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', padding: '3px 14px', borderRadius: 999, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
              АКЦІЯ · ДО 06.06.2026
            </span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: 'rgba(249,115,22,0.12)', border: '1.5px solid rgba(249,115,22,0.35)', borderRadius: 16, padding: '20px 28px 18px', fontFamily: "'Syne', sans-serif" }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 6px' }}>Юридична година</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#475569', textDecoration: 'line-through' }}>450 zł</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: ORANGE, letterSpacing: '-0.04em', lineHeight: 1 }}>300</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: ORANGE }}>zł</span>
                  <span style={{ fontSize: 12, color: '#64748b', marginLeft: 4 }}>≈ 70 €</span>
                </div>
              </div>
              <button
                onClick={() => setPayService({ name: 'Юридична година', amountGrosze: 30000, price: '300' })}
                style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: ORANGE, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                Замовити за 300 zł →
              </button>
            </div>
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
                      <PriceRow key={row.name + i} row={row} isEven={i % 2 === 0} onBuy={setPayService} onContact={setContactService} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div style={{ background: '#fff7ed', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: '16px 20px', fontSize: 13, color: '#92400e', lineHeight: 1.7 }}>
            <strong>Важливо:</strong> Ціни позначені «Індивідуально» розраховуються партнерською фірмою у кожному випадку залежно від обставин. Ми не продаємо черги в консульство та не торгуємо запрошеннями.
          </div>
        </section>

        {/* Jak działają płatności */}
        <section style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', padding: 'clamp(48px,7vw,72px) 24px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: ORANGE, textTransform: 'uppercase', margin: '0 0 12px', fontFamily: "'Syne', sans-serif", textAlign: 'center' }}>
              Jak działają płatności
            </p>
            <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: NAVY, margin: '0 0 48px', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em', textAlign: 'center' }}>
              Як працює процес оплати
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
              {[
                { step: '01', icon: '🛒', title: 'Вибір послуги', desc: 'Знайдіть потрібну послугу в таблиці і натисніть «Купити».' },
                { step: '02', icon: '👤', title: 'Дані клієнта', desc: 'Заповніть ім\'я, прізвище, телефон і email для чека — латиницею.' },
                { step: '03', icon: '💳', title: 'Оплата Przelewy24', desc: 'Безпечний платіж через Przelewy24 — картка, BLIK, переказ. SSL 256-bit.' },
                { step: '04', icon: '✅', title: 'Підтвердження', desc: 'Отримуєте email-чек, а спеціаліст зв\'яжеться протягом 2 годин.' },
              ].map(({ step, icon, title, desc }) => (
                <div key={step} style={{ background: '#fff', borderRadius: 16, padding: '24px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 16, right: 16, fontSize: 11, fontWeight: 800, color: '#e2e8f0', letterSpacing: '0.06em' }}>{step}</span>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: NAVY, margin: '0 0 8px', fontFamily: "'Syne', sans-serif" }}>{title}</p>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, background: '#fff', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>🔒</span>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: NAVY }}>Безпечна оплата</strong> · Przelewy24 — ліцензований платіжний оператор Польщі · Дані картки не зберігаються на нашому сервері · Шифрування SSL 256-bit
              </p>
            </div>
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 12px' }}>Є питання щодо оплати?</p>
              <a href="https://wa.me/48729271848" target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 10, background: '#25d366', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: "'Syne', sans-serif" }}>
                💬 WhatsApp · +48 729 271 848
              </a>
            </div>
          </div>
        </section>

        {/* Company info */}
        <section style={{ borderTop: '1px solid #e2e8f0', padding: '32px 24px', textAlign: 'center', background: '#fff' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#64748b', margin: '0 0 6px', fontFamily: "'Syne', sans-serif" }}>DOMUS V Sp. z o.o.</p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.8 }}>
            NIP: 5223350030 · KRS: 0001198474<br />
            ul. Dzieci Warszawy 27c/49, 02-495 Warszawa<br />
            Nr konta: <span style={{ fontFamily: 'monospace', letterSpacing: '0.04em' }}>10 1050 1025 1000 0090 8594 6938</span>
          </p>
        </section>
      </main>

      <Footer />

      {payService     && <PayModal     service={payService}     onClose={() => setPayService(null)} />}
      {contactService && <ContactModal service={contactService} onClose={() => setContactService(null)} />}
    </div>
  );
}
