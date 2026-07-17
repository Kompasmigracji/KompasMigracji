import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { ORAKUL_SYSTEM_PROMPT } from './lib/orakul-prompt.ts';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function converse(turns, label) {
  console.log(`\n\n========== SCENARIO: ${label} ==========`);
  const history = [];
  for (const userMsg of turns) {
    history.push({ role: 'user', parts: [{ text: userMsg }] });
    const resp = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
      config: { systemInstruction: ORAKUL_SYSTEM_PROMPT },
    });
    const text = resp.text || '';
    history.push({ role: 'model', parts: [{ text }] });
    console.log(`\n--- USER: ${userMsg}`);
    console.log(`--- BOT:\n${text}`);
  }
  return history;
}

// Scenario 1: full happy path, 7 steps
await converse([
  'Добрий день, ми шукаємо зварювальників для заводу в Німеччині.',
  '3 зварювальники MAG, потрібні терміново.',
  'Вроцлав, старт з серпня. Так, документи для карти побуту ми надаємо.',
  '40 zł/h нетто, 160 год/міс, є нічні зміни, понаднормові +50% після 8 год.',
  'Zlecenie.',
  'Житло надаємо, оплата 50/50.',
  'Так, буде практичний тест на кутовий шов MAG. Потрібен сертифікат DIN EN ISO 9606. Так, читання рисунків потрібне.',
  'Acme Sp. z o.o., NIP 1234567890, Jan Kowalski, HR Manager, +48123456789, jan@acme.pl, acme.pl',
], 'happy path, docs provided');

// Scenario 2: cross-sell (docs NOT provided)
await converse([
  'Потрібні 2 монтери в Польщу.',
  '2 монтери, Гданськ, старт вересень. Ні, документи для карти побуту ми не надаємо, не знаємо як це робиться.',
  'Ще питання про оплату?',
], 'cross-sell trigger (docs not provided)');

// Scenario 3: immediate escalation (25 workers)
await converse([
  'Нам терміново потрібно 25 зварювальників TIG на завод у Бельгії.',
], 'immediate escalation — 25 workers');

// Scenario 4: atypical rate
await converse([
  'Шукаємо зварювальника, ставка 12 zł/h.',
], 'immediate escalation — atypically low rate');

// Scenario 5: complex B2B tax question
await converse([
  'Яка різниця в оподаткуванні між B2B і трудовим договором для зварювальника-нерезидента?',
], 'immediate escalation — complex B2B tax question');

// Scenario 6 (regression check): candidate flow untouched
await converse([
  'Привіт, я зварювальник TIG, шукаю роботу.',
  'Досвід 5 років, документи є - паспорт і диплом.',
  '+380671234567',
], 'candidate flow regression check');

console.log('\n\nDONE');
