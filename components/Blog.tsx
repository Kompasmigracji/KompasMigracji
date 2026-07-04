'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';

const VIDEOS = [
  {
    id: 'DXE0LSclSgO',
    titleKey: 'blog_v1_title',
    descKey: 'blog_v1_desc',
    tagKey: 'blog_v1_tag',
    color: 'from-blue-600/20 to-purple-600/20',
    spanClass: 'md:col-span-2 md:row-span-2', // Bento highlight
  },
  {
    id: 'DW9VsneCeDd',
    titleKey: 'blog_v2_title',
    descKey: 'blog_v2_desc',
    tagKey: 'blog_v2_tag',
    color: 'from-purple-600/20 to-pink-600/20',
    spanClass: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 'DPN7km-iAYg',
    titleKey: 'blog_v3_title',
    descKey: 'blog_v3_desc',
    tagKey: 'blog_v3_tag',
    color: 'from-blue-500/20 to-cyan-500/20',
    spanClass: 'md:col-span-1 md:row-span-1',
  },
];

function PlayIcon() {
  return (
    <div className="relative group-hover:scale-110 transition-transform duration-300">
      <div className="absolute inset-0 bg-white/20 rounded-full blur-md" />
      <svg viewBox="0 0 80 80" fill="none" className="w-14 h-14 relative z-10 drop-shadow-xl">
        <circle cx="40" cy="40" r="40" fill="rgba(0,0,0,0.6)" className="backdrop-blur-md" />
        <polygon points="34,26 56,40 34,54" fill="#fff" />
      </svg>
    </div>
  );
}

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-[400px] aspect-[9/16] rounded-3xl overflow-hidden bg-[#111] border border-black/10 shadow-[0_0_50px_rgba(0,0,0,0.05)]"
        >
          <iframe
            src={`https://www.instagram.com/reel/${videoId}/embed/`}
            title="Video"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-none"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-gray-900 backdrop-blur-md border border-black/20 hover:bg-black/70 hover:scale-105 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function BlogCard({ v, i, t, onClick }: { v: any, i: number, t: any, onClick: () => void }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`group cursor-pointer relative overflow-hidden rounded-[2rem] bg-white/60 border border-black/10 backdrop-blur-xl hover:border-black/20 transition-colors flex flex-col ${v.spanClass}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-20"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      
      <div className={`relative flex-shrink-0 w-full bg-gradient-to-br ${v.color} flex items-center justify-center overflow-hidden border-b border-black/10`} 
           style={{ aspectRatio: v.spanClass.includes('row-span-2') ? '16/10' : '16/9' }}>
        
        {/* Abstract Background pattern for video placeholder */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <PlayIcon />
        
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 bg-black/40 backdrop-blur-md rounded-full border border-black/20">
            Instagram Reels
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 flex flex-col flex-grow relative z-10">
        <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">{t(v.tagKey)}</div>
        <h3 className={`font-display font-semibold text-white mb-3 ${v.spanClass.includes('col-span-2') ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
          {t(v.titleKey)}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed flex-grow">
          {t(v.descKey)}
        </p>
      </div>
    </motion.div>
  );
}

export default function Blog() {
  const t = useTranslations();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="blog" className="py-24 sm:py-32 relative bg-[#f5f5f7] text-gray-900 overflow-hidden">
      {/* Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-black/10 text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t('blog_section')}
          </div>
          <h2 className="font-display tracking-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
            {t('blog_title')}
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-4 max-w-xl mx-auto">
            {t('blog_desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[minmax(250px,auto)]">
          {VIDEOS.map((v, i) => (
            <BlogCard key={v.id} v={v} i={i} t={t} onClick={() => setActive(v.id)} />
          ))}
        </div>
      </div>

      {active && <VideoModal videoId={active} onClose={() => setActive(null)} />}
    </section>
  );
}
