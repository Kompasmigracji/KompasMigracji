export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { one } from '@/lib/db';
import { ORAKUL_SYSTEM_PROMPT } from '@/lib/orakul-prompt';
import {
  extractTaggedJson,
  extractEmployerJson,
  extractHandoffReason,
  buildEmployerSituation,
  checkDeterministicHandoffTriggers,
  hasAdBlockAlreadyShown,
  EMPLOYER_SENTINEL,
  type EmployerLeadData,
} from '@/lib/orakul-employer';
import { sendEmail, employerLeadEmailHtml, employerHandoffEmailHtml } from '@/lib/email';
import { notifyAdmin } from '@/lib/telegram';

function notifyEmployerCompletion(d: Partial<EmployerLeadData>, situation: string): void {
  notifyAdmin(`🚨 <b>Новий лід у CRM (Роботодавець, Web)!</b>\n${situation}`).catch((e) => console.error('[orakul/chat] Telegram notify failed:', e));
  const notifyEmail = process.env.EMPLOYER_LEAD_NOTIFY_EMAIL;
  if (notifyEmail) {
    const subject = `Нова заявка: ${d.company_name || 'без назви'}, ${d.positions_needed || 'без деталей'}`;
    sendEmail(notifyEmail, subject, employerLeadEmailHtml(d), 'employer_lead').catch((e) => console.error('[orakul/chat] Email notify failed:', e));
  }
}

function notifyEmployerHandoff(reason: string, contact: string, transcript: string): void {
  notifyAdmin(`⚠️ <b>Оракул: негайна ескалація (Web)!</b>\nКонтакт: ${contact}\nПричина: ${reason}`).catch((e) => console.error('[orakul/chat] Telegram notify failed:', e));
  const notifyEmail = process.env.EMPLOYER_LEAD_NOTIFY_EMAIL;
  if (notifyEmail) {
    sendEmail(notifyEmail, `Ескалація Оракула: ${reason}`, employerHandoffEmailHtml(reason, contact, transcript), 'employer_handoff').catch((e) => console.error('[orakul/chat] Email notify failed:', e));
  }
}

async function saveLead(
  firstName: string, contact: string,
  service: string, situation: string, email: string,
  metadata?: Record<string, unknown>,
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
        `INSERT INTO kompas_activities (entity_type, entity_id, type, title, body, metadata) VALUES ('lead', $1, 'note', 'Анкета від Оракула (Web)', $2, $3::jsonb)`,
        [row.id, crmMsg, JSON.stringify(metadata || {})]
      );
    }
  } catch (err) {
    console.error('[orakul/chat] saveLead:', err);
  }
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

  // Детермінований бекстоп (регекс), незалежний від того, чи LLM сама
  // згадає про ескалацію в своїй відповіді — спрацьовує одразу на вхідне
  // повідомлення, до виклику моделі, тож команда дізнається навіть якщо
  // модель проігнорує інструкцію з промпту.
  const latestUserMsg = [...messages].reverse().find((m: any) => m.role === 'user');
  if (latestUserMsg) {
    const preCheck = checkDeterministicHandoffTriggers(latestUserMsg.content);
    if (preCheck.handoff && preCheck.reason) {
      const transcript = messages.map((m: any) => `${m.role === 'user' ? 'Клієнт' : 'Бот'}: ${m.content}`).join('\n');
      notifyEmployerHandoff(`[авто-тригер] ${preCheck.reason}`, 'невідомо — див. розмову', transcript);
    }
  }
  const adBlockNote = hasAdBlockAlreadyShown(messages)
    ? '\n\n[ПРИМІТКА: рекламний блок про юридичний супровід уже показано раніше в цій розмові — НЕ повторюй його, окрім фінального повідомлення роботодавцю.]'
    : '\n\n[ПРИМІТКА: рекламний блок про юридичний супровід ще НЕ показано в цій розмові — якщо це перша відповідь роботодавцю, покажи його зараз.]';
  const systemInstructionWithNote = ORAKUL_SYSTEM_PROMPT + adBlockNote;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const useLocalLlm = process.env.USE_LOCAL_LLM === 'true';
        const localUrl = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:1234/v1';
        const localModel = process.env.LOCAL_LLM_MODEL || 'local-model';

        if (useLocalLlm) {
          const openAiMessages = [
            { role: 'system', content: systemInstructionWithNote },
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
            config: { systemInstruction: systemInstructionWithNote }
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
          const d = extractTaggedJson(fullText, '[КАНДИДАТ_ГОТОВИЙ]');
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
          } else {
            console.error('[orakul/chat] candidate JSON malformed/incomplete:', fullText);
            await saveLead('Кандидат (дані неповні)', 'невідомо — див. розмову', 'EWU — Зварювальник (AI чат)', fullText, '');
          }
        }

        // Detect employer lead
        if (fullText.includes(EMPLOYER_SENTINEL)) {
          const d = extractEmployerJson(fullText);
          const contact = d?.whatsapp || d?.email;
          const name = d?.contact_person || d?.company_name;
          if (d && contact && name) {
            const situation = buildEmployerSituation(d);
            await saveLead(name, contact, 'EWU — Роботодавець (AI чат)', situation, d.email || '', d as unknown as Record<string, unknown>);
            notifyEmployerCompletion(d, situation);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ lead_saved: true })}\n\n`));
          } else {
            // Тег є, але JSON не розпарсився або бракує ключових полів —
            // все одно зберігаємо, щоб заявка не зникла безслідно.
            console.error('[orakul/chat] employer JSON malformed/incomplete:', fullText);
            await saveLead('Роботодавець (дані неповні)', 'невідомо — див. розмову', 'EWU — Роботодавець (AI чат)', fullText, '', d ? (d as unknown as Record<string, unknown>) : undefined);
            notifyAdmin(`🚨 <b>Новий лід у CRM (Роботодавець, Web) — дані неповні!</b>\n${fullText}`).catch((e) => console.error('[orakul/chat] Telegram notify failed:', e));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ lead_saved: true })}\n\n`));
          }
        }

        // Detect immediate handoff (escalation before the questionnaire completes)
        const handoffReason = extractHandoffReason(fullText);
        if (handoffReason) {
          const transcript = messages.map((m: any) => `${m.role === 'user' ? 'Клієнт' : 'Бот'}: ${m.content}`).join('\n');
          const situation = `⚠️ НЕГАЙНА ЕСКАЛАЦІЯ: ${handoffReason}\n\n${transcript}`;
          await saveLead('Роботодавець (ескалація)', 'невідомо — див. розмову', 'EWU — Роботодавець (ескалація)', situation, '');
          notifyEmployerHandoff(handoffReason, 'невідомо — див. розмову', transcript);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ lead_saved: true })}\n\n`));
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
