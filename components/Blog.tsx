'use client';
import { useState } from 'react';

const VIDEOS = [
  {
    id: 'DXE0LSclSgO',
    title: 'Нові правила карти побуту для українців в Польщі 2026',
    desc: 'Що змінилося у 2026 році: нові вимоги, строки розгляду та порядок подачі документів на карту побуту для громадян України.',
    tag: 'Новини 2026',
    color: 'from-blue-900 to-slate-900',
  },
  {
    id: 'DW9VsneCeDd',
    title: 'Продовження легального перебування та статусу УКР у Польщі',
    desc: 'Розбір закону про продовження легального перебування та статусу УКР для громадян України у Польщі.',
    tag: 'Статус УКР',
    color: 'from-indigo-900 to-slate-900',
  },
  {
    id: 'DPN7km-iAYg',
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
        style={{ width: '100%', maxWidth: 400, aspectRatio: '9/16', position: 'relative' }}
      >
        <iframe
          src={`https://www.instagram.com/reel/${videoId}/embed/`}
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
                {/* Instagram logo watermark */}
                <svg
                  viewBox="0 0 24 24" fill="rgba(255,255,255,0.08)"
                  style={{ position: 'absolute', width: 120, height: 120 }}
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
            href="https://www.instagram.com/kompasmigracji/reels/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-primary hover:text-primary text-sm font-semibold px-6 py-3 rounded-xl transition-all no-underline"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Усі відео в Instagram
          </a>
        </div>
      </div>
      {active && <VideoModal videoId={active} onClose={() => setActive(null)} />}
    </section>
  );
}
