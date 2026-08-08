export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/* /api/admin/orders — оплачені замовлення як робоче місце менеджера.
 *
 * Замінює нинішній процес «менеджер щоранку відкриває kompas.migracji@gmail.com
 * і шукає серед листів, чи хтось заплатив». Пошта лишається резервним каналом
 * сповіщення, а роботу веде тут: список, статус оплати, дані клієнта,
 * кнопка «Взяти в роботу».
 *
 * GET  — список замовлень з фільтром за статусом
 * POST — { session_id, action: "claim" } взяти замовлення в роботу */
import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { sendMessage } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer", "sales"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const search = (searchParams.get("q") || "").trim();

  const rows = await q(
    `SELECT
       p.id, p.order_number, p.session_id, p.status, p.provider, p.method,
       p.amount_grosz, p.currency, p.description, p.service_slug,
       p.customer_name, p.customer_email, p.customer_phone, p.messenger,
       p.verify_error, p.paid_at, p.created_at, p.claimed_at, p.lead_uuid,
       u.full_name AS claimed_by_name
     FROM kompas_payments p
     LEFT JOIN kompas_users u ON u.id = p.claimed_by
     WHERE ($1 = '' OR p.status = $1)
       AND ($2 = '' OR p.order_number ILIKE '%'||$2||'%'
                    OR p.customer_name  ILIKE '%'||$2||'%'
                    OR p.customer_phone ILIKE '%'||$2||'%'
                    OR p.customer_email ILIKE '%'||$2||'%')
     ORDER BY
       /* Непідтверджені — нагору: там реальні гроші без підтвердження. */
       CASE p.status WHEN 'verify_failed' THEN 0 WHEN 'pending' THEN 1 ELSE 2 END,
       p.created_at DESC
     LIMIT 200`,
    [status, search],
  );

  const totals = await one(
    `SELECT
       count(*) FILTER (WHERE status = 'paid')::int          AS paid_count,
       count(*) FILTER (WHERE status = 'verify_failed')::int AS failed_count,
       count(*) FILTER (WHERE status = 'paid' AND claimed_at IS NULL)::int AS unclaimed_count,
       COALESCE(sum(amount_grosz) FILTER (WHERE status = 'paid'), 0)::int  AS paid_grosz
     FROM kompas_payments`,
  );

  return NextResponse.json({ orders: rows, totals });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer", "sales"]);
  /* requireAuth повертає або {error,status}, або {user} — перевіряємо обидва,
     інакше auth.user лишається possibly undefined (той самий патерн, що в
     app/api/admin/auth/2fa/*). */
  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
  }

  const body = await req.json().catch(() => ({}));
  const sessionId = String(body.session_id || "");
  if (!sessionId || body.action !== "claim") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const row = (await one(
    `UPDATE kompas_payments
        SET claimed_by = $2, claimed_at = now()
      WHERE session_id = $1 AND claimed_at IS NULL
      RETURNING order_number, lead_uuid`,
    [sessionId, Number(auth.user.sub)],
  )) as { order_number: string; lead_uuid: string | null } | null;

  if (!row) {
    return NextResponse.json({ error: "Замовлення вже взято в роботу" }, { status: 409 });
  }

  /* Клієнт має дізнатися, що його справу підхопили — це той самий крок
     «Взяти в роботу → клієнту йде повідомлення», без ручного копіювання. */
  if (row.lead_uuid) {
    const lead = (await one(
      `SELECT chat_id FROM leads WHERE id = $1`,
      [row.lead_uuid],
    )) as { chat_id: number | null } | null;

    if (lead?.chat_id) {
      try {
        await sendMessage(
          lead.chat_id,
          `👋 Вітаємо! Вашу справу <b>${row.order_number}</b> вже прийняв спеціаліст. ` +
          `Найближчим часом він зв'яжеться з вами.`,
        );
      } catch { /* не блокуємо взяття в роботу через збій Telegram */ }
    }
  }

  return NextResponse.json({ ok: true, order_number: row.order_number });
}
