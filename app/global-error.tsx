'use client';

import { useEffect, useState } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isReloading, setIsReloading] = useState(false);
  const RELOAD_KEY = 'globalErrorReload';

  useEffect(() => {
    // Detect ChunkLoadError or related dynamic import errors caused by recent deployments
    const isChunkLoadError = 
      error.name === 'ChunkLoadError' || 
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Failed to load script') ||
      error.message?.includes('dynamically imported module') ||
      error.message?.includes('fetch failed') ||
      error.message?.includes('text/html');

    if (isChunkLoadError) {
      try {
        const now = Date.now();
        const raw = sessionStorage.getItem(RELOAD_KEY);
        const attempt = raw ? JSON.parse(raw) : { count: 0, ts: 0 };
        const COOLDOWN_MS = 60_000; // 1 minute cooldown to avoid reload loops

        if (attempt.count === 0 || now - (attempt.ts || 0) > COOLDOWN_MS) {
          const next = { count: (attempt.count || 0) + 1, ts: now };
          sessionStorage.setItem(RELOAD_KEY, JSON.stringify(next));
          console.log('Deployment chunk error detected. Attempting hard refresh...', next);
          setIsReloading(true);
          // small delay to allow UI update
          setTimeout(() => window.location.reload(), 250);
        } else {
          console.warn('Skipping automatic reload to avoid loop. You can refresh manually.');
          console.error('Global error caught (reload skipped):', error);
        }
      } catch (e) {
        // Fallback: if sessionStorage is unavailable, do a single reload attempt
        console.log('Storage error while handling reload flag, doing single reload fallback.', e);
        setIsReloading(true);
        setTimeout(() => window.location.reload(), 250);
      }
    } else {
      console.error('Global error caught:', error);
    }
  }, [error]);

  return (
    <html lang="uk">
      <body style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif', 
        margin: 0, padding: '20px', textAlign: 'center', background: '#f8f9fb' 
      }}>
        <div style={{ maxWidth: '500px', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px', color: '#111' }}>
            {isReloading ? 'Оновлюємо сторінку...' : 'Ой, щось пішло не так!'}
          </h2>
          <p style={{ color: '#666', margin: '0 0 24px', lineHeight: '1.5' }}>
            {isReloading 
              ? 'Завантажуємо найновішу версію сайту. Зачекайте хвилинку...' 
              : 'Можливо, ми щойно оновили сайт і ваш браузер використовує застарілі файли. Спробуйте оновити сторінку.'}
          </p>
          {!isReloading && (
            <button
              onClick={() => {
                try { sessionStorage.removeItem(RELOAD_KEY); } catch (e) {}
                window.location.reload();
              }}
              style={{ 
                padding: '14px 28px', fontSize: '16px', fontWeight: 'bold', 
                background: '#0066FF', color: 'white', border: 'none', 
                borderRadius: '99px', cursor: 'pointer', transition: 'transform 0.2s' 
              }}
            >
              Оновити сторінку
            </button>
          )}
        </div>
      </body>
    </html>
  );
}
