'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import P24PaymentSteps, { CartIcon, UserIcon, CardIcon, CheckCircleIcon } from '@/components/P24PaymentSteps';

const ORANGE = '#f97316';
const NAVY   = '#0f172a';

type ServiceRow = { name: string; price: string; amountGrosze: number | null; oldPrice?: string; free?: boolean };
type Category   = { id: string; title: string; icon: string; free?: boolean; rows: ServiceRow[] };

function useCategories(): Category[] {
  const t = useTranslations();
  return [
    {
      id: 'notary', title: t('pcat_notary'), icon: '✍️',
      rows: [
        { name: t('psvc_n1'),  price: '250', amountGrosze: 25000 },
        { name: t('psvc_n2'),  price: '350', amountGrosze: 35000 },
        { name: t('psvc_n3'),  price: '450', amountGrosze: 45000 },
        { name: t('psvc_n4'),  price: '450', amountGrosze: 45000 },
        { name: t('psvc_n5'),  price: '260', amountGrosze: 26000 },
        { name: t('psvc_n6'),  price: '380', amountGrosze: 38000 },
        { name: t('psvc_n7'),  price: '450', amountGrosze: 45000 },
        { name: t('psvc_n8'),  price: '720', amountGrosze: 72000 },
        { name: t('psvc_n9'),  price: '580', amountGrosze: 58000 },
        { name: t('psvc_n10'), price: '150', amountGrosze: 15000 },
      ],
    },
    {
      id: 'legalization', title: t('pcat_legalization'), icon: '🏠',
      rows: [
        { name: t('psvc_l1'),  price: '950', amountGrosze: 95000  },
        { name: t('psvc_l2'),  price: '1400', amountGrosze: 140000 },
        { name: t('psvc_l3'),  price: '800', amountGrosze: 80000  },
        { name: t('psvc_l4'),  price: '1800', amountGrosze: 180000 },
        { name: t('psvc_l5'),  price: '1800', amountGrosze: 180000 },
        { name: t('psvc_l6'),  price: '2000', amountGrosze: 200000 },
        { name: t('psvc_l7'),  price: '2500', amountGrosze: 250000 },
        { name: t('psvc_l8'),  price: '4000', amountGrosze: 400000 },
        { name: t('psvc_l9'),  price: '300', amountGrosze: 30000  },
        { name: t('psvc_l10'), price: '900', amountGrosze: 90000  },
        { name: t('psvc_l11'), price: '900', amountGrosze: 90000  },
        { name: t('psvc_l12'), price: '150', amountGrosze: 15000  },
        { name: t('psvc_l13'), price: '450', amountGrosze: 45000  },
      ],
    },
    {
      id: 'marriage', title: t('pcat_marriage'), icon: '💍',
      rows: [
        { name: t('psvc_m1'), price: '800', amountGrosze: 80000 },
        { name: t('psvc_m2'), price: '200–350',          amountGrosze: null },
        { name: t('psvc_m3'), price: '1800', amountGrosze: 180000 },
        { name: t('psvc_m4'), price: t('psvc_price_1_2h'), amountGrosze: null },
      ],
    },
    {
      id: 'translations', title: t('pcat_translations'), icon: '📄',
      rows: [
        { name: t('psvc_t1'), price: '100', amountGrosze: 10000 },
        { name: t('psvc_t2'), price: t('psvc_price_until_eval'), amountGrosze: null },
        { name: t('psvc_t3'), price: '25', amountGrosze: 2500 },
        { name: t('psvc_t4'), price: '35', amountGrosze: 3500 },
      ],
    },
    {
      id: 'bureaucracy', title: t('pcat_bureaucracy'), icon: '📋',
      rows: [
        { name: t('psvc_b1'), price: '800', amountGrosze: 80000 },
        { name: t('psvc_b2'), price: '450', amountGrosze: 45000 },
        { name: t('psvc_b3'), price: '150', amountGrosze: 15000 },
        { name: t('psvc_b4'), price: '150', amountGrosze: 15000 },
        { name: t('psvc_b5'), price: '150', amountGrosze: 15000 },
        { name: t('psvc_b6'), price: '150', amountGrosze: 15000 },
      ],
    },
    {
      id: 'legal', title: t('pcat_legal'), icon: '⚖️',
      rows: [
        { name: t('psvc_leg1'), price: t('psvc_price_individual'), amountGrosze: null },
        { name: t('psvc_leg2'), price: '1600', amountGrosze: 160000 },
        { name: t('psvc_leg3'), price: t('psvc_price_legal_h'),    amountGrosze: null },
        { name: t('psvc_leg4'), price: t('psvc_price_1_2h'),       amountGrosze: null },
        { name: t('psvc_leg5'), price: t('psvc_price_1_2h'),       amountGrosze: null },
        { name: t('psvc_leg6'), price: t('psvc_price_1_2h'),       amountGrosze: null },
        { name: t('psvc_leg7'), price: t('psvc_price_1_2h'),       amountGrosze: null },
        { name: t('psvc_leg8'), price: t('psvc_price_4h'),         amountGrosze: null },
      ],
    },
    {
      id: 'free', title: t('pcat_free'), icon: '🎁', free: true,
      rows: [
        { name: t('psvc_f1'), price: t('psvc_free_price'), amountGrosze: null, free: true },
        { name: t('psvc_f2'), price: t('psvc_free_price'), amountGrosze: null, free: true },
        { name: t('psvc_f3'), price: t('psvc_free_price'), amountGrosze: null, free: true },
        { name: t('psvc_f4'), price: t('psvc_free_price'), amountGrosze: null, free: true },
        { name: t('psvc_f5'), price: t('psvc_free_price'), amountGrosze: null, free: true },
      ],
    },
  ];
}

function ContactModal({ service, onClose }: { service: ServiceRow; onClose: () => void }) {
  const t = useTranslations();
  const waMsg = encodeURIComponent(`${t('pricing_modal_tag')}: ${service.name}`);
  return (
    <>
      <style>{`@keyframes cm-in { from { opacity:0; transform:translateY(20px) scale(0.97) } to { opacity:1; transform:none } }`}</style>
      <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
        <div onClick={e => e.stopPropagation()} style={{ background:NAVY, borderRadius:20, padding:'32px', maxWidth:400, width:'100%', position:'relative', border:'1px solid rgba(249,115,22,0.25)', fontFamily:"'Syne', sans-serif", animation:'cm-in 0.32s cubic-bezier(0.22,1,0.36,1) both' }}>
          <button onClick={onClose} style={{ position:'absolute', top:14, right:16, background:'none', border:'none', color:'#475569', fontSize:22, cursor:'pointer', lineHeight:1 }}>✕</button>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', color:ORANGE, textTransform:'uppercase', margin:'0 0 12px' }}>{t('pricing_modal_tag')}</p>
          <p style={{ fontSize:15, fontWeight:800, color:'#fff', margin:'0 0 8px', lineHeight:1.4 }}>{service.name}</p>
          <p style={{ fontSize:13, color: 'var(--text-muted)', margin:'0 0 20px', lineHeight:1.6 }}>{t('pricing_modal_desc')}</p>
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

const P24_RED    = '#D8232A';
const P24_GREEN  = '#44A649';
const P24_BORDER = '#DEE2E6';
const P24_BG     = '#F8F9FA';
const P24_TEXT   = '#212529';
const P24_MUTED  = '#6C757D';

function P24Logo() {
  return (
    <svg width="126" height="30" viewBox="0 0 126 30" fill="none" aria-label="Przelewy24">
      <rect width="126" height="30" rx="5" fill={P24_RED}/>
      <text x="63" y="21" textAnchor="middle" fill="#fff" fontFamily="'Arial Black',Arial,sans-serif" fontSize="13" fontWeight="900" letterSpacing="0.4">przelewy24</text>
    </svg>
  );
}

function PaymentBadges() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
      <svg width="44" height="22" viewBox="0 0 44 22" fill="none"><rect width="44" height="22" rx="3" fill="#E30613"/><text x="22" y="15" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="9" fontWeight="900">BLIK</text></svg>
      <svg width="44" height="22" viewBox="0 0 44 22" fill="none"><rect width="44" height="22" rx="3" fill="#fff" stroke="#DEE2E6"/><text x="22" y="15" textAnchor="middle" fill="#1A1F71" fontFamily="Arial" fontSize="11" fontWeight="900" letterSpacing="0.5">VISA</text></svg>
      <svg width="44" height="22" viewBox="0 0 44 22" fill="none"><rect width="44" height="22" rx="3" fill="#fff" stroke="#DEE2E6"/><circle cx="17" cy="11" r="7" fill="#EB001B"/><circle cx="27" cy="11" r="7" fill="#F79E1B"/><ellipse cx="22" cy="11" rx="3" ry="7" fill="#FF5F00"/></svg>
      <svg width="44" height="22" viewBox="0 0 44 22" fill="none"><rect width="44" height="22" rx="3" fill={P24_RED}/><text x="22" y="15" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="10" fontWeight="900">P24</text></svg>
    </div>
  );
}

function PayModal({ service, onClose }: { service: ServiceRow; onClose: () => void }) {
  const t = useTranslations();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [phone,     setPhone]     = useState('');
  const [email,     setEmail]     = useState('');
  const [channel,   setChannel]   = useState<Channel>('whatsapp');
  const [agreed,    setAgreed]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const amountZl = ((service.amountGrosze ?? 0) / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 });
  const hasCyrillic = /[а-яА-ЯіІїЇєЄ]/;

  const inp: React.CSSProperties = { width:'100%', padding:'10px 13px', borderRadius:7, fontSize:14, border:`1.5px solid ${P24_BORDER}`, background:'#fff', color:P24_TEXT, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s, box-shadow 0.15s' };
  const lbl: React.CSSProperties = { display:'block', fontSize:11, fontWeight:700, color:P24_MUTED, marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' };

  const pay = async () => {
    if (!firstName.trim() || firstName.trim().length < 2 || hasCyrillic.test(firstName)) { setError(t('pricing_err_firstname')); return; }
    if (!lastName.trim()  || lastName.trim().length  < 2 || hasCyrillic.test(lastName))  { setError(t('pricing_err_lastname'));  return; }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9)                             { setError(t('pricing_err_phone'));     return; }
    if (!email || !/\S+@\S+\.\S+/.test(email))                                            { setError(t('pricing_err_email'));     return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/payment', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ amount:service.amountGrosze, description:`${service.name} — Kompas Migracji`, email, firstName:firstName.trim(), lastName:lastName.trim(), phone:phone.trim(), lang:'uk', source:'pricing', contactChannel:channel }) });
      const data = await res.json();
      if (data.redirectUrl) { window.location.href = data.redirectUrl; }
      else { setError(data.error || t('pricing_err_connection')); setLoading(false); }
    } catch { setError(t('pricing_err_connection')); setLoading(false); }
  };

  return (
    <>
      <style>{`
        @keyframes pm-in { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:none} }
        .p24-inp:focus { border-color:${P24_GREEN} !important; box-shadow:0 0 0 3px rgba(68,166,73,0.18) !important; }
        .p24-ch:hover  { border-color:${P24_GREEN} !important; }
        .p24-pay:hover:not(:disabled) { filter:brightness(1.07); }
      `}</style>
      <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(15,23,42,0.72)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, overflowY:'auto' }}>
        <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:12, maxWidth:460, width:'100%', overflow:'hidden', fontFamily:"'Syne',sans-serif", animation:'pm-in 0.3s cubic-bezier(0.22,1,0.36,1) both', margin:'auto', boxShadow:'0 24px 80px rgba(0,0,0,0.35)' }}>
          <div style={{ background:'#fff', borderBottom:`1px solid ${P24_BORDER}`, padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <P24Logo />
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:P24_MUTED, fontWeight:600 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={P24_GREEN} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Bezpieczna płatność
            </div>
            <button onClick={onClose} style={{ background:'none', border:'none', color:'#9CA3AF', fontSize:20, cursor:'pointer', lineHeight:1, padding:'2px 4px', marginLeft:'auto' }} onMouseEnter={e => { e.currentTarget.style.color = P24_TEXT; }} onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; }}>✕</button>
          </div>

          <div style={{ padding:'20px 24px 0' }}>
            <div style={{ background:P24_BG, border:`1px solid ${P24_BORDER}`, borderRadius:8, padding:'14px 16px', marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:700, color:P24_MUTED, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Kompas Migracji</div>
              <div style={{ fontSize:14, fontWeight:700, color:P24_TEXT, marginBottom:10, lineHeight:1.4 }}>{service.name}</div>
              {service.oldPrice && (
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:13, color:'#9CA3AF', textDecoration:'line-through' }}>{service.oldPrice} PLN</span>
                  <span style={{ fontSize:10, fontWeight:800, color:'#fff', background:'#22C55E', padding:'2px 7px', borderRadius:20 }}>−30%</span>
                </div>
              )}
              <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                <span style={{ fontSize:34, fontWeight:900, color:P24_RED, letterSpacing:'-0.03em', lineHeight:1 }}>{amountZl}</span>
                <span style={{ fontSize:17, fontWeight:800, color:P24_RED }}>PLN</span>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              <div><label style={lbl}>{t('pricing_lbl_firstname')}</label><input className="p24-inp" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ivan" autoFocus style={inp} /></div>
              <div><label style={lbl}>{t('pricing_lbl_lastname')}</label><input className="p24-inp" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Petrenko" style={inp} /></div>
            </div>

            <label style={{ ...lbl, marginBottom:5 }}>{t('pricing_lbl_phone')}</label>
            <input className="p24-inp" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+48 123 456 789" style={{ ...inp, marginBottom:12 }} />

            <label style={{ ...lbl, marginBottom:8 }}>{t('pricing_lbl_channel')}</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7, marginBottom:12 }}>
              {CHANNELS.map(ch => {
                const active = channel === ch.id;
                return (
                  <button key={ch.id} type="button" className="p24-ch" onClick={() => setChannel(ch.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'9px 4px', borderRadius:8, cursor:'pointer', border:`2px solid ${active ? P24_GREEN : P24_BORDER}`, background:active ? 'rgba(68,166,73,0.08)' : '#fff', color:active ? P24_GREEN : P24_MUTED, fontFamily:'inherit', transition:'all 0.15s' }}>
                    <span style={{ fontSize:17, lineHeight:1 }}>{ch.icon}</span>
                    <span style={{ fontSize:10, fontWeight:700 }}>{ch.label}</span>
                  </button>
                );
              })}
            </div>

            <label style={{ ...lbl, marginBottom:5 }}>{t('pricing_lbl_email')}</label>
            <input className="p24-inp" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && pay()} placeholder="example@gmail.com" style={{ ...inp, marginBottom: error ? 6 : 14 }} />
            {error && <p style={{ fontSize:12, color:'#DC2626', margin:'0 0 10px', display:'flex', alignItems:'center', gap:5 }}>⚠ {error}</p>}

            <label style={{ display:'flex', gap:10, alignItems:'flex-start', cursor:'pointer', margin:'0 0 16px', userSelect:'none' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop:3, accentColor:P24_GREEN, width:16, height:16, flexShrink:0, cursor:'pointer' }} />
              <span style={{ fontSize:12, color:P24_MUTED, lineHeight:1.6 }}>
                {t('pricing_lbl_agree').split('Regulamin')[0]}
                <Link href="/regulamin" onClick={e => e.stopPropagation()} style={{ color:P24_GREEN, textDecoration:'none', fontWeight:700 }}>Regulamin</Link>
                {t('pricing_lbl_agree').split('Regulamin')[1]}
              </span>
            </label>

            <button className="p24-pay" onClick={pay} disabled={loading || !agreed} style={{ width:'100%', padding:'13px 0', borderRadius:8, border:'none', cursor:loading || !agreed ? 'not-allowed' : 'pointer', background:loading || !agreed ? '#E9ECEF' : P24_GREEN, color:loading || !agreed ? '#9CA3AF' : '#fff', fontWeight:800, fontSize:15, fontFamily:'inherit', transition:'filter 0.15s', letterSpacing:'0.01em' }}>
              {loading
                ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><svg style={{ animation:'spin 0.8s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>{t('pricing_pay_loading')}</span>
                : t('pricing_pay_btn')}
            </button>
          </div>

          <div style={{ background:P24_BG, borderTop:`1px solid ${P24_BORDER}`, padding:'12px 24px', marginTop:20, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <PaymentBadges />
            <span style={{ fontSize:10, color:'#9CA3AF', display:'flex', alignItems:'center', gap:4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={P24_GREEN} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Szyfrowanie SSL 256-bit · Przelewy24 sp. z o.o. · licencja KNF
            </span>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

function PriceRow({ row, onBuy, onContact, isEven }: { row: ServiceRow; onBuy: (r: ServiceRow) => void; onContact: (r: ServiceRow) => void; isEven: boolean }) {
  const t = useTranslations();
  const isFixed = row.amountGrosze !== null && row.amountGrosze > 0;
  const isFree  = row.free === true;

  return (
    <tr style={{ background:isEven ? 'rgba(0,0,0,0.02)' : 'transparent', borderBottom:'1px solid var(--border)' }}>
      <td style={{ padding:'14px 16px', fontSize:13, color: 'var(--text-main)', lineHeight:1.5 }}>{row.name}</td>
      <td style={{ padding:'10px 16px', textAlign:'right', whiteSpace:'nowrap' }}>
        {isFree ? (
          <span style={{ fontSize:14, fontWeight:700, color:'#059669' }}>{row.price}</span>
        ) : row.oldPrice ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ fontSize:10, fontWeight:700, background:'rgba(34,197,94,0.13)', color:'#059669', padding:'1px 6px', borderRadius:20 }}>−30%</span>
              <span style={{ fontSize:12, color:'#94a3b8', textDecoration:'line-through' }}>{row.oldPrice} zł</span>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:2 }}>
              <span style={{ fontSize:22, fontWeight:900, color:ORANGE, letterSpacing:'-0.03em', lineHeight:1 }}>{row.price}</span>
              <span style={{ fontSize:12, fontWeight:700, color:ORANGE }}>zł</span>
            </div>
          </div>
        ) : (
          <span style={{ fontSize:14, fontWeight:700, color: 'var(--text-main)' }}>
            {(isFixed || row.price.includes('–')) ? `${row.price} zł` : row.price}
          </span>
        )}
      </td>
      <td style={{ padding:'14px 16px 14px 8px', textAlign:'right', whiteSpace:'nowrap' }}>
        {isFree ? (
          <a href="/blog" style={{ fontSize:12, color:'#059669', fontWeight:600, textDecoration:'none' }}>{t('pricing_btn_read')}</a>
        ) : isFixed ? (
          <button onClick={() => onBuy(row)} style={{ padding:'8px 20px', borderRadius:9, border:'none', background:ORANGE, color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', transition:'transform 0.12s, box-shadow 0.12s', boxShadow:'0 2px 8px rgba(249,115,22,0.35)' }} onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(249,115,22,0.5)'; }} onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(249,115,22,0.35)'; }}>
            {t('pricing_btn_buy')}
          </button>
        ) : (
          <button onClick={() => onContact(row)} style={{ padding:'6px 14px', borderRadius:8, border:'1.5px solid #e2e8f0', background:'transparent', color: 'var(--text-muted)', fontWeight:600, fontSize:12, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', transition:'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.borderColor=ORANGE; e.currentTarget.style.color=ORANGE; }} onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.color='#64748b'; }}>
            {t('pricing_btn_contact')}
          </button>
        )}
      </td>
    </tr>
  );
}

export default function PricingPage() {
  const t = useTranslations();
  const CATEGORIES = useCategories();
  const [payService,     setPayService]     = useState<ServiceRow | null>(null);
  const [contactService, setContactService] = useState<ServiceRow | null>(null);

  return (
    <div className="min-h-screen bg-white text-navy">
      <Header />
      <main style={{ paddingTop:96 }}>

        {/* Hero */}
        <section style={{ background:NAVY, padding:'clamp(48px,8vw,80px) 24px clamp(40px,6vw,64px)', textAlign:'center' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.15em', color:ORANGE, textTransform:'uppercase', margin:'0 0 14px', fontFamily:"'Syne', sans-serif" }}>
            {t('pricing_hero_tag')}
          </p>
          <h1 style={{ fontSize:'clamp(38px,7vw,64px)', fontWeight:900, letterSpacing:'-0.04em', lineHeight:1.05, margin:'0 0 20px', color:'#fff', fontFamily:"'Syne', sans-serif" }}>
            {t('pricing_hero_h1')}
          </h1>
          <p style={{ fontSize:15, color:'#94a3b8', maxWidth:600, margin:'0 auto 32px', lineHeight:1.7, fontFamily:"'Syne', sans-serif" }}>
            {t('pricing_hero_sub')}
          </p>
          <div style={{ position:'relative', display:'inline-block' }}>
            
            <div style={{ display:'inline-flex', alignItems:'center', gap:16, background:'rgba(249,115,22,0.12)', border:'1.5px solid rgba(249,115,22,0.35)', borderRadius:16, padding:'20px 28px 18px', fontFamily:"'Syne', sans-serif" }}>
              <div style={{ textAlign:'left' }}>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#94a3b8', margin:'0 0 6px' }}>{t('pricing_hero_product')}</p>
                
                <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                  <span style={{ fontSize:44, fontWeight:900, color:ORANGE, letterSpacing:'-0.04em', lineHeight:1 }}>450</span>
                  <span style={{ fontSize:22, fontWeight:800, color:ORANGE }}>zł</span>
                  <span style={{ fontSize:12, color: 'var(--text-muted)', marginLeft:4 }}>≈ 105 €</span>
                </div>
              </div>
              <button onClick={() => setPayService({ name: t('pricing_hero_product'), amountGrosze:45000, price:'450' })} style={{ padding:'12px 24px', borderRadius:10, border:'none', background:ORANGE, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', transition:'opacity 0.15s' }} onMouseEnter={e => { e.currentTarget.style.opacity='0.85'; }} onMouseLeave={e => { e.currentTarget.style.opacity='1'; }}>
                {t('pricing_hero_order')}
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section style={{ maxWidth:900, margin:'0 auto', padding:'56px 24px 80px' }}>
          {CATEGORIES.map(cat => (
            <div key={cat.id} id={cat.id} style={{ marginBottom:48, scrollMarginTop: 80 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <span style={{ fontSize:22 }}>{cat.icon}</span>
                <h2 style={{ fontSize:'clamp(18px,3vw,24px)', fontWeight:800, color: 'var(--text-main)', margin:0, fontFamily:"'Syne', sans-serif", letterSpacing:'-0.02em' }}>{cat.title}</h2>
                {cat.free && (
                  <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:'rgba(5,150,105,0.1)', color:'#059669', letterSpacing:'0.08em' }}>{t('pricing_in_blog')}</span>
                )}
              </div>
              <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid var(--border)', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <colgroup><col style={{ width:'55%' }}/><col style={{ width:'25%' }}/><col style={{ width:'20%' }}/></colgroup>
                  <thead>
                    <tr style={{ background: 'var(--bg-soft)', borderBottom:'2px solid var(--border)' }}>
                      <th style={{ padding:'10px 16px', textAlign:'left',  fontSize:11, fontWeight:700, color: 'var(--text-muted)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{t('pricing_col_service')}</th>
                      <th style={{ padding:'10px 16px', textAlign:'right', fontSize:11, fontWeight:700, color: 'var(--text-muted)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{t('pricing_col_price')}</th>
                      <th style={{ padding:'10px 8px',  textAlign:'right', fontSize:11, fontWeight:700, color: 'var(--text-muted)', letterSpacing:'0.08em', textTransform:'uppercase' }}></th>
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

          <div style={{ background:'#fff7ed', border:'1px solid rgba(249,115,22,0.2)', borderRadius:12, padding:'16px 20px', fontSize:13, color:'#92400e', lineHeight:1.7 }}>
            <strong>⚠</strong> {t('pricing_important')}
          </div>
        </section>

        {/* How payments work — Przelewy24 branded */}
        <P24PaymentSteps
          title={t('pricing_how_title')}
          steps={[
            { n:'01', icon:<CartIcon />,        title:t('pricing_step1_title'), desc:t('pricing_step1_desc') },
            { n:'02', icon:<UserIcon />,        title:t('pricing_step2_title'), desc:t('pricing_step2_desc') },
            { n:'03', icon:<CardIcon />,        title:t('pricing_step3_title'), desc:t('pricing_step3_desc') },
            { n:'04', icon:<CheckCircleIcon />, title:t('pricing_step4_title'), desc:t('pricing_step4_desc') },
          ]}
          securityNote={`${t('pricing_safe_title')} · ${t('pricing_safe_desc')}`}
        />

        {/* Company info */}
        <section style={{ borderTop:'1px solid #e2e8f0', padding:'32px 24px', textAlign:'center', background:'#fff' }}>
          <p style={{ fontSize:13, fontWeight:700, color: 'var(--text-muted)', margin:'0 0 6px', fontFamily:"'Syne', sans-serif" }}>DOMUS V Sp. z o.o.</p>
          <p style={{ fontSize:12, color:'#94a3b8', margin:0, lineHeight:1.8 }}>
            NIP: 5223350030 · KRS: 0001198474<br />
            ul. Dzieci Warszawy 27c/49, 02-495 Warszawa<br />
            Nr konta: <span style={{ fontFamily:'monospace', letterSpacing:'0.04em' }}>10 1050 1025 1000 0090 8594 6938</span>
          </p>
        </section>
      </main>
      <Footer />
      {payService     && <PayModal     service={payService}     onClose={() => setPayService(null)} />}
      {contactService && <ContactModal service={contactService} onClose={() => setContactService(null)} />}
    </div>
  );
}
