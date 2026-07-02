'use client';
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

const ICONS = [
  <svg key="users" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  <svg key="target" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  <svg key="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  <svg key="award" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
];

function useCountUp(target: number, duration = 1800, active = false): number {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active || target === 0) return;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, active]);

  return val;
}

function StatCard({ value, suffix = "", label, icon, delay = 0 }: { value: number; suffix?: string; label: string; icon: React.ReactNode; delay?: number }) {
  const [active, setActive] = useState(false);
  const animated = useCountUp(value, 2000, active);
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
      transition={{ duration: 0.8, delay }}
      onViewportEnter={() => setActive(true)}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-xl"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="mb-4 text-blue-400 group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] relative z-10">
        {icon}
      </div>
      <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-2 font-display relative z-10">
        {animated}{suffix}
      </div>
      <div className="text-sm uppercase tracking-widest text-gray-400 font-semibold relative z-10">
        {label}
      </div>
    </motion.div>
  );
}

export default function SocialProof() {
  const t = useTranslations();

  const stats = [
    { value: 12000, suffix: "+", label: t('stat_members'), icon: ICONS[0] },
    { value: 1200,  suffix: "+", label: t('stat_cases'),   icon: ICONS[1] },
    { value: 99,    suffix: "%", label: t('stat_success'), icon: ICONS[2] },
    { value: 50,    suffix: "+", label: t('stat_countries'), icon: ICONS[3] },
    { value: 10,    suffix: "+", label: t('stat_years'),   icon: ICONS[4] },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#050505] text-white relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t('proof_tag')}
          </div>
          <h2 className="font-display tracking-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
            {t('proof_title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
