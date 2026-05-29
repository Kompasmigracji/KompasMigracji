import Link from 'next/link';

function Section({ num, title, titlePl, children }: { num?: number | null; title: string; titlePl?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: '#f97316', margin: '0 0 4px', textTransform: 'uppercase' }}>
        {num != null ? `${num}. ` : ''}{title}
      </h2>
      {titlePl && (
        <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 10px', fontStyle: 'italic' }}>{titlePl}</p>
      )}
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, lineHeight: 1.75, color: '#111', margin: '0 0 10px' }}>{children}</p>;
}

function Pl({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, lineHeight: 1.7, color: '#475569', margin: '0 0 8px', borderLeft: '3px solid #e2e8f0', paddingLeft: 12, fontStyle: 'italic' }}>{children}</p>;
}

function List({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '0 0 10px', paddingLeft: 20 }}>
      {items.map((item, i) => <li key={i} style={{ fontSize: 15, lineHeight: 1.75, color: '#111', marginBottom: 4 }}>{item}</li>)}
    </ul>
  );
}

export default function Regulamin() {
  return (
    <div className="min-h-screen bg-white text-black py-16 px-4 font-display">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary no-underline mb-8 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          На головну / Strona główna
        </Link>

        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">REGULAMIN SKLEPU — KOMPAS MIGRACJI</p>
        <h1 className="text-3xl md:text-4xl font-black text-black mb-2 leading-tight tracking-tight">
          Regulamin Kompas Migracji
        </h1>
        <p className="text-base text-gray-700 mb-2 font-semibold">Prawila Kompasu Mihratsii</p>
        <p className="text-sm text-gray-500 mb-12">
          Obowiązuje od dnia publikacji na stronie kompasmigracji.com ·{' '}
          Набирає чинності з дня публікації на сайті kompasmigracji.com
        </p>

        {/* ── PREAMBUŁA ────────────────────────────────────────── */}
        <Section title="Preambuła / Преамбула">
          <Pl>Kompas Migracji to prywatna inicjatywa. Nie rządowa. Nie polityczna. Nasza działalność to wsparcie i ochrona Ukraińców na emigracji. Naszą bronią jest prawo. Naszą metodą — sprawiedliwość.</Pl>
          <P>Компас Міграції — це приватна ініціатива. Не державна. Не політична.</P>
          <P>Ми мирна профспілка українців в еміграції — єдине вікно з розв&apos;язання бюрократичних завдань. Наша зброя — закон. Наш метод — справедливість.</P>
          <P>Ми не обіцяємо результат. Ми обіцяємо зробити все що від нас залежить — по закону і по максимуму.</P>
        </Section>

        {/* ── 1. RODZAJE USŁUG ─────────────────────────────────── */}
        <Section num={1} title="Rodzaje i zakres usług" titlePl="Kinds and scope of services / Види та обсяг послуг">
          <Pl>Kompas Migracji świadczy usługi doradcze i prawne dla obywateli Ukrainy na emigracji w trybie zdalnym.</Pl>
          <P>Компас Міграції надає такі послуги:</P>
          <List items={[
            'Консультації з питань легалізації, документів, прав і захисту в еміграції',
            'Медіація та досудове врегулювання конфліктів',
            'Супровід у держустановах під ключ',
            'Представництво в судах за посередництвом адвоката',
            'Захист від депортації, дискримінації, шахрайства',
            'Підготовка та перевірка документів',
            'Допомога з розшуком людей, перекладацькі та бухгалтерські послуги',
          ]} />
          <Pl>Pełna lista usług i aktualne ceny dostępne są na stronie kompasmigracji.com</Pl>
          <P>Повний перелік послуг і актуальні ціни — на сайті kompasmigracji.com</P>
        </Section>

        {/* ── 2. WARUNKI ŚWIADCZENIA ───────────────────────────── */}
        <Section num={2} title="Warunki świadczenia usług" titlePl="Terms of service / Умови надання послуг">
          <Pl>Usługi świadczone są wyłącznie na podstawie pisemnego potwierdzenia obu stron i dokonania płatności.</Pl>
          <P>Послуги надаються виключно на підставі письмового підтвердження та здійснення оплати.</P>
          <P>Де гроші і де документи — все письмово. Це правило без винятків.</P>
          <Pl>Krok obsługi przez asystenta prawnego — do trzech dni roboczych.</Pl>
          <P>Крок обслуговування юридичним асистентом — до трьох робочих днів.</P>
        </Section>

        {/* ── 3. TERMIN REALIZACJI ZAMÓWIENIA ─────────────────── */}
        <Section num={3} title="Termin realizacji zamówienia" titlePl="Order fulfillment timeline / Терміни виконання замовлення">
          <Pl>
            <strong>Termin realizacji zamówienia:</strong>
          </Pl>
          <Pl>1. Pierwsze skontaktowanie się / nawiązanie kontaktu z klientem: do <strong>24 godzin</strong> w dni robocze od potwierdzenia płatności.</Pl>
          <Pl>2. Przygotowanie indywidualnego pakietu dokumentów: do <strong>3 dni roboczych</strong> od uzyskania wszystkich niezbędnych informacji od klienta.</Pl>
          <Pl>3. Złożenie skargi na bezczynność urzędu (jeśli dotyczy): do <strong>5 dni roboczych</strong> od dostarczenia podpisanego pakietu przez klienta.</Pl>
          <Pl>4. Całkowity czas trwania sprawy: do <strong>60 dni kalendarzowych</strong> (dwa miesiące) — jeżeli urząd nie odpowie, sprawa przekazywana jest do następnego etapu (skarga / sąd).</Pl>
          <Pl>W przypadku niemożności podjęcia sprawy po dokonaniu płatności — <strong>zwrot środków w ciągu 1 dnia roboczego</strong>.</Pl>
          <P>Терміни реалізації замовлення:</P>
          <List items={[
            'Перший контакт: протягом 24 годин у робочі дні після підтвердження оплати',
            'Підготовка індивідуального пакету документів: до 3 робочих днів',
            'Подання скарги на бездіяльність: до 5 робочих днів після отримання підписаного пакету',
            'Загальний строк ведення справи: до 60 календарних днів',
            'Якщо справу не можна взяти після оплати — повернення коштів протягом 1 робочого дня',
          ]} />
        </Section>

        {/* ── 4. WARUNKI ZAWARCIA UMOWY ───────────────────────── */}
        <Section num={4} title="Warunki zawarcia umowy" titlePl="Contract terms / Умови укладення договору">
          <Pl>Umowa uważana jest za zawartą z chwilą pisemnego potwierdzenia gotowości obu stron i dokonania płatności.</Pl>
          <P>Договір вважається укладеним з моменту письмового підтвердження готовності обох сторін і здійснення оплати.</P>
          <P>Клієнт підтверджує що ознайомився з цим Regulamin і погоджується з його умовами в момент першої оплати.</P>
        </Section>

        {/* ── 5. PRAWO DO ODSTĄPIENIA OD UMOWY ───────────────── */}
        <Section num={5} title="Prawo do odstąpienia od umowy" titlePl="Right of withdrawal / Право на відмову від договору">
          <Pl>
            <strong>Konsument ma prawo odstąpić od umowy zawartej na odległość w terminie 14 dni kalendarzowych</strong> bez podania przyczyny, zgodnie z art. 27 ustawy z dnia 30 maja 2014 r. o prawach konsumenta (Dz.U. 2014 poz. 827 ze zm.).
          </Pl>
          <Pl>
            Termin do odstąpienia od umowy wygasa po upływie 14 dni od dnia zawarcia umowy.
          </Pl>
          <Pl>
            Aby skorzystać z prawa do odstąpienia od umowy, należy poinformować nas o swojej decyzji w drodze jednoznacznego oświadczenia wysłanego na adres e-mail lub WhatsApp: <strong>+48 729 271 848</strong>.
          </Pl>
          <Pl>
            <strong>Wyjątek:</strong> Jeżeli na wyraźne życzenie Konsumenta świadczenie usługi rozpocznie się przed upływem terminu do odstąpienia od umowy, Konsument traci prawo do odstąpienia po pełnym wykonaniu usługi (art. 38 pkt 1 ustawy o prawach konsumenta).
          </Pl>
          <Pl>
            Wzór formularza odstąpienia od umowy dostępny jest na żądanie pod adresem: kompasmigracji.com lub pod numerem +48 729 271 848.
          </Pl>
          <Pl>
            W przypadku skutecznego odstąpienia od umowy zwracamy wszystkie otrzymane od Konsumenta płatności niezwłocznie, nie później niż w terminie 14 dni od dnia, w którym zostaliśmy poinformowani o decyzji o odstąpieniu, przy użyciu takich samych sposobów płatności, jakie zostały użyte przez Konsumenta.
          </Pl>
          <P>Споживач має право відмовитись від договору, укладеного дистанційно, протягом <strong>14 календарних днів</strong> без зазначення причини.</P>
          <P>Для відмови — надішліть повідомлення на WhatsApp +48 729 271 848 або email. Кошти повертаються протягом 14 днів.</P>
          <P><strong>Виняток:</strong> якщо послугу вже розпочато за явним проханням клієнта до спливу 14-денного строку — право на відмову втрачається після повного надання послуги.</P>
        </Section>

        {/* ── 6. WARUNKI ROZWIĄZANIA UMOWY ────────────────────── */}
        <Section num={6} title="Warunki rozwiązania umowy" titlePl="Contract termination / Умови розірвання договору">
          <Pl>Klient nie ma prawa żądać zwrotu płatności po rezygnacji z usługi bez stwierdzenia naruszenia ze strony wykonawcy.</Pl>
          <P>Клієнт не має права вимагати оплату назад відмовившись від послуги, без фіксації порушень зі сторони виконавця.</P>
          <P>Розмір оплати розраховується пропорційно до виконаного обсягу в юридичних годинах.</P>
          <P>Компас Міграції має право розірвати договір у разі надання клієнтом неправдивих даних або порушення умов співпраці.</P>
          <P>Якщо є непорозуміння — вирішувати через WhatsApp +48 729 271 848.</P>
        </Section>

        {/* ── 7. REKLAMACJE ───────────────────────────────────── */}
        <Section num={7} title="Reklamacje i skargi" titlePl="Complaints / Скарги та рекламації">
          <Pl>Reklamacje przyjmowane są drogą telefoniczną (WhatsApp) pod numer +48 729 271 848 lub pisemnie na adres e-mail.</Pl>
          <Pl>Termin rozpatrzenia: 14 dni kalendarzowych od daty otrzymania.</Pl>
          <P>Скарги приймаються телефонним дзвінком на WhatsApp +48 729 271 848.</P>
          <P>Строк розгляду — 14 календарних днів з моменту отримання.</P>
        </Section>

        {/* ── 8. DANE FIRMY ───────────────────────────────────── */}
        <Section num={8} title="Dane firmy / Дані компанії">
          <div style={{ background: '#1e293b', borderRadius: 12, padding: '20px 24px', marginBottom: 10 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>DOMUS V Sp. z o.o.</p>
            {[
              ['Adres / Адреса', '02-495 Warszawa, ul. Dzieci Warszawy 27c/49'],
              ['KRS', '0001198474'],
              ['NIP', '522-335-00-30'],
              ['WhatsApp / Viber', '+48 729 271 848'],
              ['Strona / Сайт', 'kompasmigracji.com'],
              ['Nr rachunku / Рахунок', '10 1050 1025 1000 0090 8594 6938'],
              ['PKD', '82.10z, 63.92z, 69.10z, 69.20a, 70.20z, 74.30z, 78.10z, 85.59d, 88.99z'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700, letterSpacing: '0.06em', minWidth: 130, paddingTop: 1 }}>{label}</span>
                <span style={{ fontSize: 14, color: '#cbd5e1' }}>{val}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 9. CENY I PŁATNOŚCI ──────────────────────────────── */}
        <Section num={9} title="Ceny i płatności" titlePl="Prices and payments / Ціни та оплата">
          <Pl>Pierwsze 2 minuty konsultacji — bezpłatne. Aby się zapoznać i zrozumieć sytuację.</Pl>
          <P>Перші 2 хвилини консультації — безкоштовно. Щоб познайомитись і зрозуміти ситуацію.</P>
          <div style={{ background: '#1e293b', borderRadius: 12, padding: '16px 24px', margin: '0 0 12px' }}>
            {[
              ['5 minut / 5 хвилин', '50 zł'],
              ['10 minut / 10 хвилин', '100 zł'],
              ['15 minut / 15 хвилин', '150 zł'],
              ['1 godzina prawna / 1 юридична година', '300 zł (promocja) / 450 zł (cena regularna)'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: '#94a3b8', minWidth: 200 }}>{label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f97316' }}>{val}</span>
              </div>
            ))}
          </div>
          <Pl>Metody płatności: przelew bankowy, Przelewy24.</Pl>
          <P>Методи оплати: банківський переказ, Przelewy24. Фірма виставляє фактуру ПДВ.</P>
        </Section>

        {/* ── 10. ODPOWIEDZIALNOŚĆ ─────────────────────────────── */}
        <Section num={10} title="Odpowiedzialność" titlePl="Liability / Відповідальність">
          <Pl>Decyzję wydaje sąd lub organ administracji — nie Kompas Migracji. Odpowiadamy za jakość pracy zgodnie z uzgodnionym scenariuszem.</Pl>
          <P>Рішення виносить суд або державний орган — не Компас Міграції. Ми відповідаємо за якість роботи і дотримання погодженого сценарію.</P>
        </Section>

        {/* ── 11. POZASĄDOWE ROZSTRZYGANIE SPORÓW ─────────────── */}
        <Section num={11} title="Pozasądowe rozstrzyganie sporów" titlePl="Out-of-court dispute resolution / Позасудове вирішення спорів">
          <Pl>Konsument ma prawo skorzystać z platformy ODR Komisji Europejskiej: <strong>ec.europa.eu/consumers/odr</strong></Pl>
          <P>У разі виникнення спорів клієнт має право звернутися до платформи ODR Європейської комісії: ec.europa.eu/consumers/odr</P>
          <P>Ми також практикуємо медіацію і готові застосувати її до власних спорів з клієнтами.</P>
        </Section>

        {/* ── 12. POUFNOŚĆ ─────────────────────────────────────── */}
        <Section num={12} title="Poufność / Конфіденційність">
          <Pl>Wszystko omawiane w ramach konsultacji pozostaje między Klientem a Kompas Migracji. Nie przekazujemy danych osobom trzecim bez pisemnej zgody.</Pl>
          <P>Все що обговорюється в рамках консультації — залишається між клієнтом і Компасом Міграції. Ми не передаємо дані третім особам без письмової згоди.</P>
        </Section>

        {/* ── 13. CZŁONKOSTWO ──────────────────────────────────── */}
        <Section num={13} title="Członkostwo / Членство">
          <Pl>Jeśli polecasz nas i Twój klient zamówi usługę — otrzymujesz 10% wartości umowy.</Pl>
          <P>Якщо ви рекомендуєте нас і ваш клієнт замовляє послугу — ви отримуєте 10% від суми угоди.</P>
        </Section>

        <div className="border-t border-soft pt-8 mt-4">
          <p className="text-base text-gray-700 leading-relaxed">
            Dziękujemy za wybór Kompas Migracji.<br />
            Дякуємо що нас обрали. Де гроші і документи — все письмово. 🧭
          </p>
          <p className="text-xs text-gray-400 mt-4">
            DOMUS V Sp. z o.o. · NIP 522-335-00-30 · KRS 0001198474 · Warszawa 2026
          </p>
        </div>
      </div>
    </div>
  );
}
