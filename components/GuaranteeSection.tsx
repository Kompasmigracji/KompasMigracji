import { useTranslations } from 'next-intl';

const items = [
  {
    icon: '🔒',
    title: 'Повна конфіденційність',
    desc: 'Ваші дані захищені відповідно до RODO. Ми ніколи не передаємо інформацію про клієнтів третім особам.',
  },
  {
    icon: '⚖️',
    title: 'Тільки законні методи',
    desc: 'Працюємо виключно в рамках польського та європейського права. Нуль корупції, нуль обхідних шляхів.',
  },
  {
    icon: '💰',
    title: 'Прозорі ціни',
    desc: 'Ціна узгоджується до початку роботи. Без прихованих платежів і несподіванок наприкінці.',
  },
  {
    icon: '📞',
    title: 'Завжди на зв\'язку',
    desc: 'Відповідаємо протягом 2 годин в робочі дні. Ви в курсі кожного кроку вашої справи.',
  },
];

export default function GuaranteeSection() {
  const t = useTranslations();
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t('guarantee_tag')}</div>
          <h2 className="font-display tracking-tight font-semibold text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            {t('guarantee_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-5 apple-card p-8 border-transparent hover:border-primary/20"
            >
              <div className="text-3xl shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-display font-semibold text-lg text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-navy text-white p-10 md:p-12 text-center shadow-xl">
          <div className="text-4xl mb-4">🤝</div>
          <h3 className="font-display tracking-tight text-2xl font-semibold mb-3">
            Не зможемо допомогти? Скажемо чесно.
          </h3>
          <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
            Якщо ваша ситуація потребує інших спеціалістів — направимо вас до потрібних людей.
            Ваше благополуччя важливіше за наш прибуток.
          </p>
          <a
            href="#contact"
            className="inline-block mt-8 px-8 py-4 rounded-full border border-white/20 text-white text-sm font-semibold no-underline hover:bg-white/10 hover:border-white/40 transition-all hover-lift"
          >
            Задати питання безкоштовно &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
