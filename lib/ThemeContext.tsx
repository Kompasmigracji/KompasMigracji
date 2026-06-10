'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const Ctx = createContext({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Стартове значення береться з data-theme, який інлайн-скрипт у app/layout.tsx
  // виставив до першого рендеру (SSR-фолбек — dark, як і скрипт за замовчуванням).
  const [dark, setDark] = useState(() => {
    if (typeof document === 'undefined') return true;
    return document.documentElement.getAttribute('data-theme') !== 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return (
    <Ctx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
