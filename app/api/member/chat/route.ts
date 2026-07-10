import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  try {
    const { messages, profile } = await req.json();

    const systemPrompt = `Ти — AI-координатор та персональний представник профспілки "Компас" для учасника.
Твоє завдання — допомагати учаснику з міграційними, юридичними та професійними питаннями.
Спілкуйся дружньо, професійно та проактивно.

ДАНІ ПРО УЧАСНИКА:
Ім'я: ${profile?.name || 'Анонім'}
Роль: ${profile?.role || 'Учасник'}
Заповненість профілю: ${profile?.completion}%
AI Summary: ${profile?.ai_summary || ''}

ДОКУМЕНТИ:
${profile?.documents?.map((d: any) => `- ${d.type} (${d.number}), Дійсний до: ${d.expires} ${d.expired ? '[ПРОСТРОЧЕНО]' : ''}`).join('\n')}

ОСВІТА ТА ДОСВІД:
Досвід: ${profile?.experience?.map((e: any) => `${e.title} в ${e.company} (${e.start} - ${e.end})`).join('; ')}
Освіта: ${profile?.education?.map((e: any) => `${e.degree} в ${e.institution}`).join('; ')}

Будь корисним, пропонуй допомогу з оновленням документів, якщо вони прострочені, або пропонуй нові кар'єрні можливості.`;

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages,
      system: systemPrompt,
      onFinish: async ({ text, finishReason }) => {
        // Save the interaction to the database (memory)
        if (profile?.user_id) {
          try {
            const { getSupabaseAdmin } = await import('@/lib/supabase');
            const supabase = getSupabaseAdmin();
            if (supabase) {
              const lastUserMessage = messages[messages.length - 1];
              await supabase.from('kompas_agent_interactions').insert({
                user_id: profile.user_id,
                agent_type: 'coordinator',
                prompt_text: lastUserMessage.content,
                response_text: text,
                metadata: { finishReason }
              });
            }
          } catch (err) {
            console.error('Error saving agent memory:', err);
          }
        }
      }
    });

    // @ts-expect-error ai sdk types
    return result.toDataStreamResponse ? result.toDataStreamResponse() : result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
