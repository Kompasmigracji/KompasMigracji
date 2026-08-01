export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Deadline tracker cron — runs daily, sends Telegram/email reminders for
// kompas_deadlines rows due today per kompas_deadlines_due() (90/60/30/14/7/1 days
// before target_date by default). That function excludes a deadline+days_before pair
// entirely once ANY channel has a logged notification for it (see kompas_deadline_notifications
// UNIQUE (deadline_id, days_before, channel) + the function's NOT EXISTS check) — so every
// available channel for a row must be attempted in the same run this row is picked up.

import { NextRequest, NextResponse } from "next/server";
import { q } from "@/lib/db";
import { sendMessage } from "@/lib/telegram";
import { sendEmail } from "@/lib/email";

function checkCronAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret) return authHeader === `Bearer ${secret}`;
  return req.headers.get("x-vercel-cron") === "1";
}

type DeadlineType =
  | "karta_pobytu_expiry"
  | "karta_pobytu_application_window"
  | "ukr_status_expiry"
  | "appeal_deadline"
  | "passport_expiry"
  | "visa_expiry"
  | "benefit_800plus"
  | "other";

interface DueRow {
  deadline_id: string;
  days_before: number;
  title: string;
  deadline_type: DeadlineType;
  target_date: string;
  locale: string;
  telegram_chat_id: string | number | null;
  contact_email: string | null;
  kompas_user_id: string | number | null;
}

const LABELS: Record<string, Record<DeadlineType, string>> = {
  uk: {
    karta_pobytu_expiry: "Закінчення терміну дії карти побуту",
    karta_pobytu_application_window: "Вікно подачі на продовження карти побуту",
    ukr_status_expiry: "Закінчення статусу UKR (тимчасовий захист)",
    appeal_deadline: "Термін на оскарження рішення",
    passport_expiry: "Закінчення терміну дії паспорта",
    visa_expiry: "Закінчення терміну дії візи",
    benefit_800plus: "Продовження виплати 800+",
    other: "Важливий термін",
  },
  pl: {
    karta_pobytu_expiry: "Wygaśnięcie karty pobytu",
    karta_pobytu_application_window: "Okno na złożenie wniosku o przedłużenie karty pobytu",
    ukr_status_expiry: "Wygaśnięcie statusu UKR (ochrona czasowa)",
    appeal_deadline: "Termin na odwołanie od decyzji",
    passport_expiry: "Wygaśnięcie paszportu",
    visa_expiry: "Wygaśnięcie wizy",
    benefit_800plus: "Przedłużenie świadczenia 800+",
    other: "Ważny termin",
  },
  en: {
    karta_pobytu_expiry: "Residence card expiry",
    karta_pobytu_application_window: "Residence card renewal application window",
    ukr_status_expiry: "UKR temporary protection status expiry",
    appeal_deadline: "Appeal deadline",
    passport_expiry: "Passport expiry",
    visa_expiry: "Visa expiry",
    benefit_800plus: "800+ benefit renewal",
    other: "Important deadline",
  },
  ru: {
    karta_pobytu_expiry: "Истечение срока карты побыту",
    karta_pobytu_application_window: "Окно подачи на продление карты побыту",
    ukr_status_expiry: "Истечение статуса UKR (временная защита)",
    appeal_deadline: "Срок обжалования решения",
    passport_expiry: "Истечение срока паспорта",
    visa_expiry: "Истечение срока визы",
    benefit_800plus: "Продление выплаты 800+",
    other: "Важный срок",
  },
  rom: {
    karta_pobytu_expiry: "Expirarea cardului de ședere",
    karta_pobytu_application_window: "Fereastra de depunere pentru reînnoirea cardului de ședere",
    ukr_status_expiry: "Expirarea statutului UKR (protecție temporară)",
    appeal_deadline: "Termen de contestare a deciziei",
    passport_expiry: "Expirarea pașaportului",
    visa_expiry: "Expirarea vizei",
    benefit_800plus: "Reînnoirea beneficiului 800+",
    other: "Termen important",
  },
};

const INTRO: Record<string, string> = {
  uk: "Нагадування від Kompas Migracji",
  pl: "Przypomnienie od Kompas Migracji",
  en: "Reminder from Kompas Migracji",
  ru: "Напоминание от Kompas Migracji",
  rom: "Memento de la Kompas Migracji",
};

const DAYS_LEFT: Record<string, (n: number) => string> = {
  uk: (n) => `Залишилось днів: ${n}`,
  pl: (n) => `Pozostało dni: ${n}`,
  en: (n) => `Days left: ${n}`,
  ru: (n) => `Осталось дней: ${n}`,
  rom: (n) => `Zile rămase: ${n}`,
};

const CTA: Record<string, string> = {
  uk: "Потрібна допомога? Напишіть нам:",
  pl: "Potrzebujesz pomocy? Napisz do nas:",
  en: "Need help? Message us:",
  ru: "Нужна помощь? Напишите нам:",
  rom: "Ai nevoie de ajutor? Scrie-ne:",
};

function label(locale: string, type: DeadlineType): string {
  return (LABELS[locale] || LABELS.uk)[type] || (LABELS[locale] || LABELS.uk).other;
}

function buildMessage(row: DueRow): string {
  const loc = LABELS[row.locale] ? row.locale : "uk";
  const dateStr = new Date(row.target_date).toLocaleDateString(
    loc === "uk" ? "uk-UA" : loc === "pl" ? "pl-PL" : loc === "ru" ? "ru-RU" : loc === "rom" ? "ro-RO" : "en-GB",
    { day: "2-digit", month: "2-digit", year: "numeric" },
  );
  return (
    `⏰ <b>${INTRO[loc]}</b>\n\n` +
    `<b>${label(loc, row.deadline_type)}</b>${row.title ? `: ${row.title}` : ""}\n` +
    `${DAYS_LEFT[loc](row.days_before)} (${dateStr})\n\n` +
    `${CTA[loc]} https://wa.me/48729271848`
  );
}

function buildEmailHtml(row: DueRow): string {
  const loc = LABELS[row.locale] ? row.locale : "uk";
  const dateStr = new Date(row.target_date).toLocaleDateString(
    loc === "uk" ? "uk-UA" : loc === "pl" ? "pl-PL" : loc === "ru" ? "ru-RU" : loc === "rom" ? "ro-RO" : "en-GB",
    { day: "2-digit", month: "2-digit", year: "numeric" },
  );
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;">
<h2>⏰ ${INTRO[loc]}</h2>
<p><strong>${label(loc, row.deadline_type)}</strong>${row.title ? `: ${row.title}` : ""}</p>
<p>${DAYS_LEFT[loc](row.days_before)} (${dateStr})</p>
<p>${CTA[loc]} <a href="https://wa.me/48729271848">WhatsApp +48 729 271 848</a></p>
</body></html>`;
}

export async function POST(req: NextRequest) {
  if (!checkCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = (await q(`SELECT * FROM kompas_deadlines_due()`)) as DueRow[];

  // Rows that only carry kompas_user_id need their email resolved from kompas_users.
  const userIds = [...new Set(due.filter((r) => !r.contact_email && r.kompas_user_id).map((r) => r.kompas_user_id))];
  const userEmails = new Map<string, string>();
  if (userIds.length > 0) {
    const rows = await q(`SELECT id, email FROM kompas_users WHERE id = ANY($1::bigint[])`, [userIds]);
    for (const u of rows as Array<{ id: string; email: string | null }>) {
      if (u.email) userEmails.set(String(u.id), u.email);
    }
  }

  let sent = 0;

  for (const row of due) {
    const channelsUsed: string[] = [];

    if (row.telegram_chat_id) {
      await sendMessage(row.telegram_chat_id, buildMessage(row), "HTML").catch(() => {});
      channelsUsed.push("telegram");
    }

    const email = row.contact_email || (row.kompas_user_id ? userEmails.get(String(row.kompas_user_id)) : null);
    if (email) {
      await sendEmail(
        email,
        `${INTRO[LABELS[row.locale] ? row.locale : "uk"]}: ${label(row.locale, row.deadline_type)}`,
        buildEmailHtml(row),
        "deadline_reminder",
      ).catch(() => {});
      channelsUsed.push("email");
    }

    for (const channel of channelsUsed) {
      await q(
        `INSERT INTO kompas_deadline_notifications (deadline_id, days_before, channel)
         VALUES ($1, $2, $3)
         ON CONFLICT (deadline_id, days_before, channel) DO NOTHING`,
        [row.deadline_id, row.days_before, channel],
      ).catch(() => {});
    }

    if (channelsUsed.length > 0) sent++;
  }

  return NextResponse.json({ ok: true, dueCount: due.length, sent });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
