// F4: Subscription renewal cron — runs daily at 08:00 UTC
// 1. Sends renewal warning 3 days before expiry
// 2. Marks expired subscriptions as 'past_due'
// 3. Sends Telegram + email notifications
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { sendMessage } from "@/lib/telegram";
import { sendEmail } from "@/lib/email";

const ADMIN_CHAT = process.env.TELEGRAM_ADMIN_CHAT_ID;
const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://kompasmigracji.com";

function checkCronAuth(req: NextRequest): boolean {
  const cronHeader = req.headers.get("x-vercel-cron");
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  return cronHeader === "1" || (!!secret && authHeader === `Bearer ${secret}`);
}

export async function POST(req: NextRequest) {
  if (!checkCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Expire subscriptions past their end date
  const expired = await q(
    `UPDATE kompas_subscriptions
     SET status='past_due'
     WHERE status='active' AND ends_at < now()
     RETURNING id, client_name, email, plan_name`,
  );

  // 2. Warn subscribers 3 days before renewal (not already notified)
  const expiring = await q(
    `SELECT id, client_name, email, plan_name, amount_pln, ends_at
     FROM kompas_subscriptions
     WHERE status='active'
       AND ends_at BETWEEN now() AND now() + interval '3 days'
       AND renewal_notified = false`,
  );

  let warned = 0;
  for (const sub of expiring) {
    const endDate = new Date(sub.ends_at).toLocaleDateString("pl-PL");

    if (sub.email) {
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;">
<h2>Przypomnienie o odnowieniu subskrypcji</h2>
<p>Czesc, <strong>${sub.client_name}</strong>!</p>
<p>Twoja subskrypcja <strong>${sub.plan_name}</strong> wygasa <strong>${endDate}</strong>.</p>
<p>Aby kontynuowac korzystanie z naszych uslug, odnow subskrypcje:</p>
<div style="text-align:center;margin:24px 0;">
  <a href="${SITE}/plans" style="display:inline-block;padding:12px 24px;background:#D8232A;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">
    Odnow subskrypcje
  </a>
</div>
</body></html>`;
      await sendEmail(sub.email, `Twoja subskrypcja ${sub.plan_name} wygasa za 3 dni`, html, "renewal_warning").catch(() => {});
    }

    await q(
      "UPDATE kompas_subscriptions SET renewal_notified=true WHERE id=$1",
      [sub.id],
    );
    warned++;
  }

  // Admin Telegram summary
  if (ADMIN_CHAT && (expired.length > 0 || expiring.length > 0)) {
    await sendMessage(
      ADMIN_CHAT,
      `<b>&#x1F504; Subskrypcje — raport dzienny</b>\n` +
      `Wygasle: <b>${expired.length}</b>\n` +
      `Ostrzezenia wyslane: <b>${warned}</b>`,
      "HTML",
    ).catch(() => {});
  }

  return NextResponse.json({
    ok: true,
    expired: expired.length,
    warned,
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
