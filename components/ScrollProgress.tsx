'use client';
import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          if (barRef.current) {
            barRef.current.style.width = `${total > 0 ? (window.scrollY / total) * 100 : 0}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999,
        height: 3,
        width: '0%',
        background: 'linear-gradient(90deg, #2563eb, #f97316)',
        pointerEvents: 'none',
      }}
    />
  );
}
