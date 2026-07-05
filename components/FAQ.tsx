'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

const EMOTIONAL_ITEMS = [
  { q: 'faq_panic_q_0', a: 'faq_panic_a_0', panic: true },
  { q: 'faq_panic_q_1', a: 'faq_panic_a_1', panic: false },
  { q: 'faq_panic_q_2', a: 'faq_panic_a_2', panic: true },
];

export default function FAQ() {
  const t = useTranslations();
  const [open, setOpen] = useState<number | null>(null);

  const translatedItems = Array.from({ length: 6 }, (_, i) => ({
    q: t(`faq_q_${i}`),
    a: t(`faq_a_${i}`),
    panic: false,
  }));

  const items = [
    ...EMOTIONAL_ITEMS.map(it => ({ q: t(it.q as any), a: t(it.a as any), panic: it.panic })),
    ...translatedItems
  ];

  return (
    <section className="py-24 sm:py-32 relative bg-white dark:bg-[#020617] text-gray-900 dark:text-white overflow-hidden">
      {/* Glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none translate-x-1/2" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t('faq_tag')}
          </div>
          <h2 className="font-display tracking-tight font-bold text-gray-900 dark:text-white" style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}>
            {t('faq_title')}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {items.map((it, idx) => {
            const isOpen = open === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                  it.panic 
                    ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]' 
                    : 'bg-white/60 dark:bg-white/5 border-black/10 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:bg-white/80 dark:hover:bg-white/10'
                }`}
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : idx)}
                >
                  <div className="flex items-center gap-4">
                    {it.panic && (
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 shrink-0">
                        ⚡
                      </span>
                    )}
                    <span className={`font-semibold text-base md:text-lg transition-colors ${it.panic ? 'text-red-600 dark:text-red-300' : 'text-gray-900 dark:text-white'}`}>
                      {it.q}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border ${
                      it.panic ? 'border-red-500/30 text-red-400' : 'border-black/10 text-blue-400'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className={`px-6 pb-6 pt-2 text-base leading-relaxed border-t ${
                        it.panic ? 'border-red-500/20 text-red-700/80 dark:text-red-200/80 bg-red-500/5' : 'border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400'
                      }`}>
                        {it.a}
                        
                        {it.panic && (
                          <div className="mt-6 flex flex-wrap gap-3">
                            <a
                              href="https://wa.me/48729271848?text=Потребую+термінової+допомоги"
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-black text-sm font-bold no-underline shadow-lg hover:scale-105 transition-transform"
                              style={{ background: '#25D366' }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                              </svg>
                              {t('faq_panic_whatsapp')}
                            </a>
                            <a
                              href="tel:+48729271848"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-gray-900 text-sm font-bold no-underline border border-red-500/30 hover:bg-red-500/10 transition-colors"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
                              </svg>
                              {t('faq_panic_call')}
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
