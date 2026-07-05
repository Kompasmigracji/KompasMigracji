'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = (localStorage.getItem('theme') as Theme | null) || null;
    if (stored === 'light' || stored === 'dark') return stored;
    return 'light'; // Завжди світла тема за замовчуванням
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } catch (e) { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue as Theme);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <button
      className="theme-toggle"
      data-testid="theme-toggle"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
    >
      <span style={{ display: 'inline-block', width: 40, height: 24, borderRadius: 999, padding: 3, boxSizing: 'border-box', background: theme === 'dark' ? '#111827' : '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
        <span style={{ display: 'block', width: 18, height: 18, borderRadius: '50%', background: theme === 'dark' ? '#fff' : '#111827', transform: theme === 'dark' ? 'translateX(16px)' : 'translateX(0)', transition: 'transform .18s ease' }} />
      </span>
    </button>
  );
}
