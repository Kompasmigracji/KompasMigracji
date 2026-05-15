import React, { useState } from 'react';

// Замініть VIDEO_ID на реальні YouTube ID відео (напр. 'dQw4w9WgXcQ')
const VIDEOS = [
  {
    id: 'kOzQpxhvPMM',
    title: 'Як отримати Карту побуту в Польщі — покрокова інструкція',
    desc: 'Повний гайд: підстави, документи, строки розгляду в Urząd Wojewódzki. Розбираємо типові помилки при подачі.',
    tag: 'Карта побуту',
  },
  {
    id: '3JZ_D3ELwOQ',
    title: 'Карта резидента ЄС — хто може отримати та як',
    desc: 'Вимоги для Karta Rezydenta UE: 5 років проживання, стабільний дохід, знання польської. Детально про процедуру.',
    tag: 'Кarta rezydenta',
  },
  {
    id: 'L_jWHffIx5E',
    title: 'Документи для карти побуту по роботі — повний список',
    desc: 'Які документи потрібні від роботодавця, від вас особисто та які переклади необхідно зробити у присяжного перекладача.',
    tag: 'Документи',
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

function VideoModal({ videoId, onClose }) {
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
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: -40, right: 0,
            background: 'none', border: 'none', color: '#fff',
            fontSize: 28, cursor: 'pointer', lineHeight: 1,
          }}
        >✕</button>
      </div>
    </div>
  );
}

export default function Blog() {
  const [active, setActive] = useState(null);

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            КОРИСНІ МАТЕРІАЛИ
          </div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Відео-гайди з міграції
          </h2>
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
              {/* Thumbnail */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: '#0f172a' }}>
                <img
                  src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                  alt={v.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
                  style={{ display: 'block' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="transform group-hover:scale-110 transition-transform duration-200">
                    <PlayIcon />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-full mb-3">
                  {v.tag}
                </span>
                <h3 className="font-semibold text-navy text-sm leading-snug mb-2 group-hover:text-primary transition-colors">
                  {v.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {v.desc}
                </p>
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
            href="https://www.youtube.com/@kompasmigracji"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-primary hover:text-primary text-sm font-semibold px-6 py-3 rounded-xl transition-all no-underline"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Усі відео на YouTube
          </a>
        </div>
      </div>

      {active && <VideoModal videoId={active} onClose={() => setActive(null)} />}
    </section>
  );
}
