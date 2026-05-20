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

// CookieBanner is temporarily disabled
// export default function CookieBanner() {
//   const { decided, analytics, acceptAll, rejectAll, saveCustom } = useCookieConsent();
//   const { dark } = useTheme();
//   const [open, setOpen]           = useState(false);
//   const [analyticsOn, setAnalyticsOn] = useState(true);
//
//   if (decided) return null;
//
//   const bg     = dark ? 'rgba(10, 18, 36, 0.97)' : '#ffffff';
//   const border = dark ? 'rgba(255,255,255,0.12)' : '#e5e7eb';
//   const text   = dark ? '#dde4f0' : '#1a1a2e';
//   const muted  = dark ? '#7a8ba8' : '#6b7280';
//   const card   = dark ? 'rgba(255,255,255,0.04)' : '#f9fafb';
//
//   return null;
// }
          margin: '0 auto',
          zIndex: 9995,
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 16,
          padding: '20px 20px 18px',
          boxShadow: dark
            ? '0 8px 40px rgba(0,0,0,0.6)'
            : '0 8px 32px rgba(0,0,0,0.12)',
          fontFamily: "'Syne', sans-serif",
          backdropFilter: dark ? 'blur(12px)' : 'none',
        }}
      >
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
            {/* Necessary */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: card, borderRadius: 10, padding: '10px 14px',
              border: `1px solid ${border}`,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: text }}>
                  Необхідні
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: muted }}>
                  Мова, тема, сесія — завжди активні
                </p>
              </div>
              <Toggle on={true} onChange={null} />
            </div>

            {/* Analytics */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: card, borderRadius: 10, padding: '10px 14px',
              border: `1px solid ${border}`,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: text }}>
                  Аналітичні
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: muted }}>
                  Vercel Analytics — статистика відвідувань
                </p>
              </div>
              <Toggle on={analyticsOn} onChange={setAnalyticsOn} />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button
            onClick={acceptAll}
            style={{
              flex: 1, minWidth: 120, padding: '9px 12px', borderRadius: 9, border: 'none',
              background: ORANGE, color: '#fff', fontWeight: 700, fontSize: 13,
              fontFamily: 'inherit', cursor: 'pointer', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Прийняти всі
          </button>

          <button
            onClick={rejectAll}
            style={{
              flex: 1, minWidth: 100, padding: '9px 12px', borderRadius: 9,
              border: `1.5px solid ${border}`,
              background: 'transparent', color: muted, fontWeight: 600, fontSize: 13,
              fontFamily: 'inherit', cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = text; e.currentTarget.style.borderColor = text; }}
            onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = border; }}
          >
            Лише необхідні
          </button>

          {!open ? (
            <button
              onClick={() => setOpen(true)}
              style={{
                padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${border}`,
                background: 'transparent', color: muted, fontSize: 13,
                fontFamily: 'inherit', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              Налаштувати
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          ) : (
            <button
              onClick={() => saveCustom(analyticsOn)}
              style={{
                padding: '9px 14px', borderRadius: 9, border: 'none',
                background: dark ? 'rgba(255,255,255,0.1)' : '#f3f4f6',
                color: text, fontWeight: 600, fontSize: 13,
                fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              Зберегти ↑
            </button>
          )}
        </div>
      </div>
    </>
  );
}
