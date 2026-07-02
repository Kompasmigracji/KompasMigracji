'use client';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

/* ─── Reusable scroll-reveal wrapper ──────────────────────── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Services data ───────────────────────────────────────── */
const SERVICES = [
  { icon: '🛂', title: 'Wizy i zaproszenia', desc: 'Робочі, студентські, бізнес-візи та запрошення для іноземців до Польщі', gradient: 'linear-gradient(135deg, #0066FF 0%, #00AAFF 100%)', span: 'md:col-span-2 md:row-span-2', delay: 0.1 },
  { icon: '🏠', title: 'Legalizacja pobytu', desc: 'Карта побуту, побут тимчасовий та сталий, резидент ЄС', gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF3366 100%)', span: 'md:col-span-1', delay: 0.2 },
  { icon: '⚖️', title: 'Prawo pracy', desc: 'Дозволи на роботу, oświadczenia, зміна роботодавця', gradient: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)', span: 'md:col-span-1', delay: 0.3 },
  { icon: '📄', title: 'Tłumaczenia', desc: 'Присяжні переклади документів з/на польську, українську, англійську', gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', span: 'md:col-span-1', delay: 0.4 },
  { icon: '💍', title: 'Ślub w Polsce', desc: 'Повний супровід шлюбу для іноземців — документи, USC, apostille', gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)', span: 'md:col-span-1', delay: 0.5 },
  { icon: '🔐', title: 'Pomoc prawna', desc: 'Юридичні консультації, оскарження відмов, представництво в уженді', gradient: 'linear-gradient(135deg, #1E40AF 0%, #6366F1 100%)', span: 'md:col-span-2', delay: 0.6 },
];

/* ─── Process steps ───────────────────────────────────────── */
const STEPS = [
  { num: '01', title: 'Konsultacja', desc: 'Безкоштовний аналіз вашої ситуації та підбір оптимальної стратегії легалізації' },
  { num: '02', title: 'Dokumenty', desc: 'Підготовка повного пакету документів, переклади, заповнення анкет та форм' },
  { num: '03', title: 'Decyzja', desc: 'Супровід до отримання позитивного рішення — карти побуту, візи або дозволу' },
];

/* ════════════════════════════════════════════════════════════ */
/*                     MAIN HERO COMPONENT                     */
/* ════════════════════════════════════════════════════════════ */
export default function Hero() {
  const t = useTranslations();
  
  // Mouse parallax state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 40; // max rotation degrees
    const y = (clientY / innerHeight - 0.5) * 40;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <>
      {/* ─── SPATIAL HERO SECTION ─────────────────────────────────── */}
      <section 
        className="relative w-full flex flex-col lg:flex-row items-center justify-between px-6 xl:px-12 overflow-hidden" 
        style={{ minHeight: '100vh', paddingBottom: '4rem' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-white dark:bg-black">
          <div className="hero-mesh-1" />
          <div className="hero-mesh-2" />
          <div className="hero-mesh-3" />
        </div>

        {/* Left side: Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10 pt-32 lg:pt-0 pb-16 lg:pb-0 pr-0 lg:pr-12 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 hero-badge mx-auto lg:mx-0"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Ваш шлях до легалізації починається тут
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-tighter mb-6"
            style={{ letterSpacing: '-0.04em', lineHeight: 1.05, color: 'var(--text)' }}
          >
            {t('hero_title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl md:text-2xl font-medium max-w-xl mx-auto lg:mx-0 mb-12"
            style={{ color: 'var(--dim)', lineHeight: 1.5 }}
          >
            {t('hero_sub')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <a
              href="https://wa.me/48729271848"
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/25"
              style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t('cta_consult')}
              </span>
            </a>
            <a
              href="/test"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-[1.03]"
              style={{ border: '2px solid var(--border)', color: 'var(--text)', background: 'transparent' }}
            >
              {t('services_more') || 'Więcej'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="8" x2="13" y2="8"/><polyline points="9 4 13 8 9 12"/></svg>
            </a>
          </motion.div>
        </div>

        {/* Right side: Spatial UI / Bento Grid */}
        <div className="w-full lg:w-1/2 relative h-[500px] lg:h-[700px] hidden md:block" style={{ perspective: 1000 }}>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center transform-style-3d"
            style={{ 
              rotateX: useTransform(springY, [-40, 40], [10, -10]), 
              rotateY: useTransform(springX, [-40, 40], [-10, 10]) 
            }}
          >
            <div className="grid grid-cols-2 gap-4 w-full max-w-[600px] p-8">
              {/* Card 1 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, z: -100 }}
                animate={{ opacity: 1, scale: 1, z: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="col-span-2 bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-[32px] shadow-2xl flex items-center gap-4 hover:bg-white/80 dark:hover:bg-black/80 transition-colors"
                style={{ transform: 'translateZ(40px)' }}
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-3xl shrink-0">🛂</div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">Wizy i zaproszenia</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Повний супровід візових питань для іноземців до Польщі</p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, z: -100 }}
                animate={{ opacity: 1, scale: 1, z: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="col-span-1 bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-[32px] shadow-2xl hover:bg-white/80 dark:hover:bg-black/80 transition-colors"
                style={{ transform: 'translateZ(70px)' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-2xl mb-4">🏠</div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Karta Pobytu</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Отримання посвідки на проживання</p>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, z: -100 }}
                animate={{ opacity: 1, scale: 1, z: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="col-span-1 bg-gradient-to-br from-blue-600 to-indigo-600 border border-white/20 p-6 rounded-[32px] shadow-2xl shadow-blue-500/30 text-white"
                style={{ transform: 'translateZ(90px)' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl mb-4">💼</div>
                <h3 className="font-bold text-lg mb-2">Prawo pracy</h3>
                <p className="text-white/80 text-sm">Дозволи на роботу та легалізація праці</p>
              </motion.div>

              {/* Card 4 (Floatie) */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-4 top-12 bg-white/80 dark:bg-black/80 backdrop-blur-md border border-white/20 dark:border-white/10 px-6 py-4 rounded-full shadow-2xl flex items-center gap-3"
                style={{ transform: 'translateZ(120px)' }}
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-semibold text-sm">24/7 Wsparcie клієнтів</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: 'var(--dim)' }}>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--dim)' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ─── SERVICES BENTO GRID ──────────────────────────── */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
                Наші послуги
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--dim)' }}>
                Повний спектр міграційних послуг — від консультації до отримання документів
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {SERVICES.map((svc, i) => (
              <Reveal key={i} delay={i * 0.08} className={svc.span}>
                <div
                  className="relative group h-full min-h-[200px] md:min-h-[220px] rounded-3xl p-8 flex flex-col justify-end cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                  style={{ background: svc.gradient }}
                >
                  {/* Hover glow overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
                  
                  <span className="text-4xl mb-3 relative z-10">{svc.icon}</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 relative z-10">{svc.title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed relative z-10">{svc.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS STEPS ────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
                Як це працює
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--dim)' }}>
                Три простих кроки до вашої легалізації в Польщі
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-px -translate-y-1/2" style={{ background: 'linear-gradient(90deg, var(--border), var(--dim), var(--border))' }} />

            {STEPS.map((step, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div
                  className="relative rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}
                >
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-2xl font-black mb-6 mx-auto"
                    style={{ background: 'linear-gradient(135deg, #0066FF, #00AAFF)', color: '#fff' }}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--dim)' }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ───────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0066FF 150%)' }} />
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
              Готові почати?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-lg mx-auto">
              Напишіть нам у WhatsApp — перша консультація безкоштовна. Ми допоможемо знайти найкращий шлях до легалізації.
            </p>
            <a
              href="https://wa.me/48729271848"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg text-black transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
              style={{ background: '#fff' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Написати у WhatsApp
            </a>
          </Reveal>
        </div>
      </section>

      {/* ─── Scoped CSS ───────────────────────────────────── */}
      <style>{`
        /* Gradient mesh blobs */
        .hero-mesh-1, .hero-mesh-2, .hero-mesh-3 {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.25;
          will-change: transform;
        }
        .hero-mesh-1 {
          width: 600px; height: 600px;
          background: #0066FF;
          top: -200px; right: -100px;
          animation: mesh-float 15s ease-in-out infinite;
        }
        .hero-mesh-2 {
          width: 500px; height: 500px;
          background: #FF6B35;
          bottom: -150px; left: -100px;
          animation: mesh-float 18s ease-in-out infinite reverse;
        }
        .hero-mesh-3 {
          width: 400px; height: 400px;
          background: #7C3AED;
          top: 30%; left: 50%;
          animation: mesh-float 20s ease-in-out infinite 3s;
        }
        @keyframes mesh-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }

        [data-theme="dark"] .hero-mesh-1 { opacity: 0.12; }
        [data-theme="dark"] .hero-mesh-2 { opacity: 0.10; }
        [data-theme="dark"] .hero-mesh-3 { opacity: 0.08; }

        .hero-badge {
          background: rgba(0, 102, 255, 0.08);
          color: #0066FF;
          border: 1px solid rgba(0, 102, 255, 0.15);
        }
        [data-theme="dark"] .hero-badge {
          background: rgba(0, 170, 255, 0.12);
          color: #00AAFF;
          border-color: rgba(0, 170, 255, 0.2);
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </>
  );
}
