'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const icons = ['🔴','🔵','💛','🟢','📚','🏥','🏠','💼','👨‍👩‍👧','🌍','📄','🤝'];

const URGENT_INDICES = [0, 1, 2];
const URGENT_LABEL = ['ТЕРМІНОВО', 'ТОП', 'ВАЖЛИВО'];

function ContactPicker({ service, onClose }: { service: string; onClose: () => void }) {
  const waText = encodeURIComponent(`Цікавить послуга: ${service}`);
  return (
    <div
      className="fixed inset-0 z-[9995] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-5">
          <h3 className="font-semibold text-navy text-lg mb-1">Як зв&#x27;язатися?</h3>
          <p className="text-sm text-gray-500">{service}</p>
        </div>
        <div className="flex flex-col gap-3">
          <a
            href={`https://wa.me/48729271848?text=${waText}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold no-underline transition-opacity hover:opacity-90"
            style={{ background: '#25D366' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <a
            href="viber://chat?number=48729271848"
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold no-underline transition-opacity hover:opacity-90"
            style={{ background: '#7360f2' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M11.4 0C5.64 0 1.15 4.43 1.15 10.12c0 2.76 1.08 5.26 2.83 7.1L2.4 21.6l4.6-1.47a10.27 10.27 0 004.4.98c5.76 0 10.45-4.43 10.45-9.99C21.85 5.43 17.26 0 11.4 0zm5.57 14.86c-.24.67-.7 1.22-1.29 1.5-.35.16-.73.28-1.12.28-.38 0-.77-.07-1.15-.19a11.14 11.14 0 01-5.6-5.6c-.12-.38-.19-.77-.19-1.15 0-.39.12-.77.28-1.12.28-.59.83-1.05 1.5-1.29.17-.06.35-.09.52-.09.23 0 .44.04.64.13.24.1.44.28.6.52l.8 1.08c.16.22.25.48.25.74 0 .31-.1.6-.28.85l-.38.53c.34.78.96 1.4 1.74 1.74l.53-.38c.25-.18.54-.28.85-.28.26 0 .52.09.74.25l1.08.8c.24.16.42.36.52.6.09.2.13.41.13.64 0 .17-.03.35-.09.52z"/>
            </svg>
            Viber
          </a>
          <a
            href="tel:+48729271848"
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold no-underline transition-colors hover:bg-gray-100"
            style={{ background: '#f1f5f9', color: '#1e293b' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
            </svg>
            +48 729 271 848
          </a>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 py-2 bg-transparent border-0 cursor-pointer transition-colors"
        >
          Закрити ✕
        </button>
      </div>
    </div>
  );
}

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
              onClick={() => setPickerService(s.title)}
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

      {pickerService && (
        <ContactPicker service={pickerService} onClose={() => setPickerService(null)} />
      )}
    </section>
  );
}
