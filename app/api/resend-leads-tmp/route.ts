export const dynamic = 'force-dynamic';
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { notifyAdmin } from '@/lib/telegram';

export async function GET(req: NextRequest) {
  try {
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '15', 10);
    
    // Витягуємо останні ліди
    const rows = await q(`SELECT * FROM kompas_leads ORDER BY created_at DESC LIMIT $1`, [limit]) as any[];
    
    let sentCount = 0;
    // Відправляємо від найстарішого до найновішого з обраної вибірки
    const reversedRows = [...rows].reverse();

    for (const lead of reversedRows) {
      const text = `📬 <b>Відновлений Лід з Бази</b>\n` +
                   `👤 Ім'я: ${lead.name || '—'}\n` +
                   (lead.contact ? `📞 Контакт: ${lead.contact}\n` : '') +
                   (lead.email ? `📧 Email: ${lead.email}\n` : '') +
                   (lead.message ? `📝 Деталі: ${lead.message.substring(0, 500)}\n` : '') +
                   `Джерело: ${lead.source || '—'}\n` +
                   `Створено: ${new Date(lead.created_at).toLocaleString('uk-UA')}`;
                   
      await notifyAdmin(text);
      sentCount++;
      // Затримка 1.5 сек щоб не потрапити в бан від Telegram
      await new Promise(r => setTimeout(r, 1500));
    }
    
    return NextResponse.json({ success: true, count: sentCount, message: `Resent ${sentCount} leads to Telegram` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
