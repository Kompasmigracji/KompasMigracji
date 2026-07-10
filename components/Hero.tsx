'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
    );
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      {/* ─── HERO SECTION ─────────────────────────────────── */}
      <section 
        className="relative w-full flex flex-col items-center justify-center px-6 xl:px-12 overflow-hidden" 
        style={{ minHeight: '100vh', paddingBottom: '4rem' }}
      >
        
        {/* Static gradient background — NO animations on mobile */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-[#fbfbfd] dark:bg-[#0a0a0a]">
          {!isMobile && (
            <>
              <div className="hero-mesh-1" />
              <div className="hero-mesh-2" />
              <div className="hero-mesh-3" />
            </>
          )}
          {/* Simple static gradient for mobile */}
          {isMobile && (
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(0,102,255,0.08) 0%, transparent 70%)' }} />
          )}
        </div>

        {/* Text Content — NO parallax transforms on any device for stability */}
        <motion.div 
          className="w-full max-w-4xl mx-auto flex flex-col justify-center items-center relative z-10 pt-32 pb-16 text-center"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.1 }
            }
          }}
        >
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120 } }
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 hero-badge mx-auto"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Ваш шлях до легалізації починається тут
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
            }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-tighter mb-6"
            style={{ letterSpacing: '-0.04em', lineHeight: 1.05, color: 'var(--text)' }}
          >
            {t('hero_title')}
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
            }}
            className="text-base sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12"
            style={{ color: 'var(--dim)', lineHeight: 1.5 }}
          >
            {t('hero_sub')}
          </motion.p>

          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://wa.me/48729271848"
              target="_blank"
              rel="noreferrer"
              className="premium-btn premium-btn-primary hover:scale-[1.03]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t('cta_consult')}
              </span>
            </a>
            <button
              onClick={onShowMore}
              className="premium-btn hover:scale-[1.03]"
            >
              {t('services_more') || 'Więcej'}
            </button>
          </motion.div>
        </motion.div>

      </section>

      {/* ─── BOTTOM CTA ───────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-6 relative overflow-hidden flex justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl w-full relative z-10 p-8 sm:p-20 rounded-3xl sm:rounded-[3rem] overflow-hidden border border-black/5 dark:border-white/10 shadow-2xl bg-white/70 dark:bg-white/5"
        >
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 70%)' }} />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0) 70%)' }} />
          
          <div className="relative z-20 text-center">
            <Reveal>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
                {t('hero_ready_title')}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-lg mx-auto">
                {t('hero_ready_sub')}
              </p>
              <a
                href="https://wa.me/48729271848"
                target="_blank"
                rel="noreferrer"
                className="premium-btn inline-flex hover:scale-[1.03] transition-transform"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366" className="mr-3"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                {t('contact_whatsapp')}
              </a>
            </Reveal>
          </div>
        </motion.div>
      </section>

      {/* ─── Scoped CSS ───────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Gradient mesh blobs — DESKTOP ONLY, disabled on mobile via JS */
        .hero-mesh-1, .hero-mesh-2, .hero-mesh-3 {
          position: absolute;
          border-radius: 50%;
          opacity: 0.35;
          transform: translateZ(0);
        }
        .hero-mesh-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(0,102,255,0.6) 0%, rgba(0,102,255,0) 65%);
          top: -200px; right: -150px;
          animation: mesh-float 15s ease-in-out infinite;
        }
        .hero-mesh-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,107,53,0.6) 0%, rgba(255,107,53,0) 65%);
          bottom: -200px; left: -150px;
          animation: mesh-float 18s ease-in-out infinite reverse;
        }
        .hero-mesh-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(124,58,237,0.6) 0%, rgba(124,58,237,0) 65%);
          top: 20%; left: 40%;
          animation: mesh-float 20s ease-in-out infinite 3s;
        }
        @keyframes mesh-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(20px, -20px, 0) scale(1.03); }
          66% { transform: translate3d(-15px, 15px, 0) scale(0.97); }
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
      `}} />
    </>
  );
}
