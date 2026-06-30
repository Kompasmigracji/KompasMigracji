"use client";
import Link from 'next/link';
import { useState } from 'react';

type Lang = 'uk' | 'pl';

const p  = { fontSize: 15, lineHeight: 1.75, color: '#111', margin: '0 0 10px' } as const;
const li = { fontSize: 15, lineHeight: 1.75, color: '#111', marginBottom: 4 } as const;

function Sec({ num, title, children }: { num?: number; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: '#f97316', margin: '0 0 12px', textTransform: 'uppercase' }}>
        {num != null ? `${num}. ` : ''}{title}
      </h2>
      {children}
    </section>
  );
}
function P({ children }: { children: React.ReactNode }) {
  return <p style={p}>{children}</p>;
}
function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
      {items.map((item, i) => <li key={i} style={li}>{item}</li>)}
    </ul>
  );
}
function InfoCard({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: 12, padding: '20px 24px', marginBottom: 10 }}>
      {rows.map(([label, val]) => (
        <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700, letterSpacing: '0.06em', minWidth: 140, paddingTop: 1 }}>{label}</span>
          <span style={{ fontSize: 14, color: '#cbd5e1' }}>{val}</span>
        </div>
      ))}
    </div>
  );
}
function PriceCard({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: 12, padding: '16px 24px', margin: '0 0 12px' }}>
      {rows.map(([label, val]) => (
        <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontSize: 14, color: '#94a3b8', minWidth: 220 }}>{label}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#f97316' }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

// ── UKRAINIAN ─────────────────────────────────────────────────────────────────
function ContentUA() {
  return (
    <>
      <Sec title="Преамбула">
        <P>Компас Міграції — це приватна ініціатива. Не державна. Не політична.</P>
        <P>Ми мирна профспілка українців в еміграції — єдине вікно з розв&apos;язання бюрократичних завдань. Наша зброя — закон. Наш метод — справедливість.</P>
        <P>Ми не обіцяємо результат. Ми обіцяємо зробити все що від нас залежить — по закону і по максимуму.</P>
      </Sec>

      <Sec num={1} title="Види та обсяг послуг">
        <P>Компас Міграції надає наступні послуги дистанційно для громадян України в еміграції:</P>
        <Ul items={[
          'Консультації з питань легалізації, документів, прав і захисту в еміграції',
          'Медіація та досудове врегулювання конфліктів',
          'Супровід у державних установах «під ключ»',
          'Представництво в судах за посередництвом адвоката',
          'Захист від депортації, дискримінації, шахрайства',
          'Підготовка та перевірка документів',
          'Допомога з розшуком людей, перекладацькі та бухгалтерські послуги',
        ]} />
        <P>Повний перелік послуг і актуальні ціни — на сайті kompasmigracji.com</P>
      </Sec>

      <Sec num={2} title="Умови надання послуг">
        <P>Послуги надаються виключно на підставі письмового підтвердження обох сторін та здійснення оплати.</P>
        <P>Де гроші і де документи — все письмово. Це правило без винятків.</P>
        <P>Крок обслуговування юридичним асистентом — до трьох робочих днів.</P>
        <P>Клієнт зобов&apos;язаний надавати достовірну інформацію, необхідну для надання послуги. Надання неправдивих відомостей є підставою для розірвання договору без повернення коштів.</P>
      </Sec>

      <Sec num={3} title="Терміни виконання замовлення">
        <P>Компас Міграції дотримується таких строків виконання замовлень:</P>
        <Ul items={[
          'Перший контакт з клієнтом: протягом 24 годин у робочі дні після підтвердження оплати',
          'Підготовка індивідуального пакету документів: до 3 робочих днів від отримання всієї необхідної інформації від клієнта',
          'Подання скарги на бездіяльність органу (якщо застосовно): до 5 робочих днів після отримання підписаного пакету від клієнта',
          'Загальний строк ведення справи: до 60 календарних днів (два місяці) — якщо орган не відповідає, справа передається до наступного етапу (скарга / суд)',
          'Якщо справу не можна взяти після оплати — повернення коштів протягом 1 робочого дня',
        ]} />
      </Sec>

      <Sec num={4} title="Умови укладення договору">
        <P>Договір вважається укладеним з моменту письмового підтвердження готовності обох сторін і здійснення оплати.</P>
        <P>Клієнт підтверджує, що ознайомився з цими Правилами і погоджується з їх умовами в момент першої оплати.</P>
        <P>Договір є дистанційним у розумінні Закону Польщі від 30 травня 2014 р. про права споживача.</P>
      </Sec>

      <Sec num={5} title="Право на відмову від договору">
        <P><strong>Споживач має право відмовитись від договору, укладеного дистанційно, протягом 14 календарних днів</strong> без зазначення причини, відповідно до ст. 27 Закону від 30 травня 2014 р. про права споживача (Dz.U. 2014 poz. 827 з наступними змінами).</P>
        <P>Строк відмови спливає через 14 днів з дня укладення договору.</P>
        <P>Щоб скористатися правом на відмову, необхідно повідомити нас про своє рішення шляхом однозначної заяви, надісланої на email або WhatsApp: <strong>+48 729 271 848</strong>.</P>
        <P><strong>Виняток:</strong> якщо послугу вже розпочато за явним проханням клієнта до спливу 14-денного строку — право на відмову втрачається після повного надання послуги (ст. 38 п. 1 Закону про права споживача).</P>
        <P>Зразок форми відмови від договору надається на запит за адресою kompasmigracji.com або за номером +48 729 271 848.</P>
        <P>У разі успішної відмови від договору ми повертаємо всі отримані від споживача платежі невідкладно, але не пізніше ніж протягом 14 днів з дня отримання повідомлення про відмову, тим самим способом оплати, яким скористався споживач.</P>
      </Sec>

      <Sec num={6} title="Умови розірвання договору">
        <P>Клієнт не має права вимагати повернення оплати після відмови від послуги без фіксації порушень зі сторони виконавця.</P>
        <P>Розмір оплати розраховується пропорційно до виконаного обсягу в юридичних годинах.</P>
        <P>Компас Міграції має право розірвати договір у разі надання клієнтом неправдивих даних або порушення умов співпраці.</P>
        <P>Якщо є непорозуміння — вирішувати через WhatsApp +48 729 271 848.</P>
      </Sec>

      <Sec num={7} title="Скарги та рекламації">
        <P>Скарги приймаються телефонним дзвінком або повідомленням на WhatsApp +48 729 271 848, а також на електронну пошту.</P>
        <P>Строк розгляду — 14 календарних днів з моменту отримання.</P>
        <P>Відповідь надається тим самим каналом, через який подано скаргу.</P>
      </Sec>

      <Sec num={8} title="Дані компанії">
        <InfoCard rows={[
          ['Компанія', 'DOMUS V Sp. z o.o.'],
          ['Адреса', '02-495 Warszawa, ul. Dzieci Warszawy 27c/49'],
          ['KRS', '0001198474'],
          ['NIP', '522-335-00-30'],
          ['WhatsApp / Viber', '+48 729 271 848'],
          ['Сайт', 'kompasmigracji.com'],
          ['Рахунок', '10 1050 1025 1000 0090 8594 6938'],
          ['PKD', '82.10z, 63.92z, 69.10z, 69.20a, 70.20z, 74.30z, 78.10z, 85.59d, 88.99z'],
        ]} />
      </Sec>

      <Sec num={9} title="Ціни та оплата">
        <P>Перші 2 хвилини консультації — безкоштовно. Щоб познайомитись і зрозуміти ситуацію.</P>
        <PriceCard rows={[
          ['5 хвилин', '50 zł'],
          ['10 хвилин', '100 zł'],
          ['15 хвилин', '150 zł'],
          ['1 юридична година', '450 zł'],
        ]} />
        <P>Методи оплати: банківський переказ, Przelewy24. Фірма виставляє фактуру ПДВ.</P>
      </Sec>

      <Sec num={10} title="Відповідальність">
        <P>Рішення виносить суд або державний орган — не Компас Міграції. Ми відповідаємо за якість роботи і дотримання погодженого сценарію.</P>
        <P>Компас Міграції не несе відповідальності за рішення державних органів, суддів або інших третіх осіб, незалежних від нас.</P>
      </Sec>

      <Sec num={11} title="Позасудове вирішення спорів">
        <P>У разі виникнення спорів клієнт має право звернутися до платформи ODR Європейської комісії: <strong>ec.europa.eu/consumers/odr</strong></P>
        <P>Ми також практикуємо медіацію і готові застосувати її до власних спорів з клієнтами.</P>
      </Sec>

      <Sec num={12} title="Конфіденційність">
        <P>Все що обговорюється в рамках консультації — залишається між клієнтом і Компасом Міграції. Ми не передаємо дані третім особам без письмової згоди.</P>
        <P>Обробка персональних даних здійснюється відповідно до Регламенту GDPR (EU) 2016/679.</P>
      </Sec>

      <Sec num={13} title="Членство та реферальна програма">
        <P>Якщо ви рекомендуєте нас і ваш клієнт замовляє послугу — ви отримуєте 10% від суми угоди.</P>
        <P>Деталі реферальної програми уточнюйте через WhatsApp +48 729 271 848.</P>
      </Sec>
    </>
  );
}

// ── POLISH ────────────────────────────────────────────────────────────────────
function ContentPL() {
  return (
    <>
      <Sec title="Preambuła">
        <P>Kompas Migracji to prywatna inicjatywa. Nie rządowa. Nie polityczna.</P>
        <P>Jesteśmy pokojowym związkiem zawodowym Ukraińców na emigracji — jednym okienkiem do rozwiązywania problemów biurokratycznych. Naszą bronią jest prawo. Naszą metodą — sprawiedliwość.</P>
        <P>Nie obiecujemy wyniku. Obiecujemy zrobić wszystko co w naszej mocy — zgodnie z prawem i w maksymalnym zakresie.</P>
      </Sec>

      <Sec num={1} title="Rodzaje i zakres usług">
        <P>Kompas Migracji świadczy następujące usługi zdalnie dla obywateli Ukrainy na emigracji:</P>
        <Ul items={[
          'Doradztwo w zakresie legalizacji, dokumentów, praw i ochrony na emigracji',
          'Mediacja i pozasądowe rozstrzyganie sporów',
          'Kompleksowe wsparcie w urzędach państwowych',
          'Reprezentacja przed sądami za pośrednictwem adwokata',
          'Ochrona przed deportacją, dyskryminacją i oszustwami',
          'Przygotowanie i weryfikacja dokumentów',
          'Pomoc w poszukiwaniu osób, usługi tłumaczeniowe i księgowe',
        ]} />
        <P>Pełna lista usług i aktualne ceny dostępne są na stronie kompasmigracji.com</P>
      </Sec>

      <Sec num={2} title="Warunki świadczenia usług">
        <P>Usługi świadczone są wyłącznie na podstawie pisemnego potwierdzenia obu stron i dokonania płatności.</P>
        <P>Wszystkie ustalenia dotyczące płatności i dokumentów muszą być potwierdzone pisemnie — bez wyjątków.</P>
        <P>Krok obsługi przez asystenta prawnego — do trzech dni roboczych.</P>
        <P>Klient zobowiązany jest do podania prawdziwych informacji niezbędnych do świadczenia usługi. Podanie nieprawdziwych danych stanowi podstawę do rozwiązania umowy bez zwrotu środków.</P>
      </Sec>

      <Sec num={3} title="Termin realizacji zamówienia">
        <P>Kompas Migracji przestrzega następujących terminów realizacji zamówień:</P>
        <Ul items={[
          'Pierwsze nawiązanie kontaktu z klientem: do 24 godzin w dni robocze od potwierdzenia płatności',
          'Przygotowanie indywidualnego pakietu dokumentów: do 3 dni roboczych od uzyskania wszystkich niezbędnych informacji od klienta',
          'Złożenie skargi na bezczynność urzędu (jeśli dotyczy): do 5 dni roboczych od dostarczenia podpisanego pakietu przez klienta',
          'Całkowity czas trwania sprawy: do 60 dni kalendarzowych (dwa miesiące) — jeżeli urząd nie odpowie, sprawa przekazywana jest do następnego etapu (skarga / sąd)',
          'W przypadku niemożności podjęcia sprawy po dokonaniu płatności — zwrot środków w ciągu 1 dnia roboczego',
        ]} />
      </Sec>

      <Sec num={4} title="Warunki zawarcia umowy">
        <P>Umowa uważana jest za zawartą z chwilą pisemnego potwierdzenia gotowości obu stron i dokonania płatności.</P>
        <P>Klient potwierdza, że zapoznał się z niniejszym Regulaminem i akceptuje jego warunki w momencie pierwszej płatności.</P>
        <P>Umowa ma charakter umowy zawartej na odległość w rozumieniu ustawy z dnia 30 maja 2014 r. o prawach konsumenta.</P>
      </Sec>

      <Sec num={5} title="Prawo do odstąpienia od umowy">
        <P><strong>Konsument ma prawo odstąpić od umowy zawartej na odległość w terminie 14 dni kalendarzowych</strong> bez podania przyczyny, zgodnie z art. 27 ustawy z dnia 30 maja 2014 r. o prawach konsumenta (Dz.U. 2014 poz. 827 ze zm.).</P>
        <P>Termin do odstąpienia od umowy wygasa po upływie 14 dni od dnia zawarcia umowy.</P>
        <P>Aby skorzystać z prawa do odstąpienia od umowy, należy poinformować nas o swojej decyzji w drodze jednoznacznego oświadczenia wysłanego na adres e-mail lub WhatsApp: <strong>+48 729 271 848</strong>.</P>
        <P><strong>Wyjątek:</strong> Jeżeli na wyraźne życzenie Konsumenta świadczenie usługi rozpocznie się przed upływem terminu do odstąpienia od umowy, Konsument traci prawo do odstąpienia po pełnym wykonaniu usługi (art. 38 pkt 1 ustawy o prawach konsumenta).</P>
        <P>Wzór formularza odstąpienia od umowy dostępny jest na żądanie pod adresem: kompasmigracji.com lub pod numerem +48 729 271 848.</P>
        <P>W przypadku skutecznego odstąpienia od umowy zwracamy wszystkie otrzymane od Konsumenta płatności niezwłocznie, nie później niż w terminie 14 dni od dnia, w którym zostaliśmy poinformowani o decyzji o odstąpieniu, przy użyciu takich samych sposobów płatności, jakie zostały użyte przez Konsumenta.</P>
      </Sec>

      <Sec num={6} title="Warunki rozwiązania umowy">
        <P>Klient nie ma prawa żądać zwrotu płatności po rezygnacji z usługi bez stwierdzenia naruszenia ze strony wykonawcy.</P>
        <P>Wysokość wynagrodzenia obliczana jest proporcjonalnie do wykonanego zakresu pracy w godzinach prawnych.</P>
        <P>Kompas Migracji ma prawo rozwiązać umowę w przypadku podania przez klienta nieprawdziwych danych lub naruszenia warunków współpracy.</P>
        <P>W przypadku nieporozumień — prosimy o kontakt przez WhatsApp +48 729 271 848.</P>
      </Sec>

      <Sec num={7} title="Reklamacje i skargi">
        <P>Reklamacje przyjmowane są telefonicznie (WhatsApp) pod numer +48 729 271 848 lub pisemnie na adres e-mail.</P>
        <P>Termin rozpatrzenia: 14 dni kalendarzowych od daty otrzymania.</P>
        <P>Odpowiedź udzielana jest tym samym kanałem, przez który złożono reklamację.</P>
      </Sec>

      <Sec num={8} title="Dane firmy">
        <InfoCard rows={[
          ['Firma', 'DOMUS V Sp. z o.o.'],
          ['Adres', '02-495 Warszawa, ul. Dzieci Warszawy 27c/49'],
          ['KRS', '0001198474'],
          ['NIP', '522-335-00-30'],
          ['WhatsApp / Viber', '+48 729 271 848'],
          ['Strona', 'kompasmigracji.com'],
          ['Nr rachunku', '10 1050 1025 1000 0090 8594 6938'],
          ['PKD', '82.10z, 63.92z, 69.10z, 69.20a, 70.20z, 74.30z, 78.10z, 85.59d, 88.99z'],
        ]} />
      </Sec>

      <Sec num={9} title="Ceny i płatności">
        <P>Pierwsze 2 minuty konsultacji — bezpłatne. Aby się zapoznać i zrozumieć sytuację.</P>
        <PriceCard rows={[
          ['5 minut', '50 zł'],
          ['10 minut', '100 zł'],
          ['15 minut', '150 zł'],
          ['1 godzina prawna', '450 zł'],
        ]} />
        <P>Metody płatności: przelew bankowy, Przelewy24. Firma wystawia fakturę VAT.</P>
      </Sec>

      <Sec num={10} title="Odpowiedzialność">
        <P>Decyzję wydaje sąd lub organ administracji — nie Kompas Migracji. Odpowiadamy za jakość pracy zgodnie z uzgodnionym scenariuszem.</P>
        <P>Kompas Migracji nie ponosi odpowiedzialności za decyzje organów państwowych, sędziów ani innych osób trzecich niezależnych od nas.</P>
      </Sec>

      <Sec num={11} title="Pozasądowe rozstrzyganie sporów">
        <P>Konsument ma prawo skorzystać z platformy ODR Komisji Europejskiej: <strong>ec.europa.eu/consumers/odr</strong></P>
        <P>Stosujemy również mediację i jesteśmy gotowi zastosować ją do własnych sporów z klientami.</P>
      </Sec>

      <Sec num={12} title="Poufność">
        <P>Wszystko omawiane w ramach konsultacji pozostaje między Klientem a Kompas Migracji. Nie przekazujemy danych osobom trzecim bez pisemnej zgody.</P>
        <P>Przetwarzanie danych osobowych odbywa się zgodnie z Rozporządzeniem RODO (UE) 2016/679.</P>
      </Sec>

      <Sec num={13} title="Członkostwo i program partnerski">
        <P>Jeśli polecasz nas i Twój klient zamówi usługę — otrzymujesz 10% wartości umowy.</P>
        <P>Szczegóły programu partnerskiego — WhatsApp +48 729 271 848.</P>
      </Sec>
    </>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function Regulamin() {
  const [lang, setLang] = useState<Lang>('pl');

  return (
    <div className="min-h-screen bg-white text-black py-16 px-4 font-display">
      <div className="max-w-2xl mx-auto">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary no-underline mb-8 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          {lang === 'uk' ? 'На головну' : 'Strona główna'}
        </Link>

        {/* Language switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {([
            { id: 'uk' as Lang, flag: '🇺🇦', label: 'Українська' },
            { id: 'pl' as Lang, flag: '🇵🇱', label: 'Polski' },
          ]).map(l => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.18s',
                border: lang === l.id ? '2px solid #f97316' : '2px solid #e2e8f0',
                background: lang === l.id ? '#fff7ed' : '#f8fafc',
                color: lang === l.id ? '#ea580c' : '#64748b',
                boxShadow: lang === l.id ? '0 2px 8px rgba(249,115,22,0.15)' : 'none',
              }}
            >
              <span style={{ fontSize: 20 }}>{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>

        {/* Header */}
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
          {lang === 'uk' ? 'ПРАВИЛА МАГАЗИНУ — КОМПАС МІГРАЦІЇ' : 'REGULAMIN SKLEPU — KOMPAS MIGRACJI'}
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-black mb-2 leading-tight tracking-tight">
          {lang === 'uk' ? 'Правила Компасу Міграції' : 'Regulamin Kompas Migracji'}
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          {lang === 'uk'
            ? 'Набирає чинності з дня публікації на сайті kompasmigracji.com'
            : 'Obowiązuje od dnia publikacji na stronie kompasmigracji.com'}
        </p>

        {/* Content */}
        {lang === 'uk' ? <ContentUA /> : <ContentPL />}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-8 mt-4">
          <p className="text-base text-gray-700 leading-relaxed">
            {lang === 'uk'
              ? 'Дякуємо що нас обрали. Де гроші і документи — все письмово. 🧭'
              : 'Dziękujemy za wybór Kompas Migracji. Wszystko co dotyczy płatności i dokumentów — pisemnie. 🧭'}
          </p>
          <p className="text-xs text-gray-400 mt-4">
            DOMUS V Sp. z o.o. · NIP 522-335-00-30 · KRS 0001198474 · Warszawa 2026
          </p>
        </div>

      </div>
    </div>
  );
}
