// Мілена — детермінований рушій бота продажу. Ці функції вирішують ЩО
// відповісти (пошук наміру, бракуючі поля, вибір картки, статус-гейт);
// Claude викликається окремо (app/api/bot/milena/message/route.ts) лише
// щоб сформулювати ЯК це сказати. Правила безпеки навмисно живуть тут,
// у тестованому коді, а не покладаються на те, що LLM щоразу їх виконає.

export const MILENA_SYSTEM_PROMPT = `Ти — асистент продажу Kompas Migracji. Твоя задача — вести клієнта від першого
питання до оплати й передачі справи спеціалісту, використовуючи ТІЛЬКИ дані
з бази знань (knowledge_cards), передані тобі в контексті запиту.

СУВОРІ ПРАВИЛА:
1. Ніколи не гарантуй позитивне рішення у справі.
2. Ніколи не вигадуй строки, ціни чи назви установ — якщо їх немає в картці,
   скажи, що це уточнюється на консультації.
3. Якщо картка має статус 'do_not_use' або 'needs_legal_review' —
   не використовуй її дані як остаточні, познач це клієнту і передай людині.
4. Не показуй клієнту дві ціни з різних періодів як актуальну — бери лише
   картки зі статусом 'actual'.
5. Не приймай рішення у складній справі (спадщина, неповнолітні, спори,
   судові оскарження) — одразу передавай людині за handoff_rules.
6. Не розкривай платіжні дані, доки не визначено послугу, суму й отримувача.
7. Якщо не впевнений — став уточнююче питання, а не вигадуй відповідь.

Формат відповіді: коротко, по суті, українською (або мовою клієнта),
без зайвого канцеляриту.`;

export interface Intent {
  id: string;
  service_id: string;
  stage: string;
  intent_label: string;
  trigger_phrases: string[];
}

export interface IntentMatch {
  serviceId: string;
  intent: Intent;
  score: number;
}

const FIELD_LABELS_UK: Record<string, string> = {
  phone_pl: "ваш номер телефону",
  full_name_latin: "ваше ім'я та прізвище латиницею",
  preferred_contact: "зручний спосіб зв'язку",
  email: "вашу електронну пошту",
};

export function fieldLabel(field: string): string {
  return FIELD_LABELS_UK[field] || field;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[«»"'`.,!?;:()]/g, " ")
    .trim();
}

function words(text: string): string[] {
  return normalize(text).split(/\s+/).filter(Boolean);
}

/**
 * Легкий "стемінг" відкиданням прикінцевих символів слова. Українська —
 * флективна мова (карт-а / карт-у / карт-ою), тож точний збіг підрядка
 * фрази провалюється вже на першій відмінковій формі, відмінній від тієї,
 * що записана в trigger_phrases. Відкидання останніх ~4 символів (не
 * менше 4-символьної основи) достатньо надійно переживає більшість
 * відмінкових закінчень і не робить основу настільки короткою, щоб
 * випадково збігатися з непов'язаними словами.
 */
function stem(word: string): string {
  if (word.length <= 4) return word;
  return word.slice(0, Math.max(4, word.length - 4));
}

function phraseWordStems(phrase: string): string[] {
  return words(phrase).map(stem);
}

/** Keyword-matching проти trigger_phrases (без embeddings — за MVP-скоупом). */
export function matchIntents(message: string, intents: Intent[]): IntentMatch[] {
  const messageWords = words(message);
  const messageStems = messageWords.map(stem);
  const bestByService = new Map<string, IntentMatch>();

  for (const intent of intents) {
    let score = 0;
    for (const phrase of intent.trigger_phrases) {
      const phraseWords = words(phrase);
      const stems = phraseWordStems(phrase);
      if (stems.length === 0) continue;
      const allWordsMatched = stems.every((s) => messageStems.some((ms) => ms.startsWith(s) || s.startsWith(ms)));
      if (allWordsMatched) score += phraseWords.reduce((sum, w) => sum + w.length, 0);
    }
    if (score === 0) continue;
    const existing = bestByService.get(intent.service_id);
    if (!existing || score > existing.score) {
      bestByService.set(intent.service_id, { serviceId: intent.service_id, intent, score });
    }
  }

  return [...bestByService.values()].sort((a, b) => b.score - a.score);
}

export function isMultiIntent(matches: IntentMatch[]): boolean {
  return new Set(matches.map((m) => m.serviceId)).size >= 2;
}

interface FlowMeta {
  field_clarify_count?: number;
  topic_clarify_count?: number;
  awaiting_field?: string;
  intent_label?: string;
}

export interface CollectedContext {
  _flow_meta?: FlowMeta;
  [key: string]: unknown;
}

export function getFlowMeta(ctx: CollectedContext): FlowMeta {
  return ctx._flow_meta || {};
}

export function withFlowMeta(ctx: CollectedContext, patch: Partial<FlowMeta>): CollectedContext {
  return { ...ctx, _flow_meta: { ...getFlowMeta(ctx), ...patch } };
}

/** Бракуючі required_fields, без внутрішнього _flow_meta-ключа. */
export function getMissingFields(requiredFields: string[], ctx: CollectedContext): string[] {
  return requiredFields.filter((f) => !(f in ctx) || ctx[f] === null || ctx[f] === "");
}

/**
 * Гейт статусу картки. Псевдокод ТЗ ескалює лише на 'do_not_use', але
 * системний промпт (правило 3) вимагає ескалації й на 'needs_legal_review' —
 * беремо суворіший варіант: тільки 'actual' вважається фінальною відповіддю.
 * Це також єдиний спосіб чесно поводитись із seed-картками цієї міграції,
 * жодна з яких не позначена 'actual' (немає підтверджених цін від бізнесу).
 */
export function shouldEscalate(card: { status: string; handoff_condition?: string[] | null }, rawMessage: string): boolean {
  if (card.status !== "actual") return true;
  const normMsg = normalize(rawMessage);
  return (card.handoff_condition || []).some((cond) => normMsg.includes(normalize(cond)));
}
