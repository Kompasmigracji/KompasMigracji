export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { sendMessage, notifyAdmin, answerCallback } from "@/lib/telegram";
import { sendLanguagePanel, sendMainMenu } from "@/lib/orakul-bot";
import Anthropic from "@anthropic-ai/sdk";
import { ORAKUL_SYSTEM_PROMPT } from "@/lib/orakul-prompt";

interface TgUser { id: number; username?: string; first_name?: string }
interface TgChat { id: number }
interface TgMessage { chat: TgChat; from?: TgUser; text?: string }
interface TgCallbackQuery {
  id: string;
  data?: string;
  from?: TgUser;
  message?: { chat?: TgChat };
}
interface TgUpdate {
  callback_query?: TgCallbackQuery;
  message?: TgMessage;
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
  const token = req.nextUrl.searchParams.get("token") || undefined;

  if (process.env.TELEGRAM_WEBHOOK_SECRET) {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  let upd: TgUpdate;
  try {
    try {
      upd = await req.json() as TgUpdate;
    } catch {
      return NextResponse.json({ ok: true });
    }

    const chatId = upd.callback_query?.message?.chat?.id ?? upd.callback_query?.from?.id ?? upd.message?.chat?.id;
    if (!chatId) return NextResponse.json({ ok: true });

    let text = upd.message?.text?.trim() || "";
    const callbackData = upd.callback_query?.data;
    const callbackId = upd.callback_query?.id;
    const firstName = upd.message?.from?.first_name || upd.callback_query?.from?.first_name || "Користувач";
    const username = upd.message?.from?.username || upd.callback_query?.from?.username || "";

    if (callbackData) {
      text = callbackData; // Default treatment
    }

    if (!text) return NextResponse.json({ ok: true });

    try {
      await q(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS history JSONB DEFAULT '[]'::jsonb`);
    } catch {}

    let lead = await one(
      `SELECT id, history FROM leads WHERE chat_id = $1 AND deleted_at IS NULL LIMIT 1`,
      [String(chatId)]
    ) as { id: string; history: any } | null;

    if (!lead) {
      const userContact = username ? `@${username}` : String(chatId);
      lead = await one(
        `INSERT INTO leads (chat_id, source, first_name, username, contact, status, history)
         VALUES ($1, 'bot', $2, $3, $4, 'new', '[]'::jsonb)
         RETURNING id, history`,
        [String(chatId), firstName, username, userContact]
      ) as { id: string; history: any };

      try {
        await q(
          `INSERT INTO kompas_leads (chat_id, source, name, contact, status)
           VALUES ($1, 'bot', $2, $3, 'new')`,
          [String(chatId), firstName, userContact]
        );
        if (process.env.ADMIN_TELEGRAM_CHAT_ID) {
          await notifyAdmin(`🆕 Новий лід з Telegram!\nІм'я: ${firstName}\nUsername: ${username ? '@' + username : 'немає'}`, token);
        }
      } catch (e) {
        console.error("Error creating new lead:", e);
      }
    } else {
      const userContact = username ? `@${username}` : String(chatId);
      await q(
        `UPDATE leads SET first_name = COALESCE($2, first_name), username = COALESCE($3, username), contact = COALESCE(contact, $4) WHERE id = $1`,
        [lead.id, firstName, username, userContact]
      );
    }

    const history = Array.isArray(lead.history) ? lead.history : [];

    // Intercept specific commands
    if (text.startsWith("/start")) {
      await sendLanguagePanel(chatId, firstName, token);
      history.push({ role: 'assistant', content: '[LANGUAGE_PANEL_SENT]' });
      await q(`UPDATE leads SET history = $1::jsonb WHERE id = $2`, [JSON.stringify(history), lead.id]);
      return NextResponse.json({ ok: true });
    }

    if (callbackData && callbackData.startsWith("lang_")) {
      await answerCallback(callbackId!, "", token);
      await sendMainMenu(chatId, callbackData, token);
      history.push({ role: 'user', content: `[LANGUAGE_SELECTED: ${callbackData}]` });
      await q(`UPDATE leads SET history = $1::jsonb WHERE id = $2`, [JSON.stringify(history), lead.id]);
      return NextResponse.json({ ok: true });
    }

    // Map funnel callbacks to readable text for AI
    if (callbackData) {
      await answerCallback(callbackId!, "", token);
      if (callbackData === "funnel_work") text = "Я шукаю роботу (Work)";
      if (callbackData === "funnel_study") text = "Мене цікавить навчання (Study)";
      if (callbackData === "funnel_legal") text = "Мені потрібна легалізація (Legalization)";
      if (callbackData === "action_call_human") text = "Хочу поговорити з менеджером (Human agent)";
    }

    history.push({ role: 'user', content: text });

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[webhook] ANTHROPIC_API_KEY missing');
      return NextResponse.json({ ok: true });
    }

    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const aiMessages = history.map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      })).slice(-20);

      const resp = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: ORAKUL_SYSTEM_PROMPT,
        messages: aiMessages,
      });

      const aiText = resp.content.filter((c: any) => c.type === 'text').map((c: any) => c.text).join('\n');
      history.push({ role: 'assistant', content: aiText });

      const [visibleText] = aiText.split(/\[КАНДИДАТ_ГОТОВИЙ\]|\[РОБОТОДАВЕЦЬ_ГОТОВИЙ\]/);
      
      if (visibleText.trim()) {
        await sendMessage(chatId, visibleText.trim(), "HTML", token);
      }

      await q(`UPDATE leads SET history = $1::jsonb WHERE id = $2`, [JSON.stringify(history), lead.id]);

      const contactStr = username ? `@${username}` : String(chatId);

      if (aiText.includes('[КАНДИДАТ_ГОТОВИЙ]')) {
        const d = extractJson(aiText, '[КАНДИДАТ_ГОТОВИЙ]');
        const phone = d?.phone as string | undefined;
        const finalContact = phone || contactStr;
        const situation = [
          `AI чат Оракул. Спеціальність: ${d?.specialty || '—'}`,
          `Досвід: ${d?.experience || '—'}`,
          `Документи: ${d?.documents || '—'}`,
          `Мови: ${d?.languages || '—'}`,
          `Мобільність: ${d?.mobility || '—'}`,
          `Оцінка: ${d?.lead_score || '—'}`,
        ].join('. ');

        await q(
          `UPDATE kompas_leads SET contact = $1, message = $2, status = 'in_progress' WHERE chat_id = $3`,
          [finalContact, situation, String(chatId)]
        );
        await q(
          `UPDATE leads SET contact = $1, message = $2, status = 'in_progress' WHERE chat_id = $3`,
          [finalContact, situation, String(chatId)]
        );
        
        // Add to timeline
        try {
          await q(
            `INSERT INTO kompas_activities (entity_type, entity_id, type, title, body) VALUES ('lead', $1, 'note', 'Анкета від Оракула', $2)`,
            [lead.id, situation]
          );
        } catch (e) { console.error("Error adding timeline activity:", e); }
        
        await notifyAdmin(`🚨 <b>Новий лід у CRM (Кандидат)!</b>\nКонтакт: ${finalContact}\nДеталі: ${situation}`, token);
      }

      if (aiText.includes('[РОБОТОДАВЕЦЬ_ГОТОВИЙ]')) {
        const d = extractJson(aiText, '[РОБОТОДАВЕЦЬ_ГОТОВИЙ]');
        const contact = d?.contact as string | undefined;
        const finalContact = contact || contactStr;
        const situation = [
          `AI чат Оракул. Роботодавець.`,
          `Потреба: ${d?.specialty_needed || '—'}`,
          `Кількість: ${d?.workers_count || '—'}`,
          `Локація: ${d?.location || '—'}`,
          `Старт: ${d?.start_date || '—'}`,
          d?.message || '',
        ].filter(Boolean).join(' ');

        await q(
          `UPDATE kompas_leads SET contact = $1, message = $2, email = $3, status = 'in_progress' WHERE chat_id = $4`,
          [finalContact, situation, (d?.email as string) || null, String(chatId)]
        );
        await q(
          `UPDATE leads SET contact = $1, message = $2, email = $3, status = 'in_progress' WHERE chat_id = $4`,
          [finalContact, situation, (d?.email as string) || null, String(chatId)]
        );
        
        // Add to timeline
        try {
          await q(
            `INSERT INTO kompas_activities (entity_type, entity_id, type, title, body) VALUES ('lead', $1, 'note', 'Анкета від Оракула', $2)`,
            [lead.id, situation]
          );
        } catch (e) { console.error("Error adding timeline activity:", e); }

        await notifyAdmin(`🚨 <b>Новий лід у CRM (Роботодавець)!</b>\nКонтакт: ${finalContact}\nДеталі: ${situation}`, token);
      }

    } catch (err: any) {
      console.error("[webhook] AI error", err);
    }

  } catch (globalErr: any) {
    console.error("[webhook] Global error", globalErr);
  }

  return NextResponse.json({ ok: true });
}
