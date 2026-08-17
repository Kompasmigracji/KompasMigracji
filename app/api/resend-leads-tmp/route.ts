export const dynamic = 'force-dynamic';
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { notifyAdmin } from '@/lib/telegram';

export async function GET(req: NextRequest) {
  try {
    const leadsRows = await q(`
      SELECT *
      FROM leads
      WHERE paid_at IS NOT NULL
      ORDER BY paid_at DESC
      LIMIT 10
    `) as any[];

    // Шукаємо оплату в 149 PLN
    let targetLead = leadsRows.find(l => {
       return (l.service && l.service.includes('149')) || (l.situation && l.situation.includes('149'));
    });
    
    if (!targetLead) {
        targetLead = leadsRows[0]; // Беремо останній
    }

    if (!targetLead) {
      return NextResponse.json({ success: false, message: "Не знайдено оплачених лідів" });
    }

    const text = `📬 <b>Деталі знайденої оплати</b>\n` +
                 `🔑 Session ID: <code>${targetLead.session_id}</code>\n` +
                 `👤 Ім'я: ${targetLead.first_name || '—'}\n` +
                 (targetLead.contact ? `📞 Контакт: ${targetLead.contact}\n` : '') +
                 (targetLead.email ? `📧 Email: ${targetLead.email}\n` : '') +
                 (targetLead.service ? `🏷 Сервіс: ${targetLead.service}\n` : '') +
                 (targetLead.situation ? `📝 Деталі: ${targetLead.situation.substring(0, 500)}\n` : '') +
                 `Час: ${new Date(targetLead.paid_at).toLocaleString('uk-UA')}`;

    await notifyAdmin(text);

    return NextResponse.json({ success: true, message: "Відправлено в Telegram!", lead: targetLead });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack });
  }
}
