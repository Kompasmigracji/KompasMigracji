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


/* ════════════════════════════════════════════════════════════ */
/*                     MAIN HERO COMPONENT                     */
/* ════════════════════════════════════════════════════════════ */
export default function Hero({ onShowMore }: { onShowMore?: () => void }) {
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

        {/* Text Content */}
        <div className="w-full max-w-4xl mx-auto flex flex-col justify-center items-center relative z-10 pt-32 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 hero-badge mx-auto"
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
            className="text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12"
            style={{ color: 'var(--dim)', lineHeight: 1.5 }}
          >
            {t('hero_sub')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://wa.me/48729271848"
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg text-gray-900 overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/25"
              style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t('cta_consult')}
              </span>
            </a>
            <button
              onClick={onShowMore}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-[1.03] cursor-pointer"
              style={{ border: '2px solid var(--border)', color: 'var(--text)', background: 'transparent' }}
            >
              {t('services_more') || 'Więcej'}
            </button>
          </motion.div>
        </div>


      </section>


      {/* ─── BOTTOM CTA ───────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0066FF 150%)' }} />
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6" style={{ letterSpacing: '-0.03em' }}>
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
