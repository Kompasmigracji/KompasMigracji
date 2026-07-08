import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req) {
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
${profile?.documents?.map(d => `- ${d.type} (${d.number}), Дійсний до: ${d.expires} ${d.expired ? '[ПРОСТРОЧЕНО]' : ''}`).join('\n')}

ОСВІТА ТА ДОСВІД:
Досвід: ${profile?.experience?.map(e => `${e.title} в ${e.company} (${e.start} - ${e.end})`).join('; ')}
Освіта: ${profile?.education?.map(e => `${e.degree} в ${e.institution}`).join('; ')}

Будь корисним, пропонуй допомогу з оновленням документів, якщо вони прострочені, або пропонуй нові кар'єрні можливості.`;

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages,
      system: systemPrompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
