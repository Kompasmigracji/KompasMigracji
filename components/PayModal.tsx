'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

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

export interface PayService {
  name: string;
  amountGrosze: number;
  oldPrice?: string;
}

export default function PayModal({ service, onClose }: { service: PayService; onClose: () => void }) {
  const t = useTranslations();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [phone,     setPhone]     = useState('');
  const [email,     setEmail]     = useState('');
  const [channel,   setChannel]   = useState<Channel>('whatsapp');
  const [agreed,    setAgreed]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const amountZl = (service.amountGrosze / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2 });
  const hasCyrillic = /[а-яА-ЯіІїЇєЄ]/;

  const inp = {
    width: '100%', padding: '10px 13px', borderRadius: 7, fontSize: 14,
    border: `1.5px solid ${P24_BORDER}`, background: '#fff', color: P24_TEXT,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };
  const lbl = {
    display: 'block', fontSize: 11, fontWeight: 700, color: P24_MUTED,
    marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: '0.05em',
  };

  const pay = async () => {
    if (!firstName.trim() || firstName.trim().length < 2 || hasCyrillic.test(firstName)) { setError(t('pricing_err_firstname')); return; }
    if (!lastName.trim()  || lastName.trim().length  < 2 || hasCyrillic.test(lastName))  { setError(t('pricing_err_lastname'));  return; }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9)                             { setError(t('pricing_err_phone'));     return; }
    if (!email || !/\S+@\S+\.\S+/.test(email))                                            { setError(t('pricing_err_email'));     return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: service.amountGrosze,
          description: `${service.name} — Kompas Migracji`,
          email, firstName: firstName.trim(), lastName: lastName.trim(),
          phone: phone.trim(), lang: 'uk', source: 'pricing', contactChannel: channel,
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) { window.location.href = data.redirectUrl; }
      else { setError(data.error || t('pricing_err_connection')); setLoading(false); }
    } catch { setError(t('pricing_err_connection')); setLoading(false); }
  };

  return (
    <>
      <style>{`
        @keyframes pm-in { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:none} }
        @keyframes spin   { to { transform: rotate(360deg); } }
        .p24-inp:focus { border-color:${P24_GREEN} !important; box-shadow:0 0 0 3px rgba(68,166,73,0.18) !important; }
        .p24-ch:hover  { border-color:${P24_GREEN} !important; }
        .p24-pay:hover:not(:disabled) { filter:brightness(1.07); }
      `}</style>
      <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(15,23,42,0.72)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, overflowY:'auto' }}>
        <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:12, maxWidth:460, width:'100%', overflow:'hidden', fontFamily:"'Syne',sans-serif", animation:'pm-in 0.3s cubic-bezier(0.22,1,0.36,1) both', margin:'auto', boxShadow:'0 24px 80px rgba(0,0,0,0.35)' }}>

          {/* Header */}
          <div style={{ background:'#fff', borderBottom:`1px solid ${P24_BORDER}`, padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <P24Logo />
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:P24_MUTED, fontWeight:600 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={P24_GREEN} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Bezpieczna płatność
            </div>
            <button onClick={onClose} style={{ background:'none', border:'none', color:'#9CA3AF', fontSize:20, cursor:'pointer', lineHeight:1, padding:'2px 4px', marginLeft:'auto' }} onMouseEnter={e => { e.currentTarget.style.color = P24_TEXT; }} onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; }}>✕</button>
          </div>

          <div style={{ padding:'20px 24px 0' }}>
            {/* Service summary */}
            <div style={{ background:P24_BG, border:`1px solid ${P24_BORDER}`, borderRadius:8, padding:'14px 16px', marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:700, color:P24_MUTED, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Kompas Migracji</div>
              <div style={{ fontSize:14, fontWeight:700, color:P24_TEXT, marginBottom:10, lineHeight:1.4 }}>{service.name}</div>
              {service.oldPrice && (
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:13, color:'#9CA3AF', textDecoration:'line-through' }}>{service.oldPrice} PLN</span>
                  <span style={{ fontSize:10, fontWeight:800, color:'#fff', background:'#22C55E', padding:'2px 7px', borderRadius:20 }}>−33%</span>
                </div>
              )}
              <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                <span style={{ fontSize:34, fontWeight:900, color:P24_RED, letterSpacing:'-0.03em', lineHeight:1 }}>{amountZl}</span>
                <span style={{ fontSize:17, fontWeight:800, color:P24_RED }}>PLN</span>
              </div>
            </div>

            {/* Name fields */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              <div>
                <label style={lbl}>{t('pricing_lbl_firstname')}</label>
                <input className="p24-inp" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ivan" autoFocus style={inp} />
              </div>
              <div>
                <label style={lbl}>{t('pricing_lbl_lastname')}</label>
                <input className="p24-inp" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Petrenko" style={inp} />
              </div>
            </div>

            <label style={{ ...lbl, marginBottom:5 }}>{t('pricing_lbl_phone')}</label>
            <input className="p24-inp" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+48 123 456 789" style={{ ...inp, marginBottom:12 }} />

            {/* Preferred contact channel */}
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

          {/* Footer */}
          <div style={{ background:P24_BG, borderTop:`1px solid ${P24_BORDER}`, padding:'12px 24px', marginTop:20, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <PaymentBadges />
            <span style={{ fontSize:10, color:'#9CA3AF', display:'flex', alignItems:'center', gap:4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={P24_GREEN} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Szyfrowanie SSL 256-bit · Przelewy24 sp. z o.o. · licencja KNF
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
