'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const FACTS = [
  {
    tag: '⏱️ Черги скорочуються',
    text: 'У Варшаві черга на Картку побуту — 8–12 місяців самостійно. Клієнти Kompas Migracji отримують результат за 4–6 тижнів завдяки юридичному супроводу.',
  },
  {
    tag: '✅ Наш результат',
    text: '97% справ, які ведуть юристи Kompas Migracji, закриваються позитивним рішенням. Жодної відмови через помилки в документах.',
  },
  {
    tag: '👥 Довіряють тисячі',
    text: 'Понад 3 200 українських сімей вже вирішили питання легалізації з Kompas Migracji. Ви наступний — консультація безкоштовна.',
  },
  {
    tag: '💸 Ціна помилки',
    text: 'Одна помилка в заяві на Карту побуту = відмова + повторне очікування 6–12 місяців. Наші юристи перевіряють кожен документ перед подачею.',
  },
  {
    tag: '💳 PESEL за 3 дні',
    text: 'PESEL UKR дає доступ до NFZ, допомоги 800+, банківських послуг. Kompas Migracji оформить його для вас за 3 робочі дні без черг.',
  },
  {
    tag: '🏠 Карта побуту',
    text: 'Карта тимчасового побуту — ваш головний документ у Польщі. Ми готуємо весь пакет документів "під ключ" і супроводжуємо до отримання.',
  },
  {
    tag: '👨‍👩‍👧 Возз\'єднання сім\'ї',
    text: 'Чоловік або діти залишились в Україні? Kompas Migracji допоможе з возз\'єднанням сім\'ї через офіційні польські процедури.',
  },
  {
    tag: '💼 Дозвіл на роботу',
    text: 'Oświadczenie, зезволення на роботу, Blue Card — Kompas Migracji оформить будь-який вид дозволу для вас або вашого роботодавця.',
  },
  {
    tag: '🏫 Діти в школу',
    text: '64 000+ дітей з України навчаються в польських школах безкоштовно. Для зарахування потрібен актуальний статус батьків — ми допоможемо його оновити.',
  },
  {
    tag: '🏥 Медичне страхування',
    text: 'Без PESEL і легального статусу ви платите за медицину з власної кишені. З нами — NFZ і безкоштовне лікування для всієї родини.',
  },
  {
    tag: '⚖️ Зміни закону 2025',
    text: 'З 2025 року правила легалізації суттєво змінились. Наші юристи щодня відстежують зміни і адаптують вашу справу під актуальне законодавство.',
  },
  {
    tag: '🚨 Прострочені документи',
    text: 'Порушення строків перебування в Польщі — заборона в\'їзду до 5 років. Якщо документи прострочені — зверніться до нас сьогодні, ми знаємо як діяти.',
  },
  {
    tag: '🌐 Онлайн-портал KompasWorld',
    text: 'У особистому кабінеті KompasWorld ви бачите статус своєї справи в реальному часі, завантажуєте документи і пишете юристу — без черг і дзвінків.',
  },
  {
    tag: '📊 1,05 млн українців',
    text: 'Офіційно зареєстровані в Польщі — і їх кількість зростає. Черги у легалізації збільшуються щомісяця. Починайте процес якомога раніше.',
  },
  {
    tag: '🎯 Безкоштовна консультація',
    text: 'Перша консультація з юристом Kompas Migracji — безкоштовно. Ви дізнаєтесь точний план дій для вашої ситуації вже за 30 хвилин.',
  },
  {
    tag: '🎓 Постійний побут',
    text: 'Через 5 років легального перебування ви можете отримати постійну Карту побуту. Kompas Migracji супроводжує клієнтів на кожному етапі цього шляху.',
  },
  {
    tag: '💰 Допомога 800+',
    text: 'Польська дитяча допомога 800+ — до 9 600 злотих на рік на одну дитину. Kompas Migracji допоможе оформити усі соціальні виплати, на які ви маєте право.',
  },
  {
    tag: '🔒 Захист від депортації',
    text: 'Отримали відмову у воєводстві? Наші юристи подають апеляцію і захищають ваші права — 89% апеляцій виграємо у Kompas Migracji.',
  },
  {
    tag: '📱 WhatsApp 24/7',
    text: 'Юридична підтримка WhatsApp — відповідаємо протягом 2 годин. Жодних офісних черг, консультуємо дистанційно по всій Польщі.',
  },
  {
    tag: '🇵🇱 Сертифікат польської',
    text: 'Для постійної Картки побуту потрібен рівень B1. Ми підкажемо найшвидший маршрут підготовки і допоможемо з усіма супутніми документами.',
  },
  {
    tag: '🧭 Kompas — ваш навігатор',
    text: 'Не знаєте з чого почати? Зареєструйтесь у KompasWorld — і юрист складе особистий план легалізації для вашої ситуації за 24 години.',
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
                  Факти для мігрантів
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
