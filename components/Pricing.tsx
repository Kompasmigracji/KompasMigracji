'use client';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';

export default function Pricing() {
  const t = useTranslations();

  const handleCta = async (label: string) => {
    if (supabase) { try { await supabase.from('leads').insert({ service: label, source: 'pricing' }); } catch {} }
    window.open('https://wa.me/48729271848', '_blank');
  };

  const cards = [
    {
      label: t('pricing_free_label'),
      amount: t('pricing_free_amount'),
      currency: null,
      desc: t('pricing_free_desc'),
      features: [t('pricing_free_f1'), t('pricing_free_f2')],
      cta: t('pricing_free_cta'),
      featured: false,
    },
    {
      label: t('pricing_consult_label'),
      amount: '150',
      currency: 'zł',
      badge: t('pricing_consult_badge'),
      desc: t('pricing_consult_desc'),
      features: [t('pricing_consult_f1'), t('pricing_consult_f2'), t('pricing_consult_f3')],
      cta: t('pricing_consult_cta'),
      featured: true,
    },
    {
      label: t('pricing_hour_label'),
      amount: '450',
      currency: 'zł',
      desc: t('pricing_hour_desc'),
      features: [t('pricing_hour_f1'), t('pricing_hour_f2'), t('pricing_hour_f3')],
      cta: t('pricing_hour_cta'),
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t('pricing_tag')}</div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>{t('pricing_title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`relative bg-white rounded-xl p-8 border-2 flex flex-col transition-all duration-300 ${card.featured ? 'border-primary shadow-xl scale-105' : 'border-gray-200 hover:border-primary hover:shadow-lg'}`}
            >
              {card.badge && (
                <span className="absolute -top-4 right-5 text-white text-xs font-semibold px-4 py-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, #2563eb, #059669)' }}>
                  {card.badge}
                </span>
              )}
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">{card.label}</div>
              <div className="font-serif font-light text-navy mb-2" style={{ fontSize: '38px' }}>
                {card.amount}
                {card.currency && <sup className="text-lg text-muted"> {card.currency}</sup>}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{card.desc}</p>
              <ul className="border-t border-b border-gray-100 py-5 mb-6 flex flex-col gap-2 flex-grow">
                {card.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-secondary font-bold">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCta(card.label)}
                className={`text-center py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer border-0 ${card.featured ? 'gradient-btn text-white hover:opacity-90' : 'bg-primary text-white hover:bg-secondary'}`}
              >
                {card.cta}
              </button>
              {card.currency && (
                <p className="text-center mt-2" style={{ fontSize: 10, color: '#9ca3af' }}>
                  Замовляючи, ви погоджуєтесь з{' '}
                  <a href="/regulamin" target="_blank" rel="noreferrer" style={{ color: '#9ca3af', textDecoration: 'underline' }}>Regulamin</a>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
