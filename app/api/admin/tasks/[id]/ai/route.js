export const dynamic = "force-dynamic";
/* /api/admin/tasks/[id]/ai — AI-асистент для аналізу і стратегії справи. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const CATEGORY_UA = { general: "Загальне", legal: "Юридичне", admin: "Адміністративне", research: "Дослідження" };
const PRIORITY_UA  = { low: "Низький", normal: "Звичайний", high: "Високий", urgent: "Терміновий" };

export async function POST(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI не налаштовано. Додайте ANTHROPIC_API_KEY до Environment Variables на Vercel." },
      { status: 503 }
    );
  }

  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Некоректний запит" }, { status: 400 }); }
  if (!b.message?.trim()) return NextResponse.json({ error: "Повідомлення порожнє" }, { status: 400 });

  const task = await one(
    `SELECT t.*, u.full_name AS assignee_name FROM tasks t
     LEFT JOIN kompas_users u ON u.id = t.assigned_to
     WHERE t.id=$1`,
    [params.id]
  );
  if (!task) return NextResponse.json({ error: "Завдання не знайдено" }, { status: 404 });

  const [documents, prevMessages] = await Promise.all([
    q("SELECT name, url, notes FROM task_documents WHERE task_id=$1", [params.id]),
    q("SELECT role, content FROM task_ai_chat WHERE task_id=$1 ORDER BY created_at ASC LIMIT 30", [params.id]),
  ]);

  const docsText = documents.length
    ? documents.map(d => `- ${d.name}: ${d.url}${d.notes ? ` (${d.notes})` : ""}`).join("\n")
    : "Документів ще немає";

  const system = `Ти — AI-асистент команди КомпасМіграції, польської профспілки, що захищає права трудових мігрантів.

ПОТОЧНЕ ЗАВДАННЯ:
Назва: ${task.title}
Опис: ${task.description || "—"}
Категорія: ${CATEGORY_UA[task.category] || task.category}
Пріоритет: ${PRIORITY_UA[task.priority] || task.priority}
Дедлайн: ${task.deadline || "не встановлено"}
Виконавець: ${task.assignee_name || "не призначено"}
Статус: ${task.status === "active" ? "Активне" : "Закрите"}

ДОКУМЕНТИ СПРАВИ:
${docsText}

ТВОЯ РОЛЬ:
Допомагай команді вести цю справу до перемоги. Давай конкретні, практичні поради — юридичні аргументи, наступні кроки, аналіз документів, стратегію. Відповідай українською. Будь лаконічним і по суті. Якщо потрібно більше інформації — питай.`;

  const messages = [
    ...prevMessages.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: b.message.trim() },
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
      max_tokens: 1024,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    console.error("Anthropic error:", await response.text());
    return NextResponse.json({ error: "Помилка AI сервісу" }, { status: 502 });
  }

  const result     = await response.json();
  const assistantMsg = result.content?.[0]?.text || "";

  await q(
    `INSERT INTO task_ai_chat (task_id, role, content) VALUES ($1,'user',$2),($1,'assistant',$3)`,
    [params.id, b.message.trim(), assistantMsg]
  );

  return NextResponse.json({ message: assistantMsg });
}

export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  await q("DELETE FROM task_ai_chat WHERE task_id=$1", [params.id]);
  return NextResponse.json({ ok: true });
}
