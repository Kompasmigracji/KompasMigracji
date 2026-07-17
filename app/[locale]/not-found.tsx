'use client';
import { useLocale } from 'next-intl';

const TITLE: Record<string, string> = { uk: 'Сторінку не знайдено', ru: 'Страница не найдена', pl: 'Strony nie znaleziono', en: 'Page not found', rom: 'Pagina nu a fost găsită' };
const CTA: Record<string, string> = { uk: 'На головну', ru: 'На главную', pl: 'Strona główna', en: 'Go home', rom: 'Acasă' };

export default function NotFound() {
  const locale = useLocale();

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8f9fb',
        color: '#1a1a2e',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 72, fontWeight: 300, margin: 0 }}>404</h1>
        <p style={{ color: '#7a7a9a', marginTop: 8 }}>{TITLE[locale] || TITLE.uk}</p>
        <a
          href={`/${locale}`}
          style={{
            display: 'inline-block',
            marginTop: 24,
            padding: '10px 24px',
            background: 'linear-gradient(135deg,#2563eb,#059669)',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          {CTA[locale] || CTA.uk}
        </a>
      </div>
    </div>
  );
}
