'use client';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

const ORANGE = '#f97316';
const END_DATE = new Date('2026-06-06T23:59:59');

function useCountdown() {
  const [days, setDays] = useState(0);
  useEffect(() => {
    const calc = () => {
      const diff = END_DATE.getTime() - Date.now();
      setDays(Math.max(0, Math.ceil(diff / 86400000)));
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, []);
  return days;
}

export default function PromoSection() {
  const days = useCountdown();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'info' | 'pay'>('info');
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  const pay = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Введіть коректний email'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 30000,
          description: 'Акція Прискорення — 1 юридична година (вивід на комітет рішень)',
          email,
          lang: locale,
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) { window.location.href = data.redirectUrl; }
      else { setError(data.error || "Помилка з'єднання. Спробуйте ще раз."); setLoading(false); }
    } catch {
      setError("Помилка з'єднання. Спробуйте ще раз.");
      setLoading(false);
    }
  };

  return (
    <section
      id="promo"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(56px, 8vw, 96px) 24px',
      }}
    >
      <style>{`
        @keyframes ps-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0.4)} 50%{box-shadow:0 0 0 10px rgba(249,115,22,0)} }
        @keyframes ps-in { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* decorative blobs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.10), transparent)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', animation: 'ps-in 0.5s ease both' }}>

        {/* top badge row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 24, justifyContent: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: ORANGE, color: '#fff', fontWeight: 800,
            fontSize: 11, letterSpacing: '0.12em', padding: '6px 14px',
            borderRadius: 999, textTransform: 'uppercase',
            animation: 'ps-pulse 2s infinite',
          }}>
            ● АКЦІЯ
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.06em' }}>
            ДО 06.06.2026 · ЗАЛИШИЛОСЬ {days} {days === 1 ? 'ДЕНЬ' : days < 5 ? 'ДНІ' : 'ДНІВ'}
          </span>
        </div>

        {/* headline */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(32px, 6vw, 60px)',
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: '#fff',
          textAlign: 'center',
          margin: '0 0 8px',
        }}>
          Прискорення{' '}
          <span style={{ color: ORANGE, fontStyle: 'italic' }}>вивід на комітет</span>
        </h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 15, margin: '0 0 32px' }}>
          1 юридична година · персональний супровід вашої справи
        </p>

        {/* price block */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#64748b', marginBottom: 2 }}>Звичайна ціна</span>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#475569', textDecoration: 'line-through' }}>450 zł</span>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: ORANGE, fontWeight: 700, marginBottom: 2 }}>Акційна ціна</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 64, fontWeight: 900, color: ORANGE, letterSpacing: '-0.04em', lineHeight: 1 }}>300</span>
              <span style={{ fontSize: 30, fontWeight: 700, color: ORANGE }}>zł</span>
            </div>
          </div>
          <div style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Економія</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: ORANGE }}>−150 zł</div>
          </div>
        </div>

        {/* selling points */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 36 }}>
          {[
            { icon: '🔁', text: 'Більшість наших клієнтів повертаються повторно' },
            { icon: '⚡', text: 'Сучасний сервіс — привертаємо увагу до вашої справи' },
            { icon: '✅', text: 'Вигідно, якісно, з результатом — переконайтесь самі' },
            { icon: '🎯', text: 'Захочете замовити наступну послугу — це закономірно' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {step === 'info' && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStep('pay')}
              style={{
                background: ORANGE, color: '#fff', fontWeight: 700, fontSize: 15,
                padding: '14px 32px', borderRadius: 12, border: 'none',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 24px rgba(249,115,22,0.35)',
              }}
            >
              Встигніть до 06.06 — замовити за 300 zł →
            </button>
            <a
              href="https://wa.me/48729271848"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                border: '1.5px solid rgba(255,255,255,0.15)', color: '#cbd5e1',
                fontWeight: 600, fontSize: 14, padding: '14px 28px',
                borderRadius: 12, textDecoration: 'none', fontFamily: 'inherit',
              }}
            >
              WhatsApp — запитати
            </a>
          </div>
        )}

        {step === 'pay' && (
          <div style={{ maxWidth: 400, margin: '0 auto', background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '28px 24px', border: '1px solid rgba(249,115,22,0.2)' }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: '0 0 4px' }}>Оплата онлайн</p>
            <p style={{ color: ORANGE, fontWeight: 800, fontSize: 22, margin: '0 0 20px' }}>300 PLN · Акція до 06.06.2026</p>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Email для чеку</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && pay()}
              placeholder="example@gmail.com" autoFocus
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, border: `1.5px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.08)', color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: error ? 6 : 14 }}
            />
            {error && <p style={{ fontSize: 12, color: '#ef4444', margin: '0 0 12px' }}>{error}</p>}
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', margin: '0 0 14px', userSelect: 'none' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3, accentColor: ORANGE, width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                Погоджуюсь з{' '}
                <a href="/regulamin" target="_blank" rel="noreferrer" style={{ color: ORANGE, textDecoration: 'none', fontWeight: 600 }}>Regulamin</a>
              </span>
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setStep('info'); setError(''); setEmail(''); }} style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                ← Назад
              </button>
              <button onClick={pay} disabled={loading || !agreed} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: 'none', cursor: loading || !agreed ? 'not-allowed' : 'pointer', background: loading || !agreed ? 'rgba(255,255,255,0.05)' : ORANGE, color: loading || !agreed ? '#475569' : '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'inherit' }}>
                {loading ? 'Перенаправлення...' : 'Перейти до оплати →'}
              </button>
            </div>
            <p style={{ fontSize: 10, color: '#334155', textAlign: 'center', margin: '10px 0 0' }}>🔒 Bezpieczna płatność · Przelewy24 · SSL</p>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 11, color: '#334155', margin: '20px 0 0', letterSpacing: '0.04em' }}>
          🛡️ ГАРАНТІЯ ПОВЕРНЕННЯ КОШТІВ · ЦІНА ФІКСОВАНА ДО 06.06.2026
        </p>
      </div>
    </section>
  );
}
