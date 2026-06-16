'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type VideoId = 'project' | 'crm';
type Quality = '1080' | '4k';

const VIDEOS: Record<VideoId, Record<Quality, string>> = {
  project: {
    '1080': '/videos/kompas-migracji-intro.mp4',
    '4k': '/videos/kompas-migracji-intro-4k.mp4',
  },
  crm: {
    '1080': '/videos/kompascrm-intro.mp4',
    '4k': '/videos/kompascrm-intro-4k.mp4',
  },
};

function VideoCard({
  id,
  title,
  subtitle,
  duration,
}: {
  id: VideoId;
  title: string;
  subtitle: string;
  duration: string;
}) {
  const t = useTranslations();
  const [quality, setQuality] = useState<Quality>('1080');
  const src = VIDEOS[id][quality];

  return (
    <article className="rounded-2xl overflow-hidden border border-white/10"
      style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(0,0,0,0.4))' }}>
      <div className="relative aspect-video bg-black">
        <video
          key={src}
          className="w-full h-full object-cover"
          controls
          playsInline
          preload="metadata"
          poster=""
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h2>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>
          <span className="text-xs font-semibold text-amber-400/80 px-3 py-1 rounded-full border border-amber-400/20">
            {duration}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(['1080', '4k'] as Quality[]).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuality(q)}
                className="px-4 py-2 text-xs font-bold transition-colors"
                style={{
                  background: quality === q ? 'linear-gradient(135deg,#d4af37,#f59e0b)' : 'rgba(255,255,255,0.04)',
                  color: quality === q ? '#0f172a' : '#9ca3af',
                }}
              >
                {q === '1080' ? '1080p HD' : '4K UHD'}
              </button>
            ))}
          </div>
          <a
            href={src}
            download
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 no-underline px-3 py-2 rounded-lg border border-cyan-400/20 hover:border-cyan-400/40 transition-colors"
          >
            {t('videos_download')} ↓
          </a>
        </div>
      </div>
    </article>
  );
}

export default function VideosPageContent() {
  const t = useTranslations();

  return (
    <>
      <Header />
      <main className="pt-[62px] min-h-screen" style={{ background: 'linear-gradient(180deg, #070c1a 0%, #0f172a 40%, #070c1a 100%)' }}>
        {/* Hero */}
        <section className="py-16 md:py-24 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-40"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,245,255,0.12), transparent)' }} />
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.35em] text-amber-400/80 mb-6">
              {t('videos_page_badge')}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
              {t('videos_page_title')}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              {t('videos_page_desc')}
            </p>
          </div>
        </section>

        {/* Videos grid */}
        <section className="px-6 pb-12 max-w-5xl mx-auto space-y-10">
          <VideoCard
            id="project"
            title={t('videos_project_title')}
            subtitle={t('videos_project_sub')}
            duration={t('videos_duration')}
          />
          <VideoCard
            id="crm"
            title={t('videos_crm_title')}
            subtitle={t('videos_crm_sub')}
            duration={t('videos_duration')}
          />
        </section>

        {/* Credits */}
        <section className="px-6 pb-20 max-w-3xl mx-auto text-center">
          <div className="rounded-xl border border-white/10 p-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('videos_credits')}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
