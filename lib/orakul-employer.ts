// Оракул — рекрутинг роботодавців (EWU). Деякі правила навмисно живуть тут,
// у тестованому коді, замість того щоб покладатись на LLM щоразу пам'ятати
// їх у довгому діалозі: витяг структурованого JSON, читабельний рендер
// зібраних даних, і детерміновані тригери ескалації (кількість людей / ставка),
// що дублюють інструкції з ORAKUL_SYSTEM_PROMPT як код-бекстоп.

export interface EmployerLeadData {
  company_name?: string;
  nip?: string;
  contact_person?: string;
  position?: string;
  whatsapp?: string;
  email?: string;
  website?: string | null;
  positions_needed?: string;
  location?: string;
  start_date?: string;
  residence_card_docs_not_provided?: boolean;
  rate?: string;
  hours?: string;
  night_shifts?: boolean;
  overtime_pay?: string;
  deductions?: string;
  contract_form?: string;
  b2b_rate?: string | null;
  housing?: string;
  verification_test?: string;
  welding_method?: string;
  certificates_required?: string;
  drawing_reading_required?: boolean;
}

export const EMPLOYER_SENTINEL = '[РОБОТОДАВЕЦЬ_ГОТОВИЙ]';
export const HANDOFF_SENTINEL_RE = /\[ЛЮДИНА_ПОТРІБНА:?\s*([^\]]*)\]/;

export const EMPLOYER_AD_BLOCK_OPEN: Record<'uk' | 'ru' | 'pl' | 'en', string> = {
  uk: 'До речі — ми закриваємо не лише підбір персоналу, а й повний юридичний супровід: карта побуту, шлюб, легалізація, громадянство, резиденція. Надаємо адвоката, нотаріуса, медіатора. Працюємо за дуже лояльними цінами — тому клієнти зазвичай залишаються з нами на постійній основі. Навіть якщо у ваших існуючих працівників є якісь юридичні потреби — ми можемо стати в нагоді.',
  ru: 'Кстати — мы закрываем не только подбор персонала, но и полное юридическое сопровождение: карта побыту, брак, легализация, гражданство, резиденция. Предоставляем адвоката, нотариуса, медиатора. Работаем по очень лояльным ценам — поэтому клиенты обычно остаются с нами на постоянной основе. Даже если у ваших уже работающих сотрудников есть какие-то юридические потребности — мы можем быть полезны.',
  pl: 'Przy okazji — zajmujemy się nie tylko rekrutacją personelu, ale też pełnym wsparciem prawnym: karta pobytu, małżeństwo, legalizacja, obywatelstwo, rezydentura. Zapewniamy adwokata, notariusza, mediatora. Pracujemy w bardzo lojalnych cenach — dlatego klienci zazwyczaj zostają z nami na stałe. Nawet jeśli Państwa obecni pracownicy mają jakieś potrzeby prawne — możemy się przydać.',
  en: "By the way — we don't just handle staff recruitment, we also provide full legal support: residence cards, marriage, legalization, citizenship, residency. We provide a lawyer, notary, and mediator. Our pricing is very loyal — that's why clients usually stay with us long-term. Even if your existing employees have any legal needs — we can help there too.",
};

export const EMPLOYER_AD_BLOCK_CLOSE: Record<'uk' | 'ru' | 'pl' | 'en', string> = {
  uk: 'Нагадаємо: ми супроводжуємо не тільки підбір персоналу, а й усі юридичні питання — карта побуту, шлюб, легалізація, громадянство, резиденція. Надаємо адвоката, нотаріуса, медіатора — за дуже лояльними цінами. Навіть якщо у ваших існуючих працівників є якісь потреби — ми можемо стати в нагоді. Надана інформація залишається конфіденційною.',
  ru: 'Напомним: мы сопровождаем не только подбор персонала, но и все юридические вопросы — карта побыту, брак, легализация, гражданство, резиденция. Предоставляем адвоката, нотариуса, медиатора — по очень лояльным ценам. Даже если у ваших уже работающих сотрудников есть какие-то потребности — мы можем быть полезны. Предоставленная информация остаётся конфиденциальной.',
  pl: 'Przypominamy: wspieramy nie tylko rekrutację personelu, ale też wszystkie kwestie prawne — karta pobytu, małżeństwo, legalizacja, obywatelstwo, rezydentura. Zapewniamy adwokata, notariusza, mediatora — w bardzo lojalnych cenach. Nawet jeśli Państwa obecni pracownicy mają jakieś potrzeby — możemy się przydać. Podane informacje pozostają poufne.',
  en: "Just a reminder: we support not only staff recruitment but all legal matters — residence cards, marriage, legalization, citizenship, residency. We provide a lawyer, notary, and mediator — at very loyal prices. Even if your existing employees have any needs — we can help. The information you've provided remains confidential.",
};

const FIELD_LABELS_UK: Record<string, string> = {
  company_name: "назва компанії",
  nip: 'NIP',
  contact_person: 'контактна особа',
  position: 'посада контактної особи',
  whatsapp: 'WhatsApp/телефон',
  email: 'email',
  website: 'сайт',
  positions_needed: 'потрібні спеціалісти',
  location: 'локація',
  start_date: 'дата початку',
  rate: 'ставка',
  hours: 'години',
  night_shifts: 'нічні зміни',
  overtime_pay: 'оплата понаднормових',
  deductions: 'утримання/вирахування',
  contract_form: 'форма договору',
  b2b_rate: 'ставка для B2B',
  housing: 'житло',
  verification_test: 'перевірка перед стартом',
  welding_method: 'метод зварювання',
  certificates_required: 'необхідні сертифікати',
  drawing_reading_required: 'читання технічних рисунків',
};

export const EMPLOYER_FIELD_ORDER: (keyof EmployerLeadData)[] = [
  'company_name', 'nip', 'contact_person', 'position', 'whatsapp', 'email', 'website',
  'positions_needed', 'location', 'start_date',
  'rate', 'hours', 'night_shifts', 'overtime_pay', 'deductions',
  'contract_form', 'b2b_rate',
  'housing',
  'verification_test', 'welding_method', 'certificates_required', 'drawing_reading_required',
];

export function employerFieldLabel(field: string): string {
  return FIELD_LABELS_UK[field] || field;
}

function renderValue(v: unknown): string {
  if (v === true) return 'так';
  if (v === false) return 'ні';
  if (v === null || v === undefined || v === '') return '—';
  return String(v);
}

/** Витягує JSON-об'єкт, що йде одразу після тегу-сентінелу в тексті відповіді бота. */
export function extractTaggedJson(text: string, tag: string): Record<string, unknown> | null {
  const idx = text.indexOf(tag);
  if (idx === -1) return null;
  const slice = text.slice(idx + tag.length);
  const match = slice.match(/\{[\s\S]*?\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

export function extractEmployerJson(text: string): EmployerLeadData | null {
  return extractTaggedJson(text, EMPLOYER_SENTINEL) as EmployerLeadData | null;
}

export function extractHandoffReason(text: string): string | null {
  const m = text.match(HANDOFF_SENTINEL_RE);
  return m ? (m[1] || '').trim() || 'не вказано' : null;
}

/** Читабельний рендер зібраних даних роботодавця для CRM/сповіщень (не сирий JSON). */
export function buildEmployerSituation(d: Partial<EmployerLeadData>): string {
  const lines = ['Оракул — анкета роботодавця (EWU).'];
  if (isCrossSellFlagged(d)) {
    lines.push('⚠️ КРОС-СЕЛЛ: роботодавець НЕ надає документи для карти побуту — можливість запропонувати юридичний супровід Kompas Migracji.');
  }
  for (const field of EMPLOYER_FIELD_ORDER) {
    const v = d[field];
    if (v === undefined) continue;
    lines.push(`${employerFieldLabel(field)}: ${renderValue(v)}`);
  }
  return lines.join('\n');
}

export function isCrossSellFlagged(d: Partial<EmployerLeadData>): boolean {
  return d.residence_card_docs_not_provided === true;
}

const PEOPLE_WORDS = '(?:спеціаліст\\w*|зварювальник\\w*|спавач\\w*|працівник\\w*|людин\\w*|людей|человек\\w*|сотрудник\\w*|specjalist\\w*|spawacz\\w*|pracownik\\w*|osób|osob|welders?|specialists?|people|workers?)';
const YEARS_WORDS = '(?:рок\\w*|лет|года?|years?|lat\\w*)';

const WORKER_COUNT_RE = new RegExp(`(\\d{1,3})\\s*${PEOPLE_WORDS}`, 'iu');
const PEOPLE_BEFORE_COUNT_RE = new RegExp(`${PEOPLE_WORDS}\\D{0,10}(\\d{1,3})`, 'iu');
const YEARS_NEAR_RE = new RegExp(`\\d{1,3}\\s*${YEARS_WORDS}`, 'iu');

const RATE_RE = /(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?\s*(?:zł|zl|pln)\s*\/?\s*(?:h|godz|год|hour)/giu;

export interface HandoffCheck { handoff: boolean; reason?: string }

/**
 * Регексовий бекстоп для двох з трьох тригерів ескалації (кількість людей ≥20,
 * нетипова ставка поза 20–120 zł/год). Це навмисно неповний, best-effort шар —
 * третій тригер (складне юридичне/податкове питання B2B) є суто семантичним
 * судженням і залишається на LLM без коду-бекстопу.
 */
export function checkDeterministicHandoffTriggers(userText: string): HandoffCheck {
  const text = userText.trim();

  const countMatch = text.match(WORKER_COUNT_RE) || text.match(PEOPLE_BEFORE_COUNT_RE);
  if (countMatch) {
    const near = text.slice(Math.max(0, (countMatch.index || 0) - 5), (countMatch.index || 0) + countMatch[0].length + 10);
    const isYearsMention = YEARS_NEAR_RE.test(near);
    const n = parseInt(countMatch[1], 10);
    if (!isYearsMention && !isNaN(n) && n >= 20) {
      return { handoff: true, reason: `запит на ${n}+ спеціалістів одночасно` };
    }
  }

  RATE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = RATE_RE.exec(text)) !== null) {
    const a = parseInt(m[1], 10);
    const b = m[2] ? parseInt(m[2], 10) : a;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    if (lo < 20) return { handoff: true, reason: `нетипово низька ставка (${m[0].trim()})` };
    if (hi > 120) return { handoff: true, reason: `нетипово висока ставка (${m[0].trim()})` };
  }

  return { handoff: false };
}

/** Чи вже показувався фіксований рекламний блок (open або close) у попередніх репліках бота. */
export function hasAdBlockAlreadyShown(history: { role: string; content: string }[]): boolean {
  const allBlocks = [
    ...Object.values(EMPLOYER_AD_BLOCK_OPEN),
    ...Object.values(EMPLOYER_AD_BLOCK_CLOSE),
  ];
  return history.some(
    (m) => m.role !== 'user' && allBlocks.some((block) => m.content.includes(block.slice(0, 40)))
  );
}
