'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { motion } from 'framer-motion';
import SpotlightCard from '@/components/SpotlightCard';

export default function VideosShowcase() {
  const t = useTranslations();

  return (
    <section className="relative py-32 overflow-hidden bg-[#050505]">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-5xl mx-auto px-6 z-10">
        <SpotlightCard className="p-8 md:p-14 overflow-hidden border border-white/5 ring-1 ring-white/10">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="flex-1">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                {t('videos_badge')}
              </motion.span>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-display tracking-tight text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
              >
                {t('videos_home_title')}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mb-8"
              >
                {t('videos_home_desc')}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3 text-xs text-gray-500 font-medium uppercase tracking-wide"
              >
                <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
                  <span className="text-sm">🎬</span> 1080p + 4K
                </span>
                <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
                  <span className="text-sm">🤖</span> Kompas AI
                </span>
                <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
                  <span className="text-sm">🏆</span> Founder · Vasylyshyn
                </span>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex-shrink-0"
            >
              <Link
                href="/videos"
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-white overflow-hidden no-underline hover:scale-105 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #d4af37, #f59e0b)',
                  boxShadow: '0 8px 40px rgba(212,175,55,0.4)',
                }}
              >
                <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="relative z-10 drop-shadow-md">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span className="relative z-10 drop-shadow-md text-lg">{t('videos_home_cta')}</span>
              </Link>
            </motion.div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
