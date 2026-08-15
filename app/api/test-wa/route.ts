export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { notifyAdmin } from "@/lib/telegram";

export async function GET() {
  try {
    const paymentText = `💳 <b>Нова оплата! (ТЕСТ)</b>
Замовлення: <b>#999999</b>
👤 Клієнт: Тестовий Клієнт
📞 Телефон: +48 729 000 000
📝 Послуга: Тестова консультація
💰 Сума: 149.00 PLN
🔑 Session: test_session_12345`;

    const leadText = `🚨 <b>Новий лід у CRM (Роботодавець, Web)! (ТЕСТ)</b>
Назва компанії: ТОВ Тест
Потрібні фахівці: Зварювальники (5 чол)
Контактна особа: Олександр Тест
Email: test@example.com
WhatsApp: +48 729 000 000
Деталі: Шукаємо людей на завод з понеділка.`;

    const res1 = await notifyAdmin(paymentText);
    const res2 = await notifyAdmin(leadText);
    
    return NextResponse.json({ success: true, message: "Test Payment and Lead messages sent via Telegram", detail: { res1, res2 } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
