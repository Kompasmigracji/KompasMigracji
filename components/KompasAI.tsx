'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

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

const AUTO_CLOSE_MS = 14_000;

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
}

export default function KompasAI() {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoClose = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const startAutoClose = useCallback(() => {
    stopAutoClose();
    setProgress(100);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / AUTO_CLOSE_MS) * 100);
      setProgress(pct);
      if (pct <= 0) clearInterval(intervalRef.current!);
    }, 80);
    timerRef.current = setTimeout(() => setVisible(false), AUTO_CLOSE_MS);
  }, [stopAutoClose]);

  const scheduleNext = useCallback(() => {
    setTimeout(() => {
      setIdx(Math.floor(Math.random() * FACTS.length));
      setAnimKey(k => k + 1);
      setVisible(true);
    }, rand(20, 50));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setIdx(Math.floor(Math.random() * FACTS.length));
      setVisible(true);
    }, rand(4, 8));
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (visible) startAutoClose();
    else stopAutoClose();
    return stopAutoClose;
  }, [visible, startAutoClose, stopAutoClose]);

  const close = () => { setVisible(false); scheduleNext(); };

  const change = useCallback((dir: 1 | -1) => {
    stopAutoClose();
    setIdx(i => (i + dir + FACTS.length) % FACTS.length);
    setAnimKey(k => k + 1);
    startAutoClose();
  }, [stopAutoClose, startAutoClose]);

  if (!visible) return null;

  const fact = FACTS[idx];

  return (
    <>
      <style>{`
        @keyframes kai-in { from{opacity:0;transform:translateY(24px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes kai-text { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }
        .kai-card { animation: kai-in 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .kai-fact { animation: kai-text 0.25s ease both; }
      `}</style>

      <div
        className="kai-card"
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 9997,
          width: 'min(340px, calc(100vw - 48px))',
          background: '#0f172a',
          borderRadius: 18,
          border: '1px solid rgba(249,115,22,0.25)',
          fontFamily: "'Syne', sans-serif",
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
        }}
        onMouseEnter={stopAutoClose}
        onMouseLeave={startAutoClose}
      >
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#f97316', transition: 'width 0.08s linear' }} />
        </div>

        <div style={{ padding: '13px 14px 15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                🧭
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#f97316', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
                  Kompas AI
                </div>
                <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2 }}>
                  Факти для емігрантів
                </div>
              </div>
            </div>
            <button
              onClick={close}
              style={{ background: 'none', border: 'none', color: '#334155', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '2px 5px', flexShrink: 0 }}
            >
              ✕
            </button>
          </div>

          <div key={animKey} className="kai-fact">
            <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, color: '#f97316', background: 'rgba(249,115,22,0.1)', borderRadius: 6, padding: '3px 8px', marginBottom: 8, letterSpacing: '0.04em' }}>
              {fact.tag}
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 14px' }}>
              {fact.text}
            </p>
          </div>

          <a
            href="https://wa.me/48729271848"
            target="_blank"
            rel="noreferrer"
            onClick={close}
            style={{ display: 'block', textAlign: 'center', padding: '10px 0', borderRadius: 9, background: '#f97316', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', marginBottom: 12 }}
          >
            Отримати допомогу →
          </a>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => change(-1)}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 7, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            </button>

            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {FACTS.map((_, i) => (
                <div
                  key={i}
                  onClick={() => { stopAutoClose(); setIdx(i); setAnimKey(k => k + 1); startAutoClose(); }}
                  style={{ width: i === idx ? 16 : 5, height: 5, borderRadius: 3, background: i === idx ? '#f97316' : '#1e293b', transition: 'width 0.3s ease', cursor: 'pointer' }}
                />
              ))}
            </div>

            <button
              onClick={() => change(1)}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 7, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
