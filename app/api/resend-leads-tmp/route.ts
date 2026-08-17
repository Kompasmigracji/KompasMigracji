export const dynamic = 'force-dynamic';
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { notifyAdmin } from '@/lib/telegram';

export async function GET(req: NextRequest) {
  try {
    // Спочатку перевіримо таблицю leads на наявність оплат
    const leadsRows = await q(`
      SELECT l.*, p.amount as payment_amount, p.status as payment_status, p.order_number
      FROM leads l
      LEFT JOIN kompas_payments p ON l.session_id = p.session_id
      WHERE l.paid_at IS NOT NULL OR p.amount = 14900
      ORDER BY l.paid_at DESC NULLS LAST, p.created_at DESC NULLS LAST
      LIMIT 10
    `) as any[];

    // Шукаємо оплату в 149 PLN
    let targetLead = leadsRows.find(l => {
       const amt = parseInt(l.payment_amount);
       return amt === 14900 || amt === 149;
    });
    
    if (!targetLead) {
        targetLead = leadsRows[0]; // Беремо останній
    }

    if (!targetLead) {
      // Можливо, це була просто пряма оплата без ліда? 
      const paymentsOnly = await q(`SELECT * FROM kompas_payments ORDER BY created_at DESC LIMIT 5`) as any[];
      return NextResponse.json({ success: false, message: "Не знайдено оплачених лідів, ось останні транзакції", transactions: paymentsOnly });
    }

    const text = `📬 <b>Деталі знайденої оплати</b>\n` +
                 (targetLead.order_number ? `💳 Замовлення: <b>${targetLead.order_number}</b>\n` : '') +
                 (targetLead.payment_amount ? `💰 Сума: ${parseInt(targetLead.payment_amount)/100} PLN\n` : '') +
                 `🔑 Session ID: <code>${targetLead.session_id}</code>\n` +
                 `👤 Ім'я: ${targetLead.first_name || '—'}\n` +
                 (targetLead.contact ? `📞 Контакт: ${targetLead.contact}\n` : '') +
                 (targetLead.email ? `📧 Email: ${targetLead.email}\n` : '') +
                 (targetLead.service ? `🏷 Сервіс: ${targetLead.service}\n` : '') +
                 (targetLead.situation ? `📝 Деталі: ${targetLead.situation.substring(0, 500)}\n` : '') +
                 `Час: ${new Date(targetLead.paid_at || targetLead.created_at).toLocaleString('uk-UA')}`;

    await notifyAdmin(text);

    return NextResponse.json({ success: true, message: "Відправлено в Telegram!", lead: targetLead });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack });
  }
}
