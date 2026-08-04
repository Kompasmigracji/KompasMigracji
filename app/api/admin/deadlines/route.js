export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const DEADLINE_TYPES = [
  "karta_pobytu_expiry",
  "karta_pobytu_application_window",
  "ukr_status_expiry",
  "appeal_deadline",
  "passport_expiry",
  "visa_expiry",
  "benefit_800plus",
  "other",
];

const LOCALES = ["uk", "pl", "en", "ru", "rom"];

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  const conditions = [];
  const params = [];
  let i = 1;

  if (status) {
    conditions.push(`d.status = $${i++}`);
    params.push(status);
  }
  if (type) {
    conditions.push(`d.deadline_type = $${i++}`);
    params.push(type);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const deadlines = await q(
      `SELECT d.id, d.kompas_user_id, d.telegram_chat_id, d.contact_email, d.deadline_type,
              d.title, d.target_date, d.notes, d.locale, d.notify_offsets, d.status,
              d.created_at, d.updated_at, u.full_name AS client_name
       FROM kompas_deadlines d
       LEFT JOIN kompas_users u ON u.id = d.kompas_user_id
       ${where}
       ORDER BY d.target_date ASC`,
      params
    );
    return NextResponse.json({ deadlines });
  } catch (err) {
    console.error("GET deadlines error:", err);
    return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
  }
}

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  const title = (b.title || "").trim();
  const targetDate = b.target_date;
  const deadlineType = DEADLINE_TYPES.includes(b.deadline_type) ? b.deadline_type : "other";
  const locale = LOCALES.includes(b.locale) ? b.locale : "uk";
  const contactEmail = (b.contact_email || "").trim() || null;
  const telegramChatId = b.telegram_chat_id ? parseInt(b.telegram_chat_id) : null;
  const kompasUserId = b.kompas_user_id ? parseInt(b.kompas_user_id) : null;

  if (!title) {
    return NextResponse.json({ error: "Введіть назву терміну" }, { status: 400 });
  }
  if (!targetDate) {
    return NextResponse.json({ error: "Вкажіть дату терміну" }, { status: 400 });
  }
  if (!kompasUserId && !telegramChatId && !contactEmail) {
    return NextResponse.json(
      { error: "Потрібен хоча б один спосіб зв'язку: клієнт, Telegram chat_id або email" },
      { status: 400 }
    );
  }

  try {
    const row = await one(
      `INSERT INTO kompas_deadlines
         (kompas_user_id, telegram_chat_id, contact_email, deadline_type, title, target_date, notes, locale)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [kompasUserId, telegramChatId, contactEmail, deadlineType, title, targetDate, b.notes || null, locale]
    );
    return NextResponse.json({ deadline: row });
  } catch (err) {
    console.error("POST deadlines error:", err);
    return NextResponse.json({ error: "Помилка при створенні терміну" }, { status: 500 });
  }
}
