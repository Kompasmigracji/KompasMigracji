'use client';
import { useTranslations } from 'next-intl';

const icons = [
  <svg key="chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  <svg key="map" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  <svg key="card" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  <svg key="trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="8 6 2 6 2 12 8 12"/><polyline points="16 6 22 6 22 12 16 12"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M8 6v6a4 4 0 0 0 8 0V6"/></svg>,
];

export default function HowItWorks() {
  const t = useTranslations();
  const steps = [0, 1, 2, 3, 4].map(i => ({
    name: t(`how_step_${i}_name`),
    desc: t(`how_step_${i}`),
    icon: icons[i],
  }));

  return (
    <section id="process" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t('how_tag')}</div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>{t('how_title')}</h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8">
          <div
            className="hidden md:block absolute top-7 left-0 right-0"
            style={{ height: 1, background: 'linear-gradient(90deg, transparent 6%, #e2e8f0 20%, #e2e8f0 80%, transparent 94%)', zIndex: 0 }}
          />
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center gap-4 z-10">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #059669 100%)' }}>
                {step.icon}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">{t('how_step_label')} {i + 1}</div>
              <div className="font-bold text-navy text-base leading-snug">{step.name}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{step.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="https://wa.me/48729271848"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-8 py-3 rounded-full shadow hover:opacity-90 transition"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M11.99 2C6.48 2 2 6.48 2 12c0 1.874.518 3.624 1.41 5.12L2 22l4.99-1.389A9.96 9.96 0 0 0 11.99 22C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm0 18c-1.65 0-3.18-.458-4.49-1.248l-.32-.19-3.32.923.94-3.22-.21-.33A7.975 7.975 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            WhatsApp — +48 729 271 848
          </a>
        </div>
      </div>
    </section>
  );
}
