export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { one } from '@/lib/db';
import { ORAKUL_SYSTEM_PROMPT } from '@/lib/orakul-prompt';

async function saveLead(
  firstName: string, contact: string,
  service: string, situation: string, email: string,
) {
  try {
    const row = await one(
      `INSERT INTO leads (first_name, contact, source, service, situation, email, status, created_at)
       VALUES ($1, $2, 'orakul', $3, $4, $5, 'new', NOW())
       ON CONFLICT DO NOTHING RETURNING id`,
      [firstName, contact, service, situation, email || null],
    ) as { id: string } | null;
    const crmMsg = [service, situation].filter(Boolean).join('\n') || null;
    await one(
      `INSERT INTO kompas_leads (source, name, contact, email, message, status)
       VALUES ('other', $1, $2, $3, $4, 'new')`,
      [firstName, contact, email || null, crmMsg],
    );

    if (row && crmMsg) {
      await one(
        `INSERT INTO kompas_activities (entity_type, entity_id, type, title, body) VALUES ('lead', $1, 'note', 'Анкета від Оракула (Web)', $2)`,
        [row.id, crmMsg]
      );
    }
  } catch (err) {
    console.error('[orakul/chat] saveLead:', err);
  }
}

function extractJson(text: string, after: string): Record<string, unknown> | null {
  const idx = text.indexOf(after);
  if (idx === -1) return null;
  const slice = text.slice(idx + after.length);
  const match = slice.match(/\{[\s\S]*?\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  let body: { messages?: { role: string; content: string }[] };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const messages = (body.messages || []).slice(-20); // keep last 20 turns max
  const encoder = new TextEncoder();
  let fullText = '';

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const useLocalLlm = process.env.USE_LOCAL_LLM === 'true';
        const localUrl = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:1234/v1';
        const localModel = process.env.LOCAL_LLM_MODEL || 'local-model';

        if (useLocalLlm) {
          const openAiMessages = [
            { role: 'system', content: ORAKUL_SYSTEM_PROMPT },
            ...messages.map((m: any) => ({ role: m.role, content: m.content }))
          ];

          const response = await fetch(`${localUrl}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer local' },
            body: JSON.stringify({
              model: localModel,
              messages: openAiMessages,
              stream: true,
              max_tokens: 800,
            })
          });

          if (!response.ok) throw new Error(await response.text());

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunkText = decoder.decode(value);
              const lines = chunkText.split('\n');
              for (const line of lines) {
                if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
                  try {
                    const data = JSON.parse(line.slice(6));
                    const content = data.choices?.[0]?.delta?.content;
                    if (content) {
                      fullText += content;
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`));
                    }
                  } catch (e) {}
                }
              }
            }
          }
        } else {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const aiMessages = messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }));
          const respStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: aiMessages,
            config: { systemInstruction: ORAKUL_SYSTEM_PROMPT }
          });
          for await (const chunk of respStream) {
            if (chunk.text) {
              fullText += chunk.text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.text })}\n\n`));
            }
          }
        }

        // Detect candidate lead
        if (fullText.includes('[КАНДИДАТ_ГОТОВИЙ]')) {
          const d = extractJson(fullText, '[КАНДИДАТ_ГОТОВИЙ]');
          const phone = d?.phone as string | undefined;
          const name  = d?.name  as string | undefined;
          if (phone && name) {
            const situation = [
              `AI чат Оракул. Спеціальність: ${d?.specialty || '—'}`,
              `Досвід: ${d?.experience || '—'}`,
              `Документи: ${d?.documents || '—'}`,
              `Мови: ${d?.languages || '—'}`,
              `Мобільність: ${d?.mobility || '—'}`,
              `Оцінка: ${d?.lead_score || '—'}`,
            ].join('. ');
            await saveLead(name, phone, 'EWU — Зварювальник (AI чат)', situation, '');
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ lead_saved: true })}\n\n`));
          }
        }

        // Detect employer lead
        if (fullText.includes('[РОБОТОДАВЕЦЬ_ГОТОВИЙ]')) {
          const d = extractJson(fullText, '[РОБОТОДАВЕЦЬ_ГОТОВИЙ]');
          const contact = d?.contact as string | undefined;
          const name    = d?.name    as string | undefined;
          if (contact && name) {
            const situation = [
              `AI чат Оракул. Роботодавець.`,
              `Потреба: ${d?.specialty_needed || '—'}`,
              `Кількість: ${d?.workers_count || '—'}`,
              `Локація: ${d?.location || '—'}`,
              `Старт: ${d?.start_date || '—'}`,
              d?.message || '',
            ].filter(Boolean).join(' ');
            await saveLead(name, contact, 'EWU — Роботодавець (AI чат)', situation, (d?.email as string) || '');
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ lead_saved: true })}\n\n`));
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'AI error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
