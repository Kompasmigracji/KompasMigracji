export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/* /api/payu/notify — PayU IPN webhook
   PayU надсилає POST після кожної зміни статусу замовлення.
   Docs: https://developers.payu.com/europe/docs/online-payments/notifications/
*/
import { NextRequest, NextResponse } from 'next/server';
import { verifyPayUSignature } from '@/lib/payu';
import { one, q } from '@/lib/db';
import { sendMessage } from '@/lib/telegram';
import { sendWhatsApp } from '@/lib/whatsapp';

const ADMIN_WA_PHONE = '48729417050';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get('OpenPayu-Signature') ?? req.headers.get('openpayu-signature');

  if (!verifyPayUSignature(rawBody, sigHeader)) {
    console.error('PayU notify: invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let data: any;
  try { data = JSON.parse(rawBody); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const order  = data?.order;
  const status = order?.status;  // COMPLETED | PENDING | WAITING_FOR_CONFIRMATION | CANCELED

  if (status !== 'COMPLETED') {
    // Просто підтверджуємо отримання, але не обробляємо
    return NextResponse.json({ status: 'ok' });
  }

  const sessionId = order?.extOrderId;
  const amount    = order?.totalAmount;   // в грошах (grosze)
  const currency  = order?.currencyCode ?? 'PLN';
  const orderId   = order?.orderId;

  // Знайти лід за session_id
  type LeadRow = { id: string; chat_id: number | null; first_name: string | null; service: string | null; contact: string | null; situation: string | null };
  let lead: LeadRow | null = null;
  try {
    lead = (await one(
      `SELECT id, chat_id, first_name, service, contact, situation
         FROM leads
        WHERE session_id = $1 AND deleted_at IS NULL
        LIMIT 1`,
      [sessionId],
    )) as LeadRow | null;
  } catch (err) {
    console.warn('payu/notify: session_id column issue', err);
  }

  if (lead) {
    // Оновити статус ліда
    await q(
      `UPDATE leads SET paid_at = now(), status = 'closed' WHERE id = $1`,
      [lead.id],
    );

    // Сповістити клієнта в Telegram
    if (lead.chat_id) {
      try {
        await sendMessage(
          lead.chat_id,
          `✅ <b>Оплату підтверджено!</b>\n\nДякуємо за довіру. Ваш менеджер зв'яжеться з вами найближчим часом.`,
        );
      } catch { /* ігноруємо */ }
    }

    // Сповістити адмін-чат
    const amountFormatted = ((Number(amount) || 0) / 100).toFixed(2);
    const adminChat = process.env.ADMIN_TELEGRAM_CHAT_ID ?? process.env.TELEGRAM_ADMIN_CHAT_ID;

    const tgText =
      `💳 <b>Оплата через PayU!</b>\n` +
      `👤 ${lead.first_name ?? '—'}\n` +
      (lead.contact   ? `📞 ${lead.contact}\n`                  : '') +
      (lead.situation ? `📝 ${lead.situation.split('\n')[0]}\n` : '') +
      `💰 ${amountFormatted} ${currency}\n` +
      `🔑 Order: <code>${orderId}</code>`;

    if (adminChat) {
      try { await sendMessage(adminChat, tgText); } catch { /* */ }
    }
    try {
      await sendWhatsApp(ADMIN_WA_PHONE, tgText.replace(/<[^>]+>/g, ''));
    } catch { /* */ }
  }

  return NextResponse.json({ status: 'ok' });
}
