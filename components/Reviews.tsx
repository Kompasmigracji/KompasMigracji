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

  return (
    <section className="py-24 sm:py-32 relative bg-[#fbfbfd] dark:bg-[#020617] overflow-hidden text-gray-900 dark:text-white">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center px-6 mb-16"
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
            <a href="https://www.gowork.pl/opinie_czytaj,24275530" target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-400 transition-colors underline underline-offset-4 font-medium">GoWork.pl</a>
          </p>
        </motion.div>

        <div className="relative w-full overflow-hidden pb-12 pt-4">
          <div className="absolute top-0 left-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[#fbfbfd] dark:from-[#020617] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[#fbfbfd] dark:from-[#020617] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] pr-6">
            {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((r, i) => (
              <div 
                key={i} 
                className="w-[320px] sm:w-[450px] shrink-0 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col hover:border-green-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <Stars n={r.rating} />
                  <div className="text-6xl text-green-500/20 font-serif leading-none h-6 select-none">&ldquo;</div>
                </div>
                
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed flex-grow whitespace-normal">
                  {r.text}
                </p>
                
                <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                    {r.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{r.author}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{r.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333333%); }
        }
      `}} />
    </section>
  );
}
