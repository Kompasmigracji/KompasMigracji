'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function FAQ() {
  const t = useTranslations();
  const [open, setOpen] = useState<number | null>(null);

  const items = Array.from({ length: 6 }, (_, i) => ({
    q: t(`faq_q_${i}`),
    a: t(`faq_a_${i}`),
  }));

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t('faq_tag')}</div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>{t('faq_title')}</h2>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((it, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all">
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="font-semibold text-navy text-sm">{it.q}</span>
                <span
                  className="text-primary text-lg flex-shrink-0 transition-transform duration-200"
                  style={{ transform: open === idx ? 'rotate(45deg)' : 'none' }}
                >+</span>
              </button>
              {open === idx && (
                <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                  {it.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
