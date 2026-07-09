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
      console.log('Deployment chunk error detected. Hard refreshing the page...');
      setIsReloading(true);
      window.location.reload();
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
              onClick={() => window.location.reload()}
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
