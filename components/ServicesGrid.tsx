'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const icons = ['🔴','🔵','💛','🟢','📚','🏥','🏠','💼','👨‍👩‍👧','🌍','📄','🤝'];

const URGENT_INDICES = [0, 1, 2];
const URGENT_LABEL = ['ТЕРМІНОВО', 'ТОП', 'ВАЖЛИВО'];

export default function ServicesGrid() {
  const t = useTranslations();
  const [pickerService, setPickerService] = useState<string | null>(null);

  const services = Array.from({ length: 12 }, (_, i) => ({
    icon: icons[i],
    title: t(`svc_${i}`),
    desc: t(`svc_desc_${i}`),
    urgentIdx: URGENT_INDICES.indexOf(i),
  }));

  return (
    <section id="services" className="py-24 bg-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t('services_tag')}</div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>{t('services_title')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className={`relative bg-white p-8 rounded-xl border-2 card-hover flex flex-col gap-3 cursor-pointer transition-all ${s.urgentIdx >= 0 ? 'border-red-200 hover:border-red-400' : 'border-gray-200 hover:border-primary'}`}
              onClick={() => window.dispatchEvent(new CustomEvent('OPEN_AI_CHAT', { detail: s.title }))}
            >
              {s.urgentIdx >= 0 && (
                <span
                  className="absolute -top-3 left-5 text-white text-[10px] font-bold px-3 py-1 rounded-full"
                  style={{ background: s.urgentIdx === 0 ? '#dc2626' : s.urgentIdx === 1 ? '#2563eb' : '#d97706' }}
                >
                  {URGENT_LABEL[s.urgentIdx]}
                </span>
              )}
              <div className="text-3xl h-10 flex items-center">{s.icon}</div>
              <h3 className="font-serif text-lg font-medium text-navy">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-grow">{s.desc}</p>
              <span className={`text-sm font-medium self-start ${s.urgentIdx >= 0 ? 'text-red-600' : 'text-primary'}`}>
                {s.urgentIdx === 0 ? '→ Отримати допомогу зараз' : t('services_more')}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
