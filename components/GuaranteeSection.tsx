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
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Наші гарантії</div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Можете нам{' '}
            <em className="gradient-text not-italic">довіряти</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="text-3xl shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-navy text-white p-8 text-center">
          <div className="text-3xl mb-4">🤝</div>
          <h3 className="font-serif text-xl font-light mb-3">
            Не зможемо допомогти? Скажемо чесно.
          </h3>
          <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
            Якщо ваша ситуація потребує інших спеціалістів — направимо вас до потрібних людей.
            Ваше благополуччя важливіше за наш прибуток.
          </p>
          <a
            href="#contact"
            className="inline-block mt-6 px-6 py-3 rounded-xl border border-white/30 text-white text-sm font-semibold no-underline hover:bg-white/10 transition-colors"
          >
            Задати питання безкоштовно →
          </a>
        </div>
      </div>
    </section>
  );
}
