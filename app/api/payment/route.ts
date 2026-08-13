export const dynamic = "force-dynamic";
/* /api/payment — публічний ендпоінт для P24-оплати з сайту (pricing, karta тощо).
   Мок-режим (redirect на /payment/mock/...) використовується ЛИШЕ поза
   продакшеном (локальна розробка) або коли явно задано P24_SANDBOX=mock —
   інакше, якщо жоден провайдер не спрацював, повертаємо чесну помилку.
   Раніше в проді мовчки підміняли реальний чекаут фейковим, через що
   клієнт міг подумати, що оплатив, хоча гроші нікуди не пішли.
   При реєстрації платежу створює лід у БД (щоб mock-confirm міг його оновити). */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { q, one } from '@/lib/db';
import { createTaskFromLead } from '@/lib/task-from-lead';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { getServicePrice } from '@/lib/pricing-catalog';

/* Суми приходять з клієнта в грошах (integer). Межі відсікають NaN, від'ємні
   та абсурдні значення до того, як вони підуть у P24/PayU/Stripe; максимум
   у каталозі послуг зараз 400 000 грошів (4 000 zł), стеля з запасом. */
const MIN_AMOUNT_GROSZE = 100;        // 1 zł
const MAX_AMOUNT_GROSZE = 2_000_000;  // 20 000 zł

function mockModeAllowed(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.P24_SANDBOX === 'mock';
}

/** Зберігає лід у БД з session_id щоб payment-mock-confirm міг його знайти.
    Дзеркалить лід у kompas_leads (як /api/lead та /api/admin/leads) і
    зберігає bigint id назад у leads.kompas_lead_id — щоб вебхуки оплати
    могли оновити статус у CRM-воронці за ключем, а не співпадінням email. */
async function createLeadForPayment(opts: {
  sessionId: string;
  description: string;
  email: string;
  source: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}): Promise<void> {
  try {
    const { sessionId, description, email, source, firstName, lastName, phone } = opts;
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || null;
    /* contact = телефон (відображається в колонці "Контакт" CRM)
       situation = опис + email (відображається в колонці "Повідомлення" CRM) */
    const situation = `${description}\n📧 ${email}`;
    const leadRow = (await one(
      `INSERT INTO leads (first_name, contact, situation, source, session_id, email, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new')
       RETURNING id`,
      [fullName, phone || null, situation, source, sessionId, email || null],
    )) as { id: string } | null;

    const kompasLeadRow = (await one(
      `INSERT INTO kompas_leads (source, name, contact, email, message, status)
       VALUES ($1, $2, $3, $4, $5, 'new')
       RETURNING id`,
      [source, fullName, phone || null, email || null, description],
    )) as { id: number } | null;

    if (leadRow?.id && kompasLeadRow?.id) {
      await q(`UPDATE leads SET kompas_lead_id = $1 WHERE id = $2`, [kompasLeadRow.id, leadRow.id]);
    }

    await createTaskFromLead({ name: fullName, contact: phone, source, situation: description });
  } catch (err) {
    // Не блокуємо платіж якщо запис ліда не вдався
    console.error('payment/route: failed to create lead', err);
  }
}

export async function POST(req: NextRequest) {
  let body: { amount?: unknown; serviceId?: unknown; description?: unknown; email?: unknown; lang?: unknown; source?: unknown; firstName?: unknown; lastName?: unknown; phone?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { serviceId, description, email, lang, source, firstName, lastName, phone } = body;

  if (!serviceId || !description || !email) {
    return NextResponse.json({ error: 'Відсутні обов\'язкові параметри' }, { status: 400 });
  }

  /* Кожен POST створює лід у CRM — без ліміту це відкритий канал спаму в базу. */
  const rl = rateLimit(clientIp(req), { ns: 'payment', max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Забагато спроб оплати. Зачекайте, будь ласка, хвилину і спробуйте ще раз.' },
      { status: 429 },
    );
  }

  /* Сума береться ВИКЛЮЧНО з серверного каталогу за serviceId, а не з тіла
     запиту — інакше клієнт міг би підмінити amount і оплатити будь-яку
     послугу за 1 zł, залишивши в описі назву дорогої послуги. */
  const amountNum = getServicePrice(String(serviceId));
  if (amountNum === null) {
    return NextResponse.json({ error: 'Невідома послуга' }, { status: 400 });
  }
  if (body.amount !== undefined && Number(body.amount) !== amountNum) {
    console.warn('payment/route: client amount mismatch (ignored, using catalog price)', {
      serviceId, clientAmount: body.amount, catalogAmount: amountNum,
    });
  }
  if (!Number.isInteger(amountNum) || amountNum < MIN_AMOUNT_GROSZE || amountNum > MAX_AMOUNT_GROSZE) {
    return NextResponse.json({ error: 'Некоректна сума платежу' }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(String(email)) || String(email).length > 254) {
    return NextResponse.json({ error: 'Некоректна email-адреса' }, { status: 400 });
  }
  if (String(description).length > 300) {
    return NextResponse.json({ error: 'Занадто довгий опис платежу' }, { status: 400 });
  }

  const leadSource = String(source || 'pricing');
  const sessionId  = `km-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const siteUrl    = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.kompasmigracji.com').replace(/\/$/, '');

  
  /* ── Payment Provider Strategy ───────────────────────────────────────── */
  try {
    const { isP24Configured } = await import('@/lib/przelewy24');
    const { isPayUConfigured } = await import('@/lib/payu');
    const { stripe } = await import('@/lib/stripe');

    let adapter: any = null;

    if (isP24Configured()) {
      const { przelewy24Adapter } = await import('@/lib/payments/adapters/przelewy24');
      adapter = przelewy24Adapter;
    } else if (isPayUConfigured()) {
      const { payuAdapter } = await import('@/lib/payments/adapters/payu');
      adapter = payuAdapter;
    } else if (stripe) {
      const { stripeAdapter } = await import('@/lib/payments/adapters/stripe');
      adapter = stripeAdapter;
    }

    if (adapter) {
      await createLeadForPayment({
        sessionId,
        description: String(description),
        email:       String(email),
        source:      leadSource,
        firstName:   firstName ? String(firstName) : undefined,
        lastName:    lastName  ? String(lastName)  : undefined,
        phone:       phone     ? String(phone)     : undefined,
      });

      const redirectUrl = await adapter.registerTransaction({
        sessionId,
        amount: amountNum,
        description: String(description),
        email: String(email),
        language: lang ? String(lang) : undefined,
        firstName: firstName ? String(firstName) : undefined,
        lastName: lastName ? String(lastName) : undefined,
        phone: phone ? String(phone) : undefined,
        source: leadSource,
      });

      return NextResponse.json({ redirectUrl });
    }
  } catch (err) {
    console.error('payment/route: provider adapter error, falling back to mock:', err);
  }

  /* ── 4. Жоден провайдер не спрацював ───────────────────────────────── */
  if (mockModeAllowed()) {
    const mockSessionId = `km-${randomUUID()}`;
    let appUrl = siteUrl;
    if (appUrl && !appUrl.startsWith('http://') && !appUrl.startsWith('https://')) {
      appUrl = `https://${appUrl}`;
    }

    await createLeadForPayment({
      sessionId:   mockSessionId,
      description: String(description),
      email:       String(email),
      source:      leadSource,
      firstName:   firstName ? String(firstName) : undefined,
      lastName:    lastName  ? String(lastName)  : undefined,
      phone:       phone     ? String(phone)     : undefined,
    });

    const qs = new URLSearchParams({
      amount: String(amountNum),
      desc:   String(description),
      cur:    'PLN',
    }).toString();
    return NextResponse.json({ redirectUrl: `${appUrl}/payment/mock/${mockSessionId}?${qs}` });
  }

  /* Продакшен без робочого провайдера: чесна помилка замість фейкового
     чекауту. Лід все одно зберігаємо — це реальний зацікавлений клієнт,
     менеджер зв'яже з ним вручну навіть якщо автоматична оплата недоступна. */
  await createLeadForPayment({
    sessionId,
    description: String(description),
    email:       String(email),
    source:      leadSource,
    firstName:   firstName ? String(firstName) : undefined,
    lastName:    lastName  ? String(lastName)  : undefined,
    phone:       phone     ? String(phone)     : undefined,
  });

  console.error('payment/route: no payment provider available for session', sessionId);
  return NextResponse.json(
    {
      error:
        'Оплата тимчасово недоступна. Ми вже отримали вашу заявку — менеджер зв\'яжеться з вами найближчим часом, щоб оформити оплату іншим способом.',
    },
    { status: 502 },
  );
}
