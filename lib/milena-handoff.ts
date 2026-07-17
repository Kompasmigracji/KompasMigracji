// Мілена — передача розмови людині. Пишу напряму в tasks (а не через
// lib/task-from-lead.ts, який жорстко зашитий на category='general',
// priority='normal' і не має куди прив'язати conversation_id) — так само,
// як і task-from-lead.ts, зберігаю conversation_id текстовою міткою в
// description, бо tasks.id це bigint без jsonb/FK-поля для зовнішніх систем.
import { q, one } from "@/lib/db";

interface HandoffContext {
  conversationId: string;
  serviceDirection: string | null;
  serviceSubservice: string | null;
  reason: string;
  handoffTo: string;
  priority: "normal" | "urgent";
  collectedContext: Record<string, unknown>;
}

export async function handoffToHuman(ctx: HandoffContext): Promise<void> {
  const title = `[Мілена] ${ctx.serviceDirection || "Запит"}${ctx.serviceSubservice ? " — " + ctx.serviceSubservice : ""}`;
  const contextLines = Object.entries(ctx.collectedContext)
    .filter(([k]) => !k.startsWith("_"))
    .map(([k, v]) => `${k}: ${v}`);

  const description = [
    `Розмова: ${ctx.conversationId}`,
    `Причина передачі: ${ctx.reason}`,
    `Передано: ${ctx.handoffTo}`,
    ...contextLines,
  ].join("\n");

  await q(
    `INSERT INTO tasks (title, description, category, stage, priority)
     VALUES ($1, $2, 'legal', 'todo', $3)`,
    [title, description, ctx.priority]
  );

  const phone = ctx.collectedContext.phone_pl as string | undefined;
  const email = ctx.collectedContext.email as string | undefined;
  if (!phone && !email) return;

  const name = (ctx.collectedContext.full_name_latin as string | undefined) || "Клієнт Мілени";
  const service = `Мілена — ${ctx.serviceDirection || "запит"}${ctx.serviceSubservice ? " (" + ctx.serviceSubservice + ")" : ""}`;

  try {
    const row = (await one(
      `INSERT INTO leads (first_name, contact, source, service, situation, email, status, created_at)
       VALUES ($1, $2, 'milena_bot', $3, $4, $5, 'new', NOW())
       ON CONFLICT DO NOTHING RETURNING id`,
      [name, phone || email, service, ctx.reason, email || null]
    )) as { id: string } | null;

    await one(
      `INSERT INTO kompas_leads (source, name, contact, email, message, status)
       VALUES ('other', $1, $2, $3, $4, 'new')`,
      [name, phone || email, email || null, `${service}\n${ctx.reason}`]
    );

    if (row) {
      await one(
        `INSERT INTO kompas_activities (entity_type, entity_id, type, title, body) VALUES ('lead', $1, 'note', 'Передача від бота Мілена', $2)`,
        [row.id, description]
      );
    }
  } catch (err) {
    console.error("[milena-handoff] lead mirror failed:", err);
  }
}
