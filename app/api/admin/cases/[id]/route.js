export const dynamic = "force-dynamic";
/* /api/admin/cases/[id] — окрема справа Понаглення.
   GET:    деталi справи + лог подiй.
   PATCH:  оновити поля (stage, status, документи тощо).
   DELETE: закрити справу (status = closed). */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const STAGE_LABEL = {
  analysis:   "Аналiз документiв",
  ponaglenie: "Понаглення подано",
  court:      "Пiдготовка до суду",
};

export async function GET(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const c = await one(
    `SELECT *,
       CASE WHEN deadline_date IS NOT NULL
            THEN (deadline_date - CURRENT_DATE)::int
            ELSE NULL
       END AS days_left
     FROM cases WHERE id=$1`,
    [params.id]
  );
  if (!c) return NextResponse.json({ error: "Не знайдено" }, { status: 404 });

  const logs = await q(
    "SELECT * FROM case_logs WHERE case_id=$1 ORDER BY created_at ASC",
    [params.id]
  );
  return NextResponse.json({ case: c, logs });
}

export async function PATCH(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  const allowed = [
    "full_name","contact","case_number","submission_date","urzad",
    "stage","status","has_dodatek_1","has_zus_cert",
    "ponaglenie_sent_at","deadline_date","notes","alert_sent","assigned_to",
  ];

  const sets = [];
  const vals = [];
  let i = 1;
  for (const k of allowed) {
    if (k in b) {
      sets.push(`${k}=$${i}`);
      vals.push(b[k]);
      i++;
    }
  }
  if (sets.length === 0) {
    return NextResponse.json({ error: "Нема полiв для оновлення" }, { status: 400 });
  }
  vals.push(params.id);

  const row = await one(
    `UPDATE cases SET ${sets.join(",")} WHERE id=$${i} RETURNING *`,
    vals
  );
  if (!row) return NextResponse.json({ error: "Не знайдено" }, { status: 404 });

  // Лог змiни етапу
  if (b.stage) {
    await q(
      `INSERT INTO case_logs (case_id, event, actor, details)
       VALUES ($1,$2,'manager',$3)`,
      [params.id, `Етап: ${STAGE_LABEL[b.stage] || b.stage}`, JSON.stringify({ stage: b.stage })]
    );
  }

  // Лог призначення на працiвника
  if ("assigned_to" in b) {
    const label = b.assigned_to
      ? `Призначено виконавця (id=${b.assigned_to})`
      : "Призначення знято";
    await q(
      `INSERT INTO case_logs (case_id, event, actor)
       VALUES ($1,$2,'manager')`,
      [params.id, label]
    );
  }

  // Лог понаглення
  if (b.ponaglenie_sent_at) {
    await q(
      `INSERT INTO case_logs (case_id, event, actor)
       VALUES ($1,'Понаглення вiдправлено','manager')`,
      [params.id]
    );
  }

  return NextResponse.json({ case: row });
}

export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  await q("UPDATE cases SET status='closed' WHERE id=$1", [params.id]);
  await q(
    `INSERT INTO case_logs (case_id, event, actor)
     VALUES ($1,'Справу закрито','manager')`,
    [params.id]
  );
  return NextResponse.json({ ok: true });
}
