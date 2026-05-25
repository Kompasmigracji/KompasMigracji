'use client';
import { useState } from 'react';

const VIDEOS = [
  {
    id: '24965019156532477',
    title: 'Нові правила карти побуту для українців в Польщі 2026',
    desc: 'Що змінилося у 2026 році: нові вимоги, строки розгляду та порядок подачі документів на карту побуту для громадян України.',
    tag: 'Новини 2026',
    color: 'from-blue-900 to-slate-900',
  },
  {
    id: '1315638563758737',
    title: 'Продовження легального перебування та статусу УКР у Польщі',
    desc: 'Розбір закону про продовження легального перебування та статусу УКР для громадян України у Польщі.',
    tag: 'Статус УКР',
    color: 'from-indigo-900 to-slate-900',
  },
  {
    id: '1906985087370863',
    title: 'Тимчасовий захист, карта ЦУКР та статус УКР — переваги та недоліки',
    desc: 'Порівнюємо тимчасовий захист, карту побуту ЦУКР та статус УКР: що обрати і які права дає кожен статус.',
    tag: 'Карта ЦУКР',
    color: 'from-slate-800 to-blue-950',
  },
];

function PlayIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" width="56" height="56">
      <circle cx="40" cy="40" r="40" fill="rgba(0,0,0,0.55)" />
      <polygon points="32,24 60,40 32,56" fill="#fff" />
    </svg>
  );
}

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.82)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 900, aspectRatio: '16/9', position: 'relative' }}
      >
        <iframe
          src={`https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvideo%2F${videoId}&show_text=false&autoplay=true&width=900`}
          title="Video"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
        />
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: -40, right: 0, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', lineHeight: 1 }}
        >✕</button>
      </div>
    </div>
  );
}

export default function Blog() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">КОРИСНІ МАТЕРІАЛИ</div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>Відео-гайди з міграції</h2>
          <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
            Безкоштовні інструкції про легалізацію в Польщі: Карта побуту, документи, процедури
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VIDEOS.map((v) => (
            <div
              key={v.id}
              className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setActive(v.id)}
            >
              <div
                className={`relative overflow-hidden bg-gradient-to-br ${v.color} flex items-center justify-center`}
                style={{ aspectRatio: '16/9' }}
              >
                {/* Facebook logo watermark */}
                <svg
                  viewBox="0 0 24 24" fill="rgba(255,255,255,0.08)"
                  style={{ position: 'absolute', width: 120, height: 120 }}
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                {/* Play button */}
                <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-200">
                  <PlayIcon />
                </div>
              </div>
              <div className="p-5">
                <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-full mb-3">{v.tag}</span>
                <h3 className="font-semibold text-navy text-sm leading-snug mb-2 group-hover:text-primary transition-colors">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{v.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                  Дивитися
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.facebook.com/kompasmigracji"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-primary hover:text-primary text-sm font-semibold px-6 py-3 rounded-xl transition-all no-underline"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Усі відео на Facebook
          </a>
        </div>
      </div>
      {active && <VideoModal videoId={active} onClose={() => setActive(null)} />}
    </section>
  );
}
