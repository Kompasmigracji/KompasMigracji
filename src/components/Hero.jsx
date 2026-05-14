import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      className="min-h-screen flex flex-col justify-center pt-16 pb-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fb 50%, #ffffff 100%)',
      }}
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
          <span
            className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-primary mb-10 shadow-sm"
          >
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

        <p
          className="animate-slide-down-2 text-gray-500 text-lg leading-relaxed mb-10 max-w-xl"
        >
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
            href="https://wa.me/48729271848"
            target="_blank"
            rel="noreferrer"
            className="bg-white border-2 border-gray-200 text-navy font-semibold px-7 py-3.5 rounded-lg text-sm no-underline inline-flex items-center gap-2 hover:border-primary hover:text-primary transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="https://invite.viber.com/?g2=AQBlah"
            target="_blank"
            rel="noreferrer"
            className="bg-white border-2 border-purple-400 text-purple-700 font-semibold px-7 py-3.5 rounded-lg text-sm no-underline inline-flex items-center gap-2 hover:border-purple-600 hover:text-purple-900 transition-colors"
          >
            Viber
          </a>
        </div>
      </div>
    </section>
  );
}
