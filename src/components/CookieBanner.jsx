import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../lib/useCookieConsent';
import { useTheme } from '../lib/ThemeContext';

const ORANGE = '#f97316';

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      disabled={!onChange}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: on ? ORANGE : 'rgba(255,255,255,0.15)',
        border: 'none', cursor: onChange ? 'pointer' : 'default',
        position: 'relative', transition: 'background 0.25s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.25s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}

export default function CookieBanner() {
  const { decided, acceptAll, rejectAll, saveCustom } = useCookieConsent();
  const { dark } = useTheme();
  const [open, setOpen] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(true);

  if (decided) return null;

  const bg     = dark ? 'rgba(10, 18, 36, 0.97)' : '#ffffff';
  const border = dark ? 'rgba(255,255,255,0.12)' : '#e5e7eb';
  const text   = dark ? '#dde4f0' : '#1a1a2e';
  const muted  = dark ? '#7a8ba8' : '#6b7280';
  const card   = dark ? 'rgba(255,255,255,0.04)' : '#f9fafb';

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: 0, right: 0,
      display: 'flex', justifyContent: 'center',
      padding: '0 16px', zIndex: 9995,
      pointerEvents: 'none',
    }}>
      <div style={{
        maxWidth: 480, width: '100%',
        margin: '0 auto',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: '20px 20px 18px',
        boxShadow: dark
          ? '0 8px 40px rgba(0,0,0,0.6)'
          : '0 8px 32px rgba(0,0,0,0.12)',
        fontFamily: "'Syne', sans-serif",
        backdropFilter: dark ? 'blur(12px)' : 'none',
        pointerEvents: 'all',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>🍪</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: text, lineHeight: 1.3 }}>
              Ми використовуємо файли cookie
            </p>
            <p style={{ margin: '5px 0 0', fontSize: 12, color: muted, lineHeight: 1.6 }}>
              Необхідні cookies завжди активні. Аналітичні допомагають покращувати сервіс.{' '}
              <Link to="/privacy" style={{ color: ORANGE, textDecoration: 'none' }}>
                Політика конфіденційності
              </Link>
            </p>
          </div>
        </div>

        {/* Expandable settings */}
        {open && (
          <div style={{ margin: '12px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: card, borderRadius: 10, padding: '10px 14px',
              border: `1px solid ${border}`,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: text }}>Необхідні</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: muted }}>Мова, тема, сесія — завжди активні</p>
              </div>
              <Toggle on={true} onChange={null} />
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: card, borderRadius: 10, padding: '10px 14px',
              border: `1px solid ${border}`,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: text }}>Аналітичні</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: muted }}>Vercel Analytics — статистика відвідувань</p>
              </div>
              <Toggle on={analyticsOn} onChange={setAnalyticsOn} />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
          <button
            onClick={acceptAll}
            style={{
              flex: 1, minWidth: 120, padding: '10px 16px', borderRadius: 10,
              border: 'none', background: ORANGE, color: '#fff',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Прийняти всі
          </button>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              padding: '10px 14px', borderRadius: 10,
              border: `1px solid ${border}`, background: 'transparent',
              color: muted, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {open ? 'Сховати' : 'Налаштувати'}
          </button>
          {open && (
            <button
              onClick={() => saveCustom({ analytics: analyticsOn })}
              style={{
                padding: '10px 14px', borderRadius: 10,
                border: `1px solid ${border}`, background: 'transparent',
                color: text, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Зберегти
            </button>
          )}
          <button
            onClick={rejectAll}
            style={{
              padding: '10px 14px', borderRadius: 10,
              border: 'none', background: 'transparent',
              color: muted, fontWeight: 500, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Відхилити
          </button>
        </div>
      </div>
    </div>
  );
}
