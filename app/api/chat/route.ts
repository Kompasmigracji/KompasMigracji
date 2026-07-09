import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { getSupabase } from '@/lib/supabase';

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
4. ЯКЩО клієнт питає про статус своєї справи, ОБОВ'ЯЗКОВО викликай check_legal_status.
5. ЯКЩО клієнту потрібен перекладач чи адвокат, ОБОВ'ЯЗКОВО викликай find_discounts.
6. НЕ ПИШИ великі полотна тексту. Викликай інструменти, щоб надати точну інформацію.`;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const supabase = getSupabase();

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
          if (!supabase) return { error: 'Database not connected' };
          const { data, error } = await supabase
            .from('kompas_jobs_v2')
            .select('*')
            .ilike('title', `%${keyword}%`)
            .limit(3);
            
          if (error) return { error: error.message };
          
          if (!data || data.length === 0) {
            return { message: 'На жаль, за цим запитом вакансій не знайдено. Спробуйте іншу професію.' };
          }
          
          return {
            results: data,
            message: 'Ось знайдені вакансії. Ви можете переглянути їх детальніше в розділі "Агент Працевлаштування".'
          };
        },
      }),
      check_legal_status: tool({
        description: 'Перевіряє статус справи по легалізації (Карта Побиту, віза тощо).',
        parameters: z.object({
          caseId: z.string().describe('ID справи (uuid)'),
        }),
        execute: async ({ caseId }) => {
          if (!supabase) return { error: 'Database not connected' };
          
          // Try to search by case_type just as a fallback if caseId isn't a UUID
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(caseId);
          
          let query = supabase.from('kompas_legal_cases_v2').select('*');
          if (isUuid) {
            query = query.eq('id', caseId);
          } else {
            // For demo purposes, we will return a case if they provide a case_type (like 'Karta Pobytu')
            query = query.ilike('case_type', `%${caseId}%`).limit(1);
          }
          
          const { data, error } = await query.single();
            
          if (error || !data) {
             return { message: 'Справу не знайдено. Будь ласка, перевірте правильність введеного ID або типу.' };
          }
          
          return {
            status: data.status,
            case_type: data.case_type,
            current_stage: data.current_stage,
            deadline: data.deadline,
            notes: data.notes,
            message: 'Дані по справі отримано з бази.'
          };
        },
      }),
      find_discounts: tool({
        description: 'Шукає партнерів (нотаріус, житло, страхування) зі знижками для клієнта.',
        parameters: z.object({
          category: z.string().describe('Категорія послуги: "Юриспруденція", "Житло", "Страхування", "Освіта" або "Медицина"'),
        }),
        execute: async ({ category }) => {
          if (!supabase) return { error: 'Database not connected' };
          const { data, error } = await supabase
            .from('kompas_partners')
            .select('*')
            .ilike('category', `%${category}%`);
            
          if (error) return { error: error.message };
          
          if (!data || data.length === 0) {
            // Fallback to all partners if specific category not found
            const { data: allData } = await supabase.from('kompas_partners').select('*').limit(3);
            return { partners: allData, message: 'Ось деякі з наших партнерів.' };
          }
          
          return {
            partners: data,
            message: `Знайдено партнерів у категорії ${category}. Перейдіть у розділ "Партнерські Знижки", щоб отримати промокод.`
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
            message: `Заявку створено для ${name}. Менеджер зв'яжеться за номером ${phone} протягом 2 годин.`
          };
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
