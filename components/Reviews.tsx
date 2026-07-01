'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

function Stars({ n }: { n: number }) {
  return (
    <div className="flex justify-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < n ? '#f59e0b' : '#e5e7eb'} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function ArrowBtn({ onClick, dir }: { onClick: () => void; dir: 'prev' | 'next' }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Попередній' : 'Наступний'}
      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all bg-white"
    >
      {dir === 'prev'
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      }
    </button>
  );
}

export default function Reviews() {
  const t = useTranslations();
  
  const REVIEWS = [
    { text: t('rev1_t'), rating: 5, author: t('rev1_a'), date: t('rev1_d') },
    { text: t('rev2_t'), rating: 5, author: t('rev2_a'), date: t('rev2_d') },
    { text: t('rev3_t'), rating: 5, author: t('rev3_a'), date: t('rev3_d') },
    { text: t('rev4_t'), rating: 5, author: t('rev4_a'), date: t('rev4_d') },
  ];



  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);

  const go = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((idx + REVIEWS.length) % REVIEWS.length);
      setAnimating(false);
    }, 200);
  }, [animating]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(current + 1), 5000);
    return () => clearInterval(id);
  }, [paused, current, go]);

  const r = REVIEWS[current];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t('reviews_tag')}</div>
          <h2 className="font-display tracking-tight font-semibold text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>{t('reviews_title')}</h2>
          <p className="text-gray-500 text-sm mt-3">
            {t('rev_real_text')} {' '}
            <a href="https://www.gowork.pl/opinie_czytaj,24275530" target="_blank" rel="noreferrer" className="text-primary hover:underline">GoWork.pl</a>
          </p>
        </div>

        <div className="max-w-2xl mx-auto" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div
            className="apple-card px-10 py-12 text-center relative border-0 bg-gray-50/50"
            style={{ minHeight: 260, opacity: animating ? 0 : 1, transition: 'opacity 0.2s ease' }}
          >
            <div className="absolute top-6 left-8 font-display font-bold text-7xl leading-none select-none" style={{ color: '#2563eb18' }}>&ldquo;</div>
            <Stars n={r.rating} />
            <p className="text-gray-700 text-base leading-relaxed mt-5 mb-6 relative z-10">{r.text}</p>
            <div className="font-bold text-navy text-sm">{r.author}</div>
            <div className="text-xs text-muted mt-1">{r.date}</div>
          </div>

          <div className="flex items-center justify-center gap-5 mt-8">
            <ArrowBtn onClick={() => go(current - 1)} dir="prev" />
            <div className="flex gap-2 items-center">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Відгук ${i + 1}`}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? '#2563eb' : '#d1d5db' }}
                />
              ))}
            </div>
            <ArrowBtn onClick={() => go(current + 1)} dir="next" />
          </div>
        </div>
      </div>
    </section>
  );
}
