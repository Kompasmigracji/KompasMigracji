import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// Оновлений промпт для Координатора
const SYSTEM_PROMPT = `Ти — AI-Координатор компанії Kompas Migracji (Польща). Твоя задача — допомагати мігрантам, використовуючи свої інструменти (Tools) для доступу до інших агентів екосистеми.

ТИ МАЄШ ДОСТУП ДО ТАКИХ АГЕНТІВ (Tools):
1. find_jobs: Шукає вакансії в базі даних (Агент Працевлаштування). Викликай, якщо клієнт шукає роботу.
2. check_legal_status: Перевіряє статус справи про легалізацію (Агент Міграції). Викликай, якщо клієнт запитує про Карту Побиту або візу.
3. find_discounts: Шукає партнерські знижки (Маркетплейс). Викликай, якщо клієнту потрібен адвокат, житло, страховка або нотаріус.
4. record_lead: Записує клієнта на платну послугу, якщо він дав ім'я та телефон.

КОМПАНІЯ:
Kompas Migracji / DOMUS V Sp. z o.o. — юридичний супровід мігрантів у Польщі.
WhatsApp: +48 729 271 848 | Telegram: @kompasmigracji | info@kompasmigracji.com

ПРАВИЛА:
1. Завжди відповідай мовою клієнта.
2. Будь емпатичним, професійним та коротким.
3. ЯКЩО клієнт просить знайти роботу, ОБОВ'ЯЗКОВО викликай find_jobs.
4. ЯКЩО клієнт питає про статус своєї справи, ОБОВ'ЯЗКОВО викликай check_legal_status (попросивши case_id, якщо невідомо, для демо використовуй 'case-101' або 'case-102').
5. ЯКЩО клієнту потрібен перекладач чи адвокат, ОБОВ'ЯЗКОВО викликай find_discounts.
6. НЕ ПИШИ великі полотна тексту. Викликай інструменти, щоб надати точну інформацію.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: SYSTEM_PROMPT,
    messages,
    tools: {
      find_jobs: tool({
        description: 'Шукає актуальні вакансії для клієнта на основі ключового слова.',
        parameters: z.object({
          keyword: z.string().describe('Професія або сфера, яку шукає клієнт (наприклад, "зварювальник", "IT", "водій")'),
        }),
        execute: async ({ keyword }) => {
          // In a real app, query Supabase kompas_jobs
          console.log(\`Finding jobs for: \${keyword}\`);
          return {
            results: [
              { id: 'job-1', title: \`\${keyword} (Senior)\`, company: 'TechPol Sp. z o.o.', salary: '8000 - 12000 PLN', match_score: 95 },
              { id: 'job-2', title: \`\${keyword} (Junior)\`, company: 'Budowa Plus', salary: '5000 - 7000 PLN', match_score: 82 }
            ],
            message: 'Ось знайдені вакансії. Ви можете переглянути їх детальніше в розділі "Агент Працевлаштування".'
          };
        },
      }),
      check_legal_status: tool({
        description: 'Перевіряє статус справи по легалізації (Карта Побиту, віза тощо).',
        parameters: z.object({
          caseId: z.string().describe('ID справи (наприклад, case-101)'),
        }),
        execute: async ({ caseId }) => {
          // In a real app, query Supabase kompas_legal_cases
          if (caseId === 'case-101') {
            return {
              status: 'success',
              case_type: 'Karta Pobytu',
              current_stage: 'Awaiting Fingerprints',
              deadline: '2026-06-20',
              message: 'Справа йде за планом. Вам потрібно здати відбитки пальців до 20 червня 2026 року.'
            };
          } else {
            return {
              status: 'blocked',
              case_type: 'Zezwolenie na pracę',
              current_stage: 'Missing Documents',
              message: 'Справа призупинена. Будь ласка, донесіть відсутні документи до Уженду.'
            };
          }
        },
      }),
      find_discounts: tool({
        description: 'Шукає партнерів (нотаріус, житло, страхування) зі знижками для клієнта.',
        parameters: z.object({
          category: z.string().describe('Категорія послуги: "Юриспруденція", "Житло", "Страхування", "Освіта" або "Медицина"'),
        }),
        execute: async ({ category }) => {
          // Mock partners based on Stage 5
          return {
            partners: [
              { name: 'Lex Secure Poland', offer: '-20% на консультацію' },
              { name: 'PZU Insurance', offer: '-10% на медичний поліс' }
            ],
            message: \`Знайдено партнерів у категорії \${category}. Перейдіть у розділ "Партнерські Знижки", щоб отримати промокод.\`
          };
        },
      }),
      record_lead: tool({
        description: 'Записує клієнта на платну юридичну консультацію (запис у CRM).',
        parameters: z.object({
          name: z.string().describe("Ім'я клієнта"),
          phone: z.string().describe('Номер телефону (WhatsApp/Viber)'),
          issue: z.string().describe('Короткий опис проблеми'),
        }),
        execute: async ({ name, phone, issue }) => {
          return {
            success: true,
            message: \`Заявку створено для \${name}. Менеджер зв'яжеться за номером \${phone} протягом 2 годин.\`
          };
        },
      }),
    },
    maxSteps: 5, // Allow the model to call tools and respond automatically
  });

  return result.toDataStreamResponse();
}
