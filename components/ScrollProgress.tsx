'use client';
import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999,
        height: 3,
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #2563eb, #f97316)',
        transition: 'width 0.1s linear',
        pointerEvents: 'none',
      }}
    />
  );
}
