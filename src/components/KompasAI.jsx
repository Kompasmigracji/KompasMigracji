import React, { useState, useEffect, useRef } from 'react';

const ORANGE = '#f97316';
const NAVY   = '#0f172a';

const FACTS = [
  {
    tag: '📋 Статус у Польщі',
    text: 'Тимчасовий захист для українців (UKR) продовжено до березня 2026 року. Якщо ви ще не оновили реєстрацію в UDSz — зробіть це негайно, щоб не втратити статус.',
  },
  {
    tag: '⏱️ Черги у воєводстві',
    text: 'У Варшаві середній час розгляду заяви на Картку побуту — 8–12 місяців. З юридичним супроводом Kompas Migracji цей термін скорочується до 4–6 тижнів.',
  },
  {
    tag: '💳 PESEL UKR',
    text: 'PESEL із позначкою UKR дає доступ до медичного страхування NFZ, дитячої допомоги 800+ та інших державних послуг Польщі. Оформте зараз — це безкоштовно.',
  },
  {
    tag: '⚖️ Зміни в законі 2025',
    text: 'З квітня 2025 року для зміни мети перебування потрібна особиста явка у воєводство за місцем реєстрації. Помилка в документах призводить до відмови та повторного очікування.',
  },
  {
    tag: '📊 Рекорд у цифрах',
    text: 'Понад 1,05 млн українців офіційно зареєстровані в Польщі. Черги у відділах легалізації зростають щомісяця — починайте процес якомога раніше.',
  },
  {
    tag: '🎓 Знання мови',
    text: 'Для постійної Картки побуту потрібно 5 років легального перебування та сертифікат польської на рівні B1. Kompas Migracji допоможе зібрати всі документи завчасно.',
  },
  {
    tag: '🚨 Порушення строків',
    text: 'Після змін 2024 року повторне порушення строків перебування в Польщі загрожує забороною в\'їзду до 5 років. Якщо ваші документи прострочені — зверніться до нас сьогодні.',
  },
  {
    tag: '🏫 Діти в Польщі',
    text: 'Понад 64 000 дітей із України навчаються в польських школах безкоштовно. Але для зарахування потрібен актуальний статус перебування одного з батьків.',
  },
];

const AUTO_CLOSE_SEC = 12;

export default function KompasAI() {
  const [visible, setVisible]   = useState(false);
  const [factIdx, setFactIdx]   = useState(0);
  const [progress, setProgress] = useState(100);
  const timerRef   = useRef(null);
  const progressRef = useRef(null);

  const startAutoClose = () => {
    setProgress(100);
    const start = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / (AUTO_CLOSE_SEC * 1000)) * 100);
      setProgress(pct);
      if (pct <= 0) clearInterval(progressRef.current);
    }, 80);
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, AUTO_CLOSE_SEC * 1000);
  };

  const stopAutoClose = () => {
    clearTimeout(timerRef.current);
    clearInterval(progressRef.current);
    setProgress(100);
  };

  useEffect(() => {
    const first = setTimeout(() => {
      setFactIdx(0);
      setVisible(true);
    }, 15000);
    return () => clearTimeout(first);
  }, []);

  useEffect(() => {
    if (visible) startAutoClose();
    else stopAutoClose();
    return stopAutoClose;
  }, [visible]); // eslint-disable-line

  const close = () => {
    setVisible(false);
    setTimeout(() => {
      setFactIdx(i => (i + 1) % FACTS.length);
      setVisible(true);
    }, 90000);
  };

  if (!visible) return null;

  const fact = FACTS[factIdx];

  return (
    <>
      <style>{`
        @keyframes kai-in {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .kai-card {
          animation: kai-in 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>

      <div
        className="kai-card"
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 9997,
          width: 'min(340px, calc(100vw - 48px)',
          background: NAVY,
          borderRadius: 18,
          border: '1px solid rgba(249,115,22,0.25)',
          fontFamily: "'Syne', sans-serif",
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
        onMouseEnter={stopAutoClose}
        onMouseLeave={startAutoClose}
      >
        {/* Progress bar */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: ORANGE,
              transition: 'width 0.08s linear',
              borderRadius: 3,
            }}
          />
        </div>

        <div style={{ padding: '14px 16px 16px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, flexShrink: 0,
              }}>🧭</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: ORANGE, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
                  Kompas AI
                </div>
                <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 1 }}>
                  Факти для емігрантів
                </div>
              </div>
            </div>
            <button
              onClick={close}
              aria-label="Закрити"
              style={{
                background: 'none', border: 'none',
                color: '#334155', fontSize: 18, cursor: 'pointer',
                lineHeight: 1, padding: '2px 4px', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#334155'; }}
            >✕</button>
          </div>

          {/* Tag */}
          <div style={{
            display: 'inline-block',
            fontSize: 10, fontWeight: 700,
            color: ORANGE,
            background: 'rgba(249,115,22,0.1)',
            borderRadius: 6,
            padding: '3px 8px',
            marginBottom: 8,
            letterSpacing: '0.04em',
          }}>
            {fact.tag}
          </div>

          {/* Text */}
          <p style={{
            fontSize: 13,
            color: '#94a3b8',
            lineHeight: 1.6,
            margin: '0 0 14px',
          }}>
            {fact.text}
          </p>

          {/* CTA */}
          <a
            href="https://wa.me/48729271848"
            target="_blank"
            rel="noreferrer"
            onClick={close}
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '10px 0',
              borderRadius: 9,
              background: ORANGE,
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Отримати допомогу →
          </a>

          <div style={{
            display: 'flex', justifyContent: 'center', gap: 4, marginTop: 10,
          }}>
            {FACTS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === factIdx ? 16 : 5,
                  height: 5,
                  borderRadius: 3,
                  background: i === factIdx ? ORANGE : '#1e293b',
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
