'use client';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'km_visited';
const STORAGE_DATE = 'km_visit_date';

export default function ReturnVisitor() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem(STORAGE_KEY);
    const lastDate = localStorage.getItem(STORAGE_DATE);
    const today = new Date().toDateString();

    if (visited && lastDate !== today) {
      setShow(true);
    }

    localStorage.setItem(STORAGE_KEY, '1');
    localStorage.setItem(STORAGE_DATE, today);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99990] text-white text-sm py-2.5 px-4 flex items-center justify-between gap-4"
      style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}
    >
      <span className="flex items-center gap-2">
        <span>👋</span>
        <span className="font-medium">З поверненням! Ваша справа ще актуальна — ми готові допомогти прямо зараз.</span>
      </span>
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="https://wa.me/48729271848?text=Повертаюся+до+питання+міграційної+допомоги"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold no-underline px-3 py-1.5 rounded-lg text-white"
          style={{ background: '#25D366' }}
        >
          WhatsApp
        </a>
        <button
          onClick={() => setShow(false)}
          className="text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer text-lg leading-none"
          aria-label="Закрити"
        >
          ×
        </button>
      </div>
    </div>
  );
}
