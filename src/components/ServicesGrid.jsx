import React from 'react';
import { useTranslation } from 'react-i18next';

const icons = ['🔴','🔵','💛','🟢','📚','🏥','🏠','💼','👨‍👩‍👧','🌍','📄','🤝'];

export default function ServicesGrid() {
  const { t } = useTranslation();
  const services = Array.from({ length: 12 }, (_, i) => ({
    icon: icons[i],
    title: t(`svc_${i}`),
    desc: t(`svc_desc_${i}`),
  }));

  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="services" className="py-24 bg-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {t('services_tag')}
          </div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            {t('services_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl border border-gray-200 card-hover flex flex-col gap-3 cursor-pointer"
              onClick={scrollToContact}
            >
              <div className="text-3xl h-10 flex items-center">{s.icon}</div>
              <h3 className="font-serif text-lg font-medium text-navy">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-grow">{s.desc}</p>
              <span className="text-primary text-sm font-medium self-start">{t('services_more')}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
