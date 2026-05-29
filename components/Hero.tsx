'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-8 pt-8 border-t border-gray-100">
      <span className="text-xs text-gray-400 font-medium mr-1">Довіряють нам:</span>
      {[
        { label: 'Przelewy24', icon: '🔐' },
        { label: 'SSL захист', icon: '🛡️' },
        { label: 'RODO/GDPR', icon: '📋' },
        { label: '10+ років досвіду', icon: '🏆' },
      ].map((b, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600">
          <span>{b.icon}</span>
          <span>{b.label}</span>
        </span>
      ))}
    </div>
  );
}

function PanicStrip() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 rounded-xl border-2 border-red-200 bg-red-50/50 p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🆘</span>
          <div>
            <div className="font-bold text-red-700 text-sm">Термінова ситуація?</div>
            <div className="text-xs text-red-600">Депортація · Відмова · Суд · Криза</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="tel:+48729271848"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-bold no-underline"
            style={{ background: '#dc2626' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
            </svg>
            Зателефонувати
          </a>
          <a
            href="https://wa.me/48729271848?text=ТЕРМІНОВО+—+потребую+негайної+допомоги+в+міграційній+справі"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-bold no-underline"
            style={{ background: '#25D366' }}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const t = useTranslations();

  return (
    <section
      className="hero-section relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fb 50%, #ffffff 100%)', paddingTop: 'calc(5rem + 80px)', paddingBottom: '96px' }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08), transparent)', transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.08), transparent)', transform: 'translate(-30%, 30%)' }}
      />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="animate-slide-down">
          <span className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-primary mb-10 shadow-sm">
            <span>✦</span>
            <span>{t('hero_badge')}</span>
          </span>
        </div>
        <h1
          className="animate-slide-down-1 font-serif font-light leading-tight mb-8"
          style={{ fontSize: 'clamp(40px, 6vw, 70px)', letterSpacing: '-0.5px' }}
        >
          <span className="text-navy">{t('hero_title').split(' ').slice(0, 3).join(' ')}</span>
          {' '}
          <em className="gradient-text not-italic">{t('hero_title').split(' ').slice(3).join(' ')}</em>
        </h1>
        <p className="animate-slide-down-2 text-gray-500 text-lg leading-relaxed mb-10 max-w-xl">
          {t('hero_sub')}
        </p>
        <div className="animate-slide-down-3 flex flex-wrap gap-4">
          <a
            href="#contact"
            className="gradient-btn text-white font-semibold px-7 py-3.5 rounded-lg text-sm no-underline inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            {t('cta_consult')}
          </a>
          <a
            href="https://wa.me/48729271848?text=Потребую+допомоги+з+міграційним+питанням"
            target="_blank"
            rel="noreferrer"
            className="bg-white border-2 border-gray-200 text-navy font-semibold px-7 py-3.5 rounded-lg text-sm no-underline inline-flex items-center gap-2 hover:border-primary hover:text-primary transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="viber://chat?number=48729271848"
            className="bg-white border-2 border-purple-400 text-purple-700 font-semibold px-7 py-3.5 rounded-lg text-sm no-underline inline-flex items-center gap-2 hover:border-purple-600 hover:text-purple-900 transition-colors"
          >
            Viber
          </a>
        </div>

        <PanicStrip />

        <TrustBadges />
      </div>
    </section>
  );
}
