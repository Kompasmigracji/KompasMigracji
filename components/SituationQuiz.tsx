'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const WA_MESSAGES = [
  'Потребую+термінової+допомоги+—+загрожує+депортація',
  'Потребую+допомоги+з+картою+побуту+в+Польщі',
  'Потребую+допомоги+з+документами+та+оформленням',
  'Потребую+допомоги+для+моєї+родини+в+Польщі',
  'Потребую+безкоштовної+консультації+—+не+знаю+з+чого+почати',
];

const ICONS = ['🚨', '📋', '📄', '👨‍👩‍👧', '❓'];
const URGENT = [true, false, false, false, false];

export default function SituationQuiz() {
  const t = useTranslations();
  const [selected, setSelected] = useState<number | null>(null);

  const labels = [
    t('sq_1_label'), t('sq_2_label'), t('sq_3_label'),
    t('sq_4_label'), t('sq_5_label'),
  ];

  if (selected !== null) {
    return (
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="text-5xl mb-5">{ICONS[selected]}</div>
          <h3 className="font-serif text-2xl text-navy mb-3 font-light">
            {t('sq_result_title').split('—')[0]}—{' '}
            <em className="gradient-text not-italic">{t('sq_result_title').split('—')[1]?.trim()}</em>
          </h3>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {t('sq_result_sub')}<br />
            <span className="text-xs text-gray-400">{t('sq_result_note')}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/48729271848?text=${WA_MESSAGES[selected]}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-white font-semibold no-underline transition-opacity hover:opacity-90 shadow-lg"
              style={{ background: '#25D366' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('sq_whatsapp')}
            </a>
            <a
              href="tel:+48729271848"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-navy font-semibold no-underline border-2 border-gray-200 hover:border-primary transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
              </svg>
              +48 729 271 848
            </a>
          </div>
          <button
            onClick={() => setSelected(null)}
            className="mt-6 text-sm text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer transition-colors"
          >
            {t('sq_back')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {t('sq_tag')}
          </div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(24px, 3.5vw, 38px)' }}>
            {t('sq_title').split(t('sq_title_em'))[0]}
            <em className="gradient-text not-italic">{t('sq_title_em')}</em>
            {t('sq_title').split(t('sq_title_em'))[1]}
          </h2>
          <p className="text-gray-500 text-sm mt-3">{t('sq_desc')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {labels.map((label, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex items-center gap-4 text-left p-5 rounded-xl border-2 transition-all bg-white cursor-pointer group ${URGENT[i] ? 'border-red-200 hover:border-red-400 hover:shadow-md hover:bg-red-50/30' : 'border-gray-200 hover:border-primary hover:shadow-md'}`}
            >
              <span className="text-3xl shrink-0">{ICONS[i]}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm transition-colors ${URGENT[i] ? 'text-red-700 group-hover:text-red-800' : 'text-navy group-hover:text-primary'}`}>
                  {label}
                </div>
              </div>
              <svg
                className={`shrink-0 transition-colors ${URGENT[i] ? 'text-red-300 group-hover:text-red-500' : 'text-gray-300 group-hover:text-primary'}`}
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
