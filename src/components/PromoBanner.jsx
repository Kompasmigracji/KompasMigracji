import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ORANGE = '#f97316';
const MINT   = '#86efac';

const FEATURES = [
  'Скарга на бездіяльність уженду',
  'Унікальний пакет документів',
  'Результат за 6 тижнів — або суд',
];

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>5.0 · GoWork.pl</span>
    </div>
  );
}

export default function PromoBanner() {
  const [visible, setVisible]     = useState(false);
  const [step, setStep]           = useState('promo'); // 'promo' | 'pay'
  const [email, setEmail]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [agreed, setAgreed]       = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
    setStep('promo');
    setEmail('');
    setError('');
    setLoading(false);
    setAgreed(false);
    setTimeout(() => setVisible(true), 120000);
  };

  const pay = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Введіть коректний email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 45000, description: 'Пакет Прискорення — Карта побуту', email, lang: 'ua' }),
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

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes pb-backdrop { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pb-card     { from { opacity: 0; transform: translateY(28px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>

      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.62)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
          animation: 'pb-backdrop 0.3s ease both',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#0f172a',
            borderRadius: 22,
            padding: 'clamp(28px,5vw,44px) clamp(24px,5vw,40px)',
            maxWidth: 520, width: '100%',
            position: 'relative',
            border: '1px solid rgba(249,115,22,0.2)',
            fontFamily: "'Syne', sans-serif",
            animation: 'pb-card 0.38s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          {/* Close */}
          <button
            onClick={close}
            aria-label="Закрити"
            style={{
              position: 'absolute', top: 14, right: 16,
              background: 'none', border: 'none',
              color: '#475569', fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
          >✕</button>

          {/* ── PROMO STEP ── */}
          {step === 'promo' && (
            <>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: ORANGE, textTransform: 'uppercase', margin: '0 0 12px' }}>
                ПОСЛУГА ПРИСКОРЕННЯ · 1 ЮРИДИЧНА ГОДИНА
              </p>

              <Stars />

              <h2 style={{ fontSize: 'clamp(30px,7vw,46px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', margin: '0 0 8px', color: '#fff' }}>
                Втомився
              </h2>
              <h2 style={{ fontSize: 'clamp(30px,7vw,46px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', margin: '0 0 20px', color: ORANGE }}>
                чекати?
              </h2>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '0 0 20px' }}>
                <span style={{ fontSize: 52, fontWeight: 900, color: ORANGE, letterSpacing: '-0.04em', lineHeight: 1 }}>450</span>
                <span style={{ fontSize: 28, fontWeight: 900, color: ORANGE, letterSpacing: '-0.02em' }}>ЗЛ</span>
                <span style={{ fontSize: 13, color: '#64748b', marginLeft: 4 }}>= 1 юридична година</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 26px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {FEATURES.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                    <span style={{ color: MINT, fontWeight: 800, flexShrink: 0 }}>→</span>{f}
                  </li>
                ))}
              </ul>

              {/* CTA buttons */}
              <button
                onClick={() => setStep('pay')}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 10, border: 'none',
                  background: ORANGE, color: '#fff',
                  fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
                  cursor: 'pointer', letterSpacing: '0.01em',
                  transition: 'opacity 0.15s', marginBottom: 10,
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                Купити зараз — 450 ЗЛ
              </button>

              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: '#334155', margin: '0 0 10px' }}>
                  Оплачуючи, ви погоджуєтесь з{' '}
                  <Link to="/regulamin" onClick={close} style={{ color: '#64748b', textDecoration: 'underline' }}>Regulamin</Link>
                </p>
              </div>

              <Link
                to="/karta"
                onClick={close}
                style={{
                  display: 'block', textAlign: 'center',
                  padding: '12px 0', borderRadius: 10,
                  border: '1.5px solid #1e293b',
                  color: '#475569', fontWeight: 600, fontSize: 13,
                  textDecoration: 'none', transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#334155'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; }}
              >
                Дізнатися більше →
              </Link>

              <p style={{ fontSize: 10, color: '#1e293b', textAlign: 'center', margin: '14px 0 0', letterSpacing: '0.04em' }}>
                🛡️ ГАРАНТІЯ ПОВЕРНЕННЯ КОШТІВ ЗА 1 ДЕНЬ
              </p>
            </>
          )}

          {/* ── PAY STEP ── */}
          {step === 'pay' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <button
                  onClick={() => { setStep('promo'); setError(''); setEmail(''); }}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0, display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  Назад
                </button>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: ORANGE, textTransform: 'uppercase' }}>Przelewy24</span>
              </div>

              <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                Пакет Прискорення
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, margin: '0 0 24px' }}>
                <span style={{ fontSize: 38, fontWeight: 900, color: ORANGE, letterSpacing: '-0.04em', lineHeight: 1 }}>450</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: ORANGE }}>PLN</span>
              </div>

              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
                Ваш email для чеку
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && pay()}
                placeholder="example@gmail.com"
                autoFocus
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
                  border: `1.5px solid ${error ? '#ef4444' : '#1e293b'}`,
                  background: '#1e293b', color: '#fff',
                  outline: 'none', fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  marginBottom: error ? 6 : 18,
                }}
              />
              {error && <p style={{ fontSize: 12, color: '#ef4444', margin: '0 0 14px' }}>{error}</p>}

              {/* Regulamin checkbox */}
              <label style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                cursor: 'pointer', margin: '0 0 14px', userSelect: 'none',
              }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  style={{ marginTop: 3, accentColor: ORANGE, width: 16, height: 16, flexShrink: 0, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                  Я ознайомився та погоджуюсь з{' '}
                  <Link
                    to="/regulamin"
                    onClick={e => e.stopPropagation()}
                    style={{ color: ORANGE, textDecoration: 'none', fontWeight: 600 }}
                  >
                    Regulamin
                  </Link>
                </span>
              </label>

              <button
                onClick={pay}
                disabled={loading || !agreed}
                style={{
                  width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
                  cursor: loading || !agreed ? 'not-allowed' : 'pointer',
                  background: loading || !agreed ? '#1e293b' : ORANGE,
                  color: loading || !agreed ? '#475569' : '#fff',
                  fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
                  transition: 'background 0.15s', marginBottom: 0,
                }}
              >
                {loading ? 'Перенаправлення...' : 'Перейти до оплати →'}
              </button>

              <p style={{ fontSize: 10, color: '#334155', textAlign: 'center', margin: '10px 0 0' }}>
                🔒 Безпечна оплата · Przelewy24 · SSL
              </p>
            </>
          )}

        </div>
      </div>
    </>
  );
}
