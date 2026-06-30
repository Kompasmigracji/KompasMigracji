'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const EMOTIONAL_ITEMS = [
  {
    q: 'Я в паніці і не знаю що робити. З чого почати?',
    a: 'Зробіть один крок — напишіть нам у WhatsApp або зателефонуйте. Ми самі розберемося з чого починати у вашій ситуації. Вам не потрібно нічого знати заздалегідь — для цього і існуємо ми. Перша консультація безкоштовна і без зобов\'язань.',
    panic: true,
  },
  {
    q: 'У мене немає грошей. Чи можете ви мені допомогти?',
    a: 'Так. Починаємо з безкоштовної 2-хвилинної оцінки. Якщо потрібна платна допомога — підберемо план, який відповідає вашому бюджету. Також маємо гнучку систему оплати частинами для складних справ. Гроші не мають бути причиною, щоб залишитися без допомоги.',
    panic: false,
  },
  {
    q: 'Мені відмовили у Karcie pobytu. Це кінець?',
    a: 'Ні. Відмова — це не кінець. Є право на оскарження рішення протягом 14 днів. Ми маємо досвід успішного оскарження відмов. Зв\'яжіться з нами якомога швидше — часові рамки важливі.',
    panic: true,
  },
];

export default function FAQ() {
  const t = useTranslations();
  const [open, setOpen] = useState<number | null>(null);

  const translatedItems = Array.from({ length: 6 }, (_, i) => ({
    q: t(`faq_q_${i}`),
    a: t(`faq_a_${i}`),
    panic: false,
  }));

  const items = [...EMOTIONAL_ITEMS, ...translatedItems];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t('faq_tag')}</div>
          <h2 className="font-display tracking-tight font-semibold text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>{t('faq_title')}</h2>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((it, idx) => (
            <div
              key={idx}
              className={`apple-card overflow-hidden transition-all hover-lift ${it.panic ? 'border-red-200/50 bg-red-50/10' : 'border-transparent'}`}
            >
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <div className="flex items-center gap-3">
                  {it.panic && <span className="text-red-500 text-lg shrink-0">⚡</span>}
                  <span className={`font-semibold text-sm ${it.panic ? 'text-red-800' : 'text-navy'}`}>{it.q}</span>
                </div>
                <span
                  className={`text-lg flex-shrink-0 transition-transform duration-200 ${it.panic ? 'text-red-500' : 'text-primary'}`}
                  style={{ transform: open === idx ? 'rotate(45deg)' : 'none' }}
                >+</span>
              </button>
              {open === idx && (
                <div className={`px-6 pb-5 text-sm leading-relaxed border-t pt-3 ${it.panic ? 'border-red-100 text-red-900 bg-red-50/30' : 'border-gray-100 text-gray-500'}`}>
                  {it.a}
                  {it.panic && (
                    <div className="mt-4 flex gap-2">
                      <a
                        href="https://wa.me/48729271848?text=Потребую+термінової+допомоги"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-semibold no-underline shadow-sm hover:opacity-90"
                        style={{ background: '#25D366' }}
                      >
                        Написати в WhatsApp →
                      </a>
                      <a
                        href="tel:+48729271848"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-navy text-xs font-semibold no-underline border border-gray-200 hover:border-red-300 transition-colors bg-white"
                      >
                        Зателефонувати
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
