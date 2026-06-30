const steps = [
  {
    num: '1',
    icon: '📞',
    title: 'Зв\'яжіться з нами',
    desc: 'WhatsApp, Viber або телефон — відповідаємо протягом 2 годин. Пишіть українською — зрозуміємо.',
    highlight: true,
  },
  {
    num: '2',
    icon: '📋',
    title: 'Підготуйте документи',
    desc: 'Паспорт, свідоцтво про народження, підтвердження тимчасового захисту (якщо є). Відсутні документи — допоможемо отримати.',
    highlight: false,
  },
  {
    num: '3',
    icon: '🔍',
    title: 'Безкоштовна оцінка ситуації',
    desc: '2 хвилини розмови достатньо, щоб ми сказали вам що саме робити і скільки це коштує. Без зобов\'язань.',
    highlight: false,
  },
  {
    num: '4',
    icon: '📅',
    title: 'План дій',
    desc: 'Ви отримаєте чіткий план: що, коли і в якій послідовності. Без несподіванок і прихованих витрат.',
    highlight: false,
  },
  {
    num: '5',
    icon: '✅',
    title: 'Виконання під наглядом',
    desc: 'Ведемо вас крок за кроком. На кожному етапі ми на зв\'язку та інформуємо про прогрес.',
    highlight: false,
  },
];

export default function FirstSteps() {
  return (
    <section className="py-24 bg-soft">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Перші кроки</div>
          <h2 className="font-display tracking-tight font-semibold text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Що зробити{' '}
            <em className="gradient-text not-italic">в перші 24 години</em>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Якщо ви щойно опинилися в Польщі і не знаєте що робити — це саме для вас
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-start gap-5 p-8 apple-card hover-lift ${step.highlight ? 'border-red-200/50 bg-red-50/20' : 'border-transparent'}`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${step.highlight ? 'bg-red-100' : 'bg-primary/10'}`}
              >
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={`text-xs font-bold uppercase tracking-wider ${step.highlight ? 'text-red-600' : 'text-primary'}`}>
                    Крок {step.num}
                  </span>
                  {step.highlight && (
                    <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                      Зараз
                    </span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-navy text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://wa.me/48729271848?text=Я+щойно+приїхав+до+Польщі+і+потребую+допомоги+з+міграційним+питанням"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold no-underline transition-premium hover-lift shadow-[0_8px_20px_rgba(37,211,102,0.3)]"
            style={{ background: '#25D366' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Розпочати зараз — WhatsApp
          </a>
          <p className="text-xs text-gray-400 mt-3">Безкоштовно · Без зобов&#x27;язань · Відповідаємо протягом 2 год</p>
        </div>
      </div>
    </section>
  );
}
