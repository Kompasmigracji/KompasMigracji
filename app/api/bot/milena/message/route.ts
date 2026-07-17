export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { handoffToHuman } from "@/lib/milena-handoff";
import {
  MILENA_SYSTEM_PROMPT,
  matchIntents,
  isMultiIntent,
  getMissingFields,
  getFlowMeta,
  withFlowMeta,
  fieldLabel,
  shouldEscalate,
  type Intent,
  type CollectedContext,
} from "@/lib/milena-bot";

const CHANNELS = ["facebook", "tiktok", "viber", "whatsapp", "web"] as const;
const MAX_TOPIC_CLARIFY = 2;

interface ConversationRow {
  id: string;
  client_id: string | null;
  channel: string;
  service_id: string | null;
  current_stage: string | null;
  collected_context: CollectedContext;
  status: "active" | "handed_off" | "closed";
}

interface ServiceRow {
  id: string;
  direction: string;
  subservice: string | null;
}

interface KnowledgeCardRow {
  id: string;
  answer_short: string;
  answer_full: string;
  disclaimer: string | null;
  next_question: string | null;
  status: string;
  handoff_condition: string[] | null;
}

interface DialogFlowRow {
  required_fields: string[];
  next_stage_on_complete: string | null;
  max_clarifying_questions: number;
}

async function callClaude(contextBlock: string, history: { role: string; content: string }[], userMessage: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return "Вибачте, зараз я не можу відповісти — зв'яжіться, будь ласка, напряму: +48 729 271 848.";

  const messages = [
    ...history,
    { role: "user", content: `${contextBlock}\n\n[ПОВІДОМЛЕННЯ КЛІЄНТА]\n${userMessage}` },
  ];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: MILENA_SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!response.ok) {
    console.error("[milena] Anthropic error:", await response.text());
    return "Вибачте, сталася технічна помилка. Зв'яжіться, будь ласка, напряму: +48 729 271 848.";
  }

  const result = await response.json();
  return result.content?.[0]?.text || "Вибачте, не вдалося сформувати відповідь.";
}

async function saveMessage(conversationId: string, sender: "client" | "bot", content: string, cardId?: string | null) {
  await q(
    `INSERT INTO messages (conversation_id, sender, content, knowledge_card_id) VALUES ($1,$2,$3,$4)`,
    [conversationId, sender, content, cardId || null]
  );
}

async function updateConversation(id: string, patch: Partial<ConversationRow>) {
  const sets: string[] = [];
  const vals: unknown[] = [];
  let i = 1;
  for (const [k, v] of Object.entries(patch)) {
    sets.push(`${k} = $${i++}`);
    vals.push(k === "collected_context" ? JSON.stringify(v) : v);
  }
  sets.push(`updated_at = now()`);
  vals.push(id);
  await q(`UPDATE conversations SET ${sets.join(", ")} WHERE id = $${i}`, vals);
}

async function respond(
  conversationId: string,
  contextBlock: string,
  patch: Partial<ConversationRow>,
  userMessage: string,
  cardId: string | null = null
) {
  const recent = (await q(
    `SELECT sender, content FROM messages WHERE conversation_id=$1 ORDER BY created_at DESC LIMIT 20`,
    [conversationId]
  )) as { sender: string; content: string }[];
  const claudeHistory = recent
    .slice(1) // найновіше — щойно збережене повідомлення клієнта, воно піде окремо нижче
    .reverse()
    .map((m) => ({ role: m.sender === "bot" ? "assistant" : "user", content: m.content }));

  const reply = await callClaude(contextBlock, claudeHistory, userMessage);
  await saveMessage(conversationId, "bot", reply, cardId);
  await updateConversation(conversationId, patch);

  return NextResponse.json({
    conversation_id: conversationId,
    reply,
    status: patch.status ?? "active",
    stage: patch.current_stage ?? null,
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(ip, { max: 20, windowMs: 60_000, ns: "milena-bot" });
  if (!rl.ok) {
    return NextResponse.json({ error: "Забагато запитів, спробуйте за хвилину." }, { status: 429 });
  }

  let body: { conversation_id?: string; channel?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = (body.message || "").trim();
  const channel = body.channel;
  if (!message) return NextResponse.json({ error: "message is required" }, { status: 400 });
  if (!channel || !(CHANNELS as readonly string[]).includes(channel)) {
    return NextResponse.json({ error: `channel must be one of: ${CHANNELS.join(", ")}` }, { status: 400 });
  }

  // ── Завантажити або створити розмову ──────────────────────────────────
  let conversation: ConversationRow;
  if (body.conversation_id) {
    const found = (await one(`SELECT * FROM conversations WHERE id=$1`, [body.conversation_id])) as ConversationRow | null;
    if (!found) return NextResponse.json({ error: "conversation not found" }, { status: 404 });
    conversation = found;
  } else {
    conversation = (await one(
      `INSERT INTO conversations (channel, current_stage, status) VALUES ($1, 'Перше звернення', 'active') RETURNING *`,
      [channel]
    )) as ConversationRow;
  }

  await saveMessage(conversation.id, "client", message);

  // Розмову вже передано людині/закрито — бот більше не втручається.
  if (conversation.status !== "active") {
    const reply =
      conversation.status === "handed_off"
        ? "Ваш запит уже передано нашому спеціалісту — він зв'яжеться з вами найближчим часом."
        : "Цю розмову вже завершено. Якщо у вас нове питання, напишіть, будь ласка, ще раз.";
    await saveMessage(conversation.id, "bot", reply);
    return NextResponse.json({
      conversation_id: conversation.id,
      reply,
      status: conversation.status,
      stage: conversation.current_stage,
    });
  }

  let ctx: CollectedContext = conversation.collected_context || {};
  let meta = getFlowMeta(ctx);
  let serviceId = conversation.service_id;
  let stage = conversation.current_stage || "Перше звернення";

  if (meta.awaiting_field) {
    // Наступне повідомлення клієнта — це відповідь на поле, яке щойно питали.
    ctx = { ...ctx, [meta.awaiting_field]: message };
    ctx = withFlowMeta(ctx, { awaiting_field: undefined });
    meta = getFlowMeta(ctx);

    if ((meta.awaiting_field === undefined) && !conversation.client_id) {
      const phone = ctx.phone_pl as string | undefined;
      const email = ctx.email as string | undefined;
      if (phone || email) {
        const client = (await one(
          `INSERT INTO clients (full_name_latin, phone_pl, email, preferred_contact) VALUES ($1,$2,$3,$4) RETURNING id`,
          [ctx.full_name_latin || null, phone || null, email || null, ctx.preferred_contact || null]
        )) as { id: string };
        await updateConversation(conversation.id, { client_id: client.id });
      }
    }
  } else {
    // ── Пошук наміру (keyword-matching, без embeddings — MVP-скоуп) ──────
    const intents = (await q(
      `SELECT i.* FROM intents i JOIN services s ON s.id = i.service_id WHERE s.status != 'do_not_use'`
    )) as Intent[];
    const matches = matchIntents(message, intents);

    if (matches.length === 0) {
      const topicClarify = (meta.topic_clarify_count || 0) + 1;
      if (topicClarify > MAX_TOPIC_CLARIFY) {
        await handoffToHuman({
          conversationId: conversation.id,
          serviceDirection: null,
          serviceSubservice: null,
          reason: "не вдалося визначити послугу після кількох уточнень",
          handoffTo: "Мілена",
          priority: "normal",
          collectedContext: ctx,
        });
        return respond(
          conversation.id,
          `[КОНТЕКСТ]\nДія: escalate\nПричина: не вдалося визначити, яка послуга цікавить клієнта. Повідом, що передаєш запит колезі, яка зв'яжеться найближчим часом.`,
          { status: "handed_off", collected_context: ctx },
          message
        );
      }
      const services = (await q(`SELECT DISTINCT direction FROM services WHERE status != 'do_not_use' ORDER BY direction`)) as {
        direction: string;
      }[];
      ctx = withFlowMeta(ctx, { topic_clarify_count: topicClarify });
      return respond(
        conversation.id,
        `[КОНТЕКСТ]\nДія: ask_topic\nНапрямки, які ми супроводжуємо: ${services.map((s) => s.direction).join(", ")}.\nПопроси клієнта уточнити, яка саме послуга його цікавить.`,
        { collected_context: ctx },
        message
      );
    }

    if (isMultiIntent(matches)) {
      const serviceIds = [...new Set(matches.map((m) => m.serviceId))];
      const services = (await q(
        `SELECT id, direction, subservice FROM services WHERE id = ANY($1::uuid[])`,
        [serviceIds]
      )) as ServiceRow[];
      const names = services.map((s) => s.subservice || s.direction).join(" і ");
      return respond(
        conversation.id,
        `[КОНТЕКСТ]\nДія: ask_priority\nКлієнт запитав одразу про кілька послуг: ${names}.\nЗапитай клієнта, з чого почати — приклад формулювання: "Бачу два питання — про ${names}. З чого почнемо?"`,
        { collected_context: ctx },
        message
      );
    }

    serviceId = matches[0].serviceId;
    ctx = withFlowMeta(ctx, { intent_label: matches[0].intent.intent_label, topic_clarify_count: 0 });
    meta = getFlowMeta(ctx);
  }

  if (!serviceId) {
    return NextResponse.json({ error: "internal: no service resolved" }, { status: 500 });
  }

  // ── Бракуючі поля ────────────────────────────────────────────────────
  const flow = (await one(
    `SELECT required_fields, next_stage_on_complete, max_clarifying_questions FROM dialog_flows WHERE service_id=$1 AND current_stage=$2`,
    [serviceId, stage]
  )) as DialogFlowRow | null;

  if (flow) {
    const missing = getMissingFields(flow.required_fields, ctx);
    const fieldClarify = meta.field_clarify_count || 0;
    if (missing.length > 0 && fieldClarify < flow.max_clarifying_questions) {
      ctx = withFlowMeta(ctx, { field_clarify_count: fieldClarify + 1, awaiting_field: missing[0] });
      return respond(
        conversation.id,
        `[КОНТЕКСТ]\nДія: ask_field\nПотрібно ввічливо запитати: ${fieldLabel(missing[0])}.`,
        { service_id: serviceId, current_stage: stage, collected_context: ctx },
        message
      );
    }
    if (missing.length === 0 && flow.next_stage_on_complete) {
      stage = flow.next_stage_on_complete;
    }
  }

  // ── Картка знань ─────────────────────────────────────────────────────
  const intentLabel = meta.intent_label as string | undefined;
  const card = intentLabel
    ? ((await one(`SELECT * FROM knowledge_cards WHERE service_id=$1 AND intent=$2`, [serviceId, intentLabel])) as KnowledgeCardRow | null)
    : null;

  const service = (await one(`SELECT id, direction, subservice FROM services WHERE id=$1`, [serviceId])) as ServiceRow;

  if (!card || shouldEscalate(card, message)) {
    const reason = !card
      ? "немає готової картки знань для цього запиту"
      : card.status !== "actual"
        ? `картка має статус "${card.status}", не позначена як остаточна`
        : "запит підпадає під умову передачі людині";

    const handoffRule = (await one(
      `SELECT handoff_to, priority FROM handoff_rules WHERE service_id=$1 ORDER BY service_id NULLS LAST LIMIT 1`,
      [serviceId]
    )) as { handoff_to: string; priority: "normal" | "urgent" } | null;

    await handoffToHuman({
      conversationId: conversation.id,
      serviceDirection: service?.direction || null,
      serviceSubservice: service?.subservice || null,
      reason,
      handoffTo: handoffRule?.handoff_to || "Мілена",
      priority: handoffRule?.priority || "normal",
      collectedContext: ctx,
    });

    const cardText = card
      ? `Коротка інформація, яку можна дати клієнту: ${card.answer_short}${card.disclaimer ? " " + card.disclaimer : ""}`
      : "Готової інформації по цій темі поки немає.";

    return respond(
      conversation.id,
      `[КОНТЕКСТ]\nДія: escalate\n${cardText}\nПовідом клієнту цю інформацію (якщо є) і чітко скажи, що передаєш запит колезі, яка зв'яжеться найближчим часом. Не обіцяй конкретних строків чи цін, яких немає в картці.`,
      { service_id: serviceId, current_stage: stage, collected_context: ctx, status: "handed_off" },
      message,
      card?.id || null
    );
  }

  // ── Картка 'actual' без умов передачі — звичайна відповідь ────────────
  return respond(
    conversation.id,
    `[КОНТЕКСТ]\nДія: answer\nКоротка відповідь: ${card.answer_short}\nПовна відповідь: ${card.answer_full}${card.disclaimer ? `\nДисклеймер: ${card.disclaimer}` : ""}${card.next_question ? `\nНаступне питання до клієнта: ${card.next_question}` : ""}\nПередай цю інформацію клієнту своїми словами, дотримуючись системних правил.`,
    { service_id: serviceId, current_stage: stage, collected_context: ctx },
    message,
    card.id
  );
}
