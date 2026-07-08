'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('light'); // Default to light on server

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem('theme') as Theme | null) || null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
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
      className="w-11 h-11 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none flex items-center justify-center"
      data-testid="theme-toggle"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
    >
      <span style={{ display: 'inline-block', width: 40, height: 24, borderRadius: 999, padding: 3, boxSizing: 'border-box', background: (mounted && theme === 'dark') ? '#111827' : '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
        <span style={{ display: 'block', width: 18, height: 18, borderRadius: '50%', background: (mounted && theme === 'dark') ? '#fff' : '#111827', transform: (mounted && theme === 'dark') ? 'translateX(16px)' : 'translateX(0)', transition: 'transform .18s ease' }} />
      </span>
    </button>
  );
}
