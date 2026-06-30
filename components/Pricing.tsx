'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import P24PaymentSteps, { CartIcon, UserIcon, CardIcon, CheckCircleIcon } from '@/components/P24PaymentSteps';
import PayModal, { PayService } from '@/components/PayModal';

export default function Pricing() {
  const t = useTranslations();
  const [contactOpen, setContactOpen] = useState<string | null>(null);
  const [payService,  setPayService]  = useState<PayService | null>(null);

  const cards: {
    label: string;
    amount: string;
    currency: string | null;
    badge?: string;
    desc: string;
    features: string[];
    cta: string;
    featured: boolean;
    oldAmount?: string;
    amountGrosze?: number;
  }[] = [
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
      amountGrosze: 15000,
    },
    {
      label: t('pricing_hour_label'),
      amount: '450',
      currency: 'zł',
      badge: t('pricing_hour_badge'),
      desc: t('pricing_hour_desc'),
      features: [t('pricing_hour_f1'), t('pricing_hour_f2'), t('pricing_hour_f3')],
      cta: t('pricing_hour_order'),
      featured: false,
      amountGrosze: 45000,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t('pricing_tag')}</div>
          <h2 className="font-display font-semibold text-navy tracking-tight" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>{t('pricing_title')}</h2>
        </div>



        {/* Subscription plans banner */}
        <div className="mb-10 apple-card border border-primary/20 bg-blue-50/30 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">{t('pricing_sub_tag')}</div>
            <p className="text-navy font-semibold text-base leading-snug">{t('pricing_sub_desc')}</p>
          </div>
          <a
            href="/plans"
            className="shrink-0 px-8 py-4 rounded-full text-sm font-bold text-white bg-union-blue hover-lift transition-premium no-underline shadow-[0_8px_20px_rgba(0,102,204,0.3)]"
          >
            {t('pricing_sub_cta')}
          </a>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-16">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`relative apple-card p-10 flex flex-col transition-premium hover-lift ${card.featured ? 'border-primary/50 shadow-2xl scale-105 ring-4 ring-primary/10' : ''}`}
            >
              {card.badge && (
                <span className="absolute -top-4 right-5 text-white text-xs font-semibold px-4 py-1.5 rounded-full" style={{ background: card.oldAmount ? 'linear-gradient(135deg, #f97316, #dc2626)' : 'linear-gradient(135deg, #2563eb, #059669)' }}>
                  {card.badge}
                </span>
              )}
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">{card.label}</div>
              <div className="mb-2">
                {card.oldAmount && (
                  <span className="text-base text-gray-400 line-through mr-2">{card.oldAmount} {card.currency}</span>
                )}
                <span className="font-display font-bold text-navy tracking-tighter" style={{ fontSize: '48px' }}>
                  {card.amount}
                  {card.currency && <sup className="text-xl text-muted font-normal"> {card.currency}</sup>}
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{card.desc}</p>
              <ul className="border-t border-b border-gray-100 py-5 mb-6 flex flex-col gap-2 flex-grow">
                {card.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-secondary font-bold">✓</span>{f}
                  </li>
                ))}
              </ul>

              {/* CTA: paid cards → P24 modal, free card → inline contact picker */}
              {card.amountGrosze ? (
                <button
                  onClick={() => setPayService({ name: card.label, amountGrosze: card.amountGrosze!, oldPrice: card.oldAmount })}
                  className={`text-center py-4 rounded-full text-sm font-bold cursor-pointer border-0 hover-lift transition-premium shadow-sm ${card.featured ? 'bg-union-blue text-white shadow-[0_8px_20px_rgba(0,102,204,0.3)]' : 'bg-gray-100 text-navy hover:bg-gray-200'}`}
                >
                  {card.cta}
                </button>
              ) : contactOpen === card.label ? (
                <div className="flex flex-col gap-2">
                  <a href="https://wa.me/48729271848" target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
                    style={{ background: '#25D366' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                  <a href="viber://chat?number=48729271848"
                    className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
                    style={{ background: '#7360f2' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.4 0C5.64 0 1.15 4.43 1.15 10.12c0 2.76 1.08 5.26 2.83 7.1L2.4 21.6l4.6-1.47a10.27 10.27 0 004.4.98c5.76 0 10.45-4.43 10.45-9.99C21.85 5.43 17.26 0 11.4 0zm5.57 14.86c-.24.67-.7 1.22-1.29 1.5-.35.16-.73.28-1.12.28-.38 0-.77-.07-1.15-.19a11.14 11.14 0 01-5.6-5.6c-.12-.38-.19-.77-.19-1.15 0-.39.12-.77.28-1.12.28-.59.83-1.05 1.5-1.29.17-.06.35-.09.52-.09.23 0 .44.04.64.13.24.1.44.28.6.52l.8 1.08c.16.22.25.48.25.74 0 .31-.1.6-.28.85l-.38.53c.34.78.96 1.4 1.74 1.74l.53-.38c.25-.18.54-.28.85-.28.26 0 .52.09.74.25l1.08.8c.24.16.42.36.52.6.09.2.13.41.13.64 0 .17-.03.35-.09.52z"/></svg>
                    Viber
                  </a>
                  <a href="tel:+48729271848"
                    className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold no-underline transition-colors hover:bg-gray-200"
                    style={{ background: '#f1f5f9', color: '#1e293b' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                    +48 729 271 848
                  </a>
                  <button onClick={() => setContactOpen(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors py-1 border-0 bg-transparent cursor-pointer">
                    Zamknij ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setContactOpen(card.label)}
                  className={`text-center py-4 rounded-full text-sm font-semibold transition-all cursor-pointer border-0 hover-lift ${card.featured ? 'bg-union-blue text-white shadow-[0_8px_20px_rgba(0,102,204,0.3)]' : 'bg-gray-100 text-navy hover:bg-gray-200'}`}
                >
                  {card.cta}
                </button>
              )}

              {card.currency && (
                <p className="text-center mt-2" style={{ fontSize: 10, color: '#9ca3af' }}>
                  Składając zamówienie, akceptujesz{' '}
                  <a href="/regulamin" target="_blank" rel="noreferrer" style={{ color: '#9ca3af', textDecoration: 'underline' }}>Regulamin Sklepu</a>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* How payments work — Przelewy24 branded (after the cards) */}
        <P24PaymentSteps
          title={t('pricing_how_title')}
          steps={[
            { n:'01', icon:<CartIcon />,        title:t('pricing_step1_title'), desc:t('pricing_step1_desc') },
            { n:'02', icon:<UserIcon />,        title:t('pricing_step2_title'), desc:t('pricing_step2_desc') },
            { n:'03', icon:<CardIcon />,        title:t('pricing_step3_title'), desc:t('pricing_step3_desc') },
            { n:'04', icon:<CheckCircleIcon />, title:t('pricing_step4_title'), desc:t('pricing_step4_desc') },
          ]}
          securityNote={`${t('pricing_safe_title')} · ${t('pricing_safe_desc')}`}
        />
      </div>

      {payService && <PayModal service={payService} onClose={() => setPayService(null)} />}
    </section>
  );
}
