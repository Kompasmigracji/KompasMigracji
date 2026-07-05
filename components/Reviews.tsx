'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < n ? '#F59E0B' : 'rgba(255,255,255,0.1)'} stroke="none">
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
      className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:text-white/50 hover:bg-white/80 dark:hover:bg-white/10 dark:hover:text-white transition-all bg-white/60 dark:bg-white/5 backdrop-blur-md"
    >
      {dir === 'prev'
        ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
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
  const [direction, setDirection] = useState(1);

  const go = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent((idx + REVIEWS.length) % REVIEWS.length);
  }, [current, REVIEWS.length]);

  const handleNext = useCallback(() => go(current + 1), [go, current]);
  const handlePrev = useCallback(() => go(current - 1), [go, current]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(handleNext, 6000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, handleNext]);

  const r = REVIEWS[current];

  return (
    <section className="py-24 sm:py-32 relative bg-white dark:bg-[#020617] overflow-hidden text-gray-900 dark:text-white">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {t('reviews_tag')}
          </div>
          <h2 className="font-display tracking-tight font-bold text-gray-900 dark:text-white" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
            {t('reviews_title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            {t('rev_real_text')} {' '}
            <a href="https://www.gowork.pl/opinie_czytaj,24275530" target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300 transition-colors underline underline-offset-4">GoWork.pl</a>
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-2xl backdrop-blur-2xl p-8 sm:p-12 min-h-[320px] sm:min-h-[280px]">
            <div className="absolute top-8 left-8 font-display font-bold text-9xl leading-none select-none text-black/5 dark:text-white/5 -z-10">&ldquo;</div>
            
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col h-full relative z-10"
              >
                <Stars n={r.rating} />
                <p className="text-lg sm:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed font-medium mt-6 mb-8 flex-grow">{r.text}</p>
                <div className="flex items-center gap-4 border-t border-black/10 dark:border-white/10 pt-6 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-black font-bold text-lg">
                    {r.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-base">{r.author}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{r.date}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 px-4">
            <div className="flex gap-3 items-center">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Відгук ${i + 1}`}
                  className="rounded-full transition-all duration-500"
                  style={{ width: i === current ? 32 : 10, height: 10, background: i === current ? '#4ADE80' : 'rgba(255,255,255,0.2)' }}
                />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <ArrowBtn onClick={handlePrev} dir="prev" />
              <ArrowBtn onClick={handleNext} dir="next" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
