import React from 'react';

const PHOTO = 'https://yt3.ggpht.com/lu2REm3NMXphDWjWEz1mM9Ja8fUjdLNxMLr6pNHw5nPIcoK_vTFi9a9IAc8o173f5lGhhKlwl8LO=s1024-rw-nd-v1';

const STATS = [
  { val: '10+',   label: 'років досвіду' },
  { val: '1200+', label: 'справ закрито' },
  { val: '24/7', label: 'на звʼязку' },
];

export default function Team() {
  return (
    <section className="py-24 bg-soft">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            НАШІ КОНСУЛЬТАНТИ
          </div>
          <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Хто вас консультує
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row card-hover">

            <div className="md:w-72 flex-shrink-0 relative">
              <img
                src={PHOTO}
                alt="Олександр Василишин"
                className="w-full h-72 md:h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent md:bg-gradient-to-r" />
            </div>

            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                  Засновник · Міграційний юрист
                </div>
                <h3 className="text-2xl font-black text-navy mb-4 leading-tight">
                  Олександр Василишин
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  10 років у міграційному праві Польщі. Особисто веде кожну консультацію та завжди бере трубку.
                  Засновник Kompas Migracji — єдиного вікна для вирішення всіх бюрократичних задач
                  українців в ЄС.
                </p>

                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6 mb-8">
                  {STATS.map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-2xl font-black text-primary">{s.val}</div>
                      <div className="text-xs text-muted mt-1 leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://wa.me/48729271848"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25d366] text-white font-bold text-sm py-3 px-6 rounded-xl hover:opacity-90 transition-opacity no-underline"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.5 0-.2-.1-.4-.2-.5-.1-.2-.6-1.5-.9-2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.1 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.6.2-1.2.2-1.3 0-.1-.3-.2-.5-.3z"/>
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.5 5.9L0 24l6.3-1.6C8.1 23.4 10 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0zm0 21.8c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.8 1 1-3.7-.2-.4C2.3 15.5 1.8 13.8 1.8 12 1.8 6.4 6.4 1.8 12 1.8S22.2 6.4 22.2 12 17.6 21.8 12 21.8z"/>
                </svg>
                Записатися на консультацію
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
