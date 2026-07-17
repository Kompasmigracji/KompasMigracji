"use client";
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';

type Lang = 'uk' | 'pl';

/** This document only exists in uk/pl — map the other 3 site locales to the
 * closer of the two rather than always defaulting to Polish regardless of
 * which locale the visitor is actually on. */
function defaultLangFor(locale: string): Lang {
  return locale === 'pl' || locale === 'en' || locale === 'rom' ? 'pl' : 'uk';
}

const stepsPL = [
  {
    title: "Wybór usługi",
    desc: "Zapoznaj się z naszą ofertą na stronie głównej lub w zakładce Cennik. Wybierz usługę, która odpowiada Twoim potrzebom migracyjnym (np. Karta Pobytu, Konsultacja).",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
      </svg>
    )
  },
  {
    title: "Wypełnienie formularza",
    desc: "Kliknij przycisk 'Zamów' lub przejdź do formularza kontaktowego na dole strony. Podaj swoje dane (imię, telefon, e-mail) oraz opisz krótko swoją sytuację.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    )
  },
  {
    title: "Potwierdzenie i wycena",
    desc: "Nasz specjalista skontaktuje się z Tobą telefonicznie lub przez WhatsApp, aby potwierdzić szczegóły, sprawdzić dokumenty i ustalić ostateczny zakres i koszt prac.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    )
  },
  {
    title: "Płatność online",
    desc: "Otrzymasz od nas bezpieczny link do płatności. Zostaniesz przekierowany do bramki Przelewy24, gdzie możesz opłacić usługę wybraną metodą (BLIK, przelew, karta płatnicza).",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    )
  },
  {
    title: "Realizacja zamówienia",
    desc: "Natychmiast po zaksięgowaniu wpłaty rozpoczynamy pracę nad Twoją sprawą zgodnie z umową. Otrzymasz fakturę VAT na podany adres e-mail oraz stały kontakt z asystentem.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  }
];

const stepsUA = [
  {
    title: "Вибір послуги",
    desc: "Ознайомтеся з нашою пропозицією на головній сторінці або в розділі Ціни. Оберіть послугу, яка відповідає вашим міграційним потребам (напр., Карта Побиту, Консультація).",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
      </svg>
    )
  },
  {
    title: "Заповнення форми",
    desc: "Натисніть кнопку 'Замовити' або перейдіть до контактної форми внизу сторінки. Введіть свої дані (ім'я, телефон) та коротко опишіть свою ситуацію.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    )
  },
  {
    title: "Підтвердження та оцінка",
    desc: "Наш спеціаліст зв'яжеться з вами по телефону або WhatsApp, щоб підтвердити деталі, перевірити документи та визначити остаточний обсяг і вартість робіт.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    )
  },
  {
    title: "Оплата онлайн",
    desc: "Ви отримаєте безпечне посилання на оплату. Вас буде перенаправлено до платіжної системи Przelewy24, де ви зможете оплатити послугу будь-яким зручним способом (BLIK, переказ, картка).",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    )
  },
  {
    title: "Реалізація замовлення",
    desc: "Одразу після зарахування коштів ми починаємо роботу над вашою справою відповідно до домовленостей. Ви також отримаєте рахунок-фактуру (faktura VAT) на email.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  }
];

export default function ManualPage() {
  const siteLocale = useLocale();
  const [lang, setLang] = useState<Lang>(() => defaultLangFor(siteLocale));
  const steps = lang === 'uk' ? stepsUA : stepsPL;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black text-black dark:text-white py-16 px-4 font-display relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-500 no-underline mb-8 transition-colors font-semibold">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          {lang === 'uk' ? 'На головну' : 'Strona główna'}
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2"
            >
              {lang === 'uk' ? 'ІНСТРУКЦІЯ КОРИСТУВАЧА' : 'INSTRUKCJA UŻYTKOWNIKA'}
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tight m-0"
            >
              {lang === 'uk' ? 'Процес замовлення' : 'Ścieżka zakupowa'}
            </motion.h1>
          </div>

          {/* Language Switcher */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 p-1 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl backdrop-blur-md self-start"
          >
            {([
              { id: 'uk' as Lang, flag: '🇺🇦', label: 'Укр' },
              { id: 'pl' as Lang, flag: '🇵🇱', label: 'Pol' },
            ]).map(l => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all ${
                  lang === l.id 
                    ? 'bg-white dark:bg-[#1a1a1a] shadow-sm text-orange-500 border border-black/5 dark:border-white/5' 
                    : 'bg-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white border border-transparent'
                }`}
              >
                <span className="text-lg">{l.flag}</span>
                {l.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Intro text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl p-6 rounded-2xl mb-12"
        >
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed m-0">
            {lang === 'uk' 
              ? 'Прозорість та довіра — наші головні принципи. Нижче ми детально описуємо, як виглядає процес співпраці з нами від першого звернення до успішного завершення справи.'
              : 'Przejrzystość i zaufanie to nasze główne zasady. Poniżej szczegółowo opisujemy, jak wygląda proces współpracy z nami od pierwszego kontaktu do pomyślnego zakończenia sprawy.'
            }
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[27px] top-4 bottom-8 w-[2px] bg-gradient-to-b from-orange-500/50 via-blue-500/30 to-transparent rounded-full" />

          {/* Step items */}
          <div className="flex flex-col gap-10 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="flex gap-6"
              >
                {/* Icon circle */}
                <div className="shrink-0 w-[56px] h-[56px] rounded-2xl bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 shadow-lg flex items-center justify-center text-orange-500 relative z-10">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1.5">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                    <span className="text-gray-400 font-medium mr-2">{idx + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed m-0 text-sm md:text-base">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 pt-8 border-t border-black/5 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            {lang === 'uk' ? 'Безпечні платежі забезпечує PayPro S.A. (Przelewy24)' : 'Bezpieczne płatności obsługuje PayPro S.A. (Przelewy24)'}
          </div>
          <Link href="/" className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform no-underline">
            {lang === 'uk' ? 'На головну' : 'Wróć na stronę główną'}
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
