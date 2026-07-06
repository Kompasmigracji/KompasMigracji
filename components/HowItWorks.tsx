'use client';
import { useTranslations } from 'next-intl';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';

const icons = [
  <svg key="chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  <svg key="map" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  <svg key="card" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  <svg key="trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="8 6 2 6 2 12 8 12"/><polyline points="16 6 22 6 22 12 16 12"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M8 6v6a4 4 0 0 0 8 0V6"/></svg>,
];

function StepCard({ step, i, t }: { step: any, i: number, t: any }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col items-center text-center gap-4 z-10 p-6 rounded-3xl bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-xl overflow-hidden hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.2),
              transparent 80%
            )
          `,
        }}
      />

      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-gray-900 shadow-2xl flex-shrink-0 relative z-10" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #10b981 100%)' }}>
        <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" style={{ animationDuration: '3s' }} />
        {step.icon}
      </div>
      
      <div className="relative z-10">
        <div className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-2">{t('how_step_label')} {i + 1}</div>
        <div className="font-bold text-gray-900 dark:text-white text-lg leading-snug mb-3">{step.name}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const t = useTranslations();
  const steps = [0, 1, 2, 3, 4].map(i => ({
    name: t(`how_step_${i}_name`),
    desc: t(`how_step_${i}`),
    icon: icons[i],
  }));

  return (
    <section id="process" className="py-24 relative overflow-hidden bg-white dark:bg-[#020617]">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />

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
            {t('how_tag')}
          </div>
          <h2 className="font-display tracking-tight font-semibold text-gray-900 dark:text-white" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
            {t('how_title')}
          </h2>
        </motion.div>

        <div className="relative">
          {/* Animated glowing connecting line */}
          <div className="hidden md:block absolute top-[68px] left-12 right-12 h-[2px] bg-white/60 z-0">
            <motion.div 
              className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/3"
              animate={{ x: ['-100%', '300%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8">
            {steps.map((step, i) => (
              <StepCard key={i} step={step} i={i} t={t} />
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <a
            href="https://wa.me/48729271848"
            target="_blank"
            rel="noopener noreferrer"
            className="premium-btn"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-400">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M11.99 2C6.48 2 2 6.48 2 12c0 1.874.518 3.624 1.41 5.12L2 22l4.99-1.389A9.96 9.96 0 0 0 11.99 22C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm0 18c-1.65 0-3.18-.458-4.49-1.248l-.32-.19-3.32.923.94-3.22-.21-.33A7.975 7.975 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              WhatsApp — +48 729 271 848
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
