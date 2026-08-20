export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { notifyAdmin } from '@/lib/telegram';

export async function GET() {
  try {
    const infoText = `🌐 <b>Інформація про Клієнтський Портал (Client Portal)</b>

<b>Що це таке:</b>
Це особистий кабінет клієнта, де він може в будь-який час перевірити статус своєї справи без необхідності писати менеджеру.

<b>Як це працює:</b>
1. Щойно клієнт успішно оплачує послугу (через Przelewy24 або Stripe), система автоматично створює для нього сесію.
2. Клієнт отримує у Telegram або на Email повідомлення з посиланням та <b>6-значним PIN-кодом</b> (наприклад, <code>3F9A2C</code>).
3. Клієнт заходить на сторінку <code>https://www.kompasmigracji.com/portal</code>, вводить PIN і бачить свою справу.

<b>Що бачить клієнт всередині:</b>
- Поточний статус (наприклад: "Документи в роботі", "Подано до ужонду" тощо).
- Назву послуги.
- Нотатки або вказівки від менеджера.

<b>Що потрібно робити менеджеру:</b>
Нічого генерувати вручну не потрібно! Доступ видається <b>автоматично</b> під час оплати. Вам залишається лише оновлювати статуси справ у самій CRM, і клієнт одразу бачитиме ці зміни у своєму порталі.`;

    await notifyAdmin(infoText);
    
    return NextResponse.json({ success: true, message: "Portal info sent to Telegram" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
