import React from 'react';
import { useTranslation } from 'react-i18next';

export default function HowItWorks() {
  const { t } = useTranslation();
  const steps = Array.from({ length: 4 }, (_, i) => t(`how_step_${i}`));

  return (
    <section id="process" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {t('how_tag')}
          </div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            {t('how_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-serif text-xl font-light shadow-md flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #2563eb, #059669)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="font-semibold text-navy text-sm">
                {t('how_step_label')} {i + 1}
              </div>
              <div className="text-sm text-gray-500 leading-relaxed">{step}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
