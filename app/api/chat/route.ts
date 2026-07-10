/* eslint-disable @typescript-eslint/ban-ts-comment */
import { generateText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

const SYSTEM_PROMPT = `Ти — AI-Координатор компанії Kompas Migracji (Польща). Твоя задача — допомагати мігрантам, використовуючи свої інструменти (Tools) для доступу до інших агентів екосистеми.

ТИ МАЄШ ДОСТУП ДО ТАКИХ АГЕНТІВ (Tools):
1. find_jobs: Шукає вакансії в базі даних. Викликай, якщо клієнт шукає роботу.
2. check_legal_status: Перевіряє статус справи про легалізацію. Викликай, якщо клієнт запитує про Карту Побиту або візу.
3. find_discounts: Шукає партнерські знижки. Викликай, якщо клієнту потрібен адвокат, житло, страховка або нотаріус.
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
  try {
    const { messages } = await req.json();
    const supabase = getSupabase();

    const { text } = await generateText({
      model: google('gemini-1.5-flash') as any,
      system: SYSTEM_PROMPT,
      messages,
      // @ts-expect-error maxSteps not in types but supported
      maxSteps: 5,
      tools: {
        find_jobs: tool({
          description: 'Шукає актуальні вакансії для клієнта на основі ключового слова.',
          parameters: z.object({
            keyword: z.string().describe('Професія або сфера, яку шукає клієнт'),
          }),
          // @ts-expect-error ai sdk execute types
          execute: async ({ keyword }: { keyword: string }) => {
            if (!supabase) return { message: 'Сервіс пошуку тимчасово недоступний.' };
            const { data, error } = await supabase
              .from('kompas_jobs_v2')
              .select('*')
              .ilike('title', `%${keyword}%`)
              .limit(3);
            if (error || !data || data.length === 0) {
              return { message: 'На жаль, за цим запитом вакансій не знайдено. Спробуйте іншу професію.' };
            }
            return { results: data, message: 'Ось знайдені вакансії.' };
          },
        }),
        check_legal_status: tool({
          description: 'Перевіряє статус справи по легалізації (Карта Побиту, віза тощо).',
          parameters: z.object({
            caseId: z.string().describe('ID справи або тип (наприклад Karta Pobytu)'),
          }),
          // @ts-expect-error ai sdk execute types
          execute: async ({ caseId }: { caseId: string }) => {
            if (!supabase) return { message: 'Сервіс перевірки тимчасово недоступний.' };
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(caseId);
            let query = supabase.from('kompas_legal_cases_v2').select('*');
            if (isUuid) {
              query = (query as any).eq('id', caseId);
            } else {
              query = (query as any).ilike('case_type', `%${caseId}%`).limit(1);
            }
            const { data, error } = await (query as any).single();
            if (error || !data) {
              return { message: 'Справу не знайдено. Перевірте правильність введеного ID.' };
            }
            return {
              status: data.status,
              case_type: data.case_type,
              current_stage: data.current_stage,
              deadline: data.deadline,
              notes: data.notes,
              message: 'Дані по справі отримано.',
            };
          },
        }),
        find_discounts: tool({
          description: 'Шукає партнерів (нотаріус, житло, страхування) зі знижками для клієнта.',
          parameters: z.object({
            category: z.string().describe('Категорія послуги'),
          }),
          // @ts-expect-error ai sdk execute types
          execute: async ({ category }: { category: string }) => {
            if (!supabase) return { message: 'Сервіс партнерів тимчасово недоступний.' };
            const { data } = await supabase
              .from('kompas_partners')
              .select('*')
              .ilike('category', `%${category}%`);
            if (!data || data.length === 0) {
              const { data: allData } = await supabase.from('kompas_partners').select('*').limit(3);
              return { partners: allData, message: 'Ось деякі з наших партнерів.' };
            }
            return { partners: data, message: `Знайдено партнерів у категорії ${category}.` };
          },
        }),
        record_lead: tool({
          description: 'Записує клієнта на платну юридичну консультацію (запис у CRM).',
          parameters: z.object({
            name: z.string().describe("Ім'я клієнта"),
            phone: z.string().describe('Номер телефону (WhatsApp/Viber)'),
            issue: z.string().describe('Короткий опис проблеми'),
          }),
          // @ts-expect-error ai sdk execute types
          execute: async ({ name, phone, issue }: { name: string; phone: string; issue: string }) => {
            if (!supabase) return { success: false, message: 'Сервіс запису тимчасово недоступний.' };
            const { error } = await supabase.from('kompas_leads').insert({
              name,
              contact: phone,
              message: issue,
              source: 'ai_chatbot',
              status: 'new',
            });
            if (error) {
              console.error('AI Chatbot lead insert error:', error);
              return { success: false, message: 'Вибачте, сталася помилка при створенні заявки.' };
            }
            return {
              success: true,
              message: `Заявку успішно створено для ${name}. Наш менеджер зв'яжеться з вами за номером ${phone} найближчим часом.`,
            };
          },
        }),
      },
    });

    return NextResponse.json({ content: text ?? '' });
  } catch (error: any) {
    console.error('[/api/chat] error:', error?.message ?? String(error));
    return NextResponse.json(
      { content: 'Вибачте, сталася технічна помилка. Будь ласка, напишіть нам напряму у WhatsApp: +48 729 271 848' },
      { status: 200 }
    );
  }
}
