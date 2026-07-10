'use client';
import { useState, useRef, MouseEvent } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import SpotlightCard from '@/components/SpotlightCard';

const icons = ['🛂', '🏠', '⚖️', '📄', '💍', '🔐', '💼', '👨‍👩‍👧', '🌍', '🏥', '🤝', '📚'];

const URGENT_INDICES = [0, 1, 2];
const getUrgentLabel = (t: any) => [t('badge_urgent'), t('badge_top'), t('badge_important')];

/* ─── Main Services Grid Component ──────────────────────── */
export default function ServicesGrid() {
  const t = useTranslations();

  const services = Array.from({ length: 12 }, (_, i) => ({
    icon: icons[i],
    title: t(`svc_${i}`),
    desc: t(`svc_desc_${i}`),
    urgentIdx: URGENT_INDICES.indexOf(i),
    // Fibonacci-inspired asymmetrical grid (1, 1, 2, 3 style spans)
    spanClass: i === 0 
      ? 'md:col-span-2 md:row-span-2' // 2x2
      : i === 1 
        ? 'md:col-span-1 md:row-span-2' // 1x2
        : i === 2 
          ? 'md:col-span-1 md:row-span-1' // 1x1
          : i === 3
            ? 'md:col-span-1 md:row-span-1' // 1x1
            : i === 4
              ? 'md:col-span-2 md:row-span-1' // 2x1
              : i === 5
                ? 'md:col-span-2 md:row-span-2' // 2x2
                : 'md:col-span-1 md:row-span-1', // 1x1 default
  }));

  return (
    <section id="services" className="py-24 sm:py-32 relative overflow-hidden bg-[#fbfbfd] dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t('services_tag')}
          </div>
          <h2 className="font-display font-bold tracking-tight text-gray-900 dark:text-white" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
            {t('services_title')}
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Інноваційний підхід до кожної справи. Оберіть послугу, і ми знайдемо найкраще рішення для вас.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(200px,auto)] gap-4 sm:gap-6">
          {services.map((s, i) => (
            <SpotlightCard key={i} delay={i * 0.05} className={s.spanClass}>
              <div className="flex flex-col h-full p-6 sm:p-8">
                {s.urgentIdx >= 0 && (
                  <div className="absolute top-6 right-6">
                    <span
                      className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md border"
                      style={{ 
                        background: s.urgentIdx === 0 ? 'rgba(220, 38, 38, 0.15)' : s.urgentIdx === 1 ? 'rgba(37, 99, 235, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                        borderColor: s.urgentIdx === 0 ? 'rgba(220, 38, 38, 0.3)' : s.urgentIdx === 1 ? 'rgba(37, 99, 235, 0.3)' : 'rgba(217, 119, 6, 0.3)',
                        color: s.urgentIdx === 0 ? '#fca5a5' : s.urgentIdx === 1 ? '#93c5fd' : '#fcd34d'
                      }}
                    >
                      {getUrgentLabel(t)[s.urgentIdx]}
                    </span>
                  </div>
                )}
                
                <div className="mb-6 mt-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/10 text-3xl shadow-inner dark:shadow-white/5 transition-transform group-hover:scale-110 duration-300">
                    {s.icon}
                  </div>
                </div>
                
                <h3 className={`font-display font-semibold text-gray-900 dark:text-white mb-3 ${s.spanClass.includes('row-span-2') ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                  {s.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-grow text-sm sm:text-base">
                  {s.desc}
                </p>
                
                <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className={`text-sm font-medium ${s.urgentIdx >= 0 ? 'text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {s.urgentIdx === 0 ? t('service_get_help') : t('services_more')}
                  </span>
                  <svg className={`w-5 h-5 transform group-hover:translate-x-1 transition-transform ${s.urgentIdx >= 0 ? 'text-blue-500 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
