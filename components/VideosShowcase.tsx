'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';

export default function VideosShowcase() {
  const t = useTranslations();

  return (
    <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 p-8 md:p-12"
          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.3))', backdropFilter: 'blur(12px)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.25), transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3), transparent)', transform: 'translate(-30%, 30%)' }} />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                style={{ background: 'rgba(0,245,255,0.12)', color: '#67e8f9', border: '1px solid rgba(0,245,255,0.25)' }}>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {t('videos_badge')}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-3 leading-tight">
                {t('videos_home_title')}
              </h2>
              <p className="text-gray-400 text-base leading-relaxed max-w-lg mb-6">
                {t('videos_home_desc')}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="px-3 py-1 rounded-full border border-white/10">🎬 1080p + 4K</span>
                <span className="px-3 py-1 rounded-full border border-white/10">🤖 Kompas AI</span>
                <span className="px-3 py-1 rounded-full border border-white/10">🏆 Founder · Vasylyshyn</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/videos"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm no-underline text-white transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #d4af37, #f59e0b)',
                  boxShadow: '0 8px 32px rgba(212,175,55,0.35)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                {t('videos_home_cta')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
