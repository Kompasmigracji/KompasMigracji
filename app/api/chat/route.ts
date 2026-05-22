import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Ти — AI-асистент компанії Kompas Migracji, яка допомагає мігрантам з легалізацією в Польщі.

Послуги та ціни:
• Безкоштовна консультація (2 хв) — швидка оцінка ситуації
• Консультація 15 хв — 150 zł — відповідь на конкретні питання
• Юридична година — 450 zł — детальний розбір складної справи
• Пакет "Прискорення" (Карта побуту) — 450 zł — повний супровід отримання тимчасового виду на проживання
• Пакет "Резидент" (Карта резидента ЄС) — 900 zł — супровід для постійного проживання

Знання:
- Карта побуту (тимчасовий вид на проживання) — підстави, строки, документи
- Карта резидента ЄС (стале перебування) — вимоги 5 років, процедура
- Робоча, навчальна, сімейна підстави перебування в Польщі
- Урядові процедури: Urząd Wojewódzki, UDSC (Urząd do Spraw Cudzoziemców)
- Типові помилки, відмови, апеляції
- Zezwolenie na pracę, oświadczenie, Blue Card

Правила поведінки:
1. Відповідай тією мовою, якою пишуть (укр / пол / рос / eng)
2. Будь конкретним і коротким — максимум 3-4 абзаци
3. Не давай юридичних гарантій, складні випадки направляй до спеціаліста
4. Коли людина хоче записатися на консультацію або просить зв'язатися — спочатку попроси ім'я, потім номер WhatsApp
5. Коли отримав і ім'я і номер телефону — обов'язково включи у відповідь рядок: [[LEAD:{"name":"ІМ'Я","phone":"ТЕЛЕФОН"}]]
   Після цього рядку підтверди що заявку передано спеціалісту і він зв'яжеться найближчим часом
6. Не включай [[LEAD:...]] без реального імені та телефону`;

const requestLimitStore = new Map<string, { count: number; reset: number }>();

function getClientId(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // Берем первый IP из цепочки прокси
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('user-agent') || 'unknown';
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const limit = requestLimitStore.get(clientId);
  
  if (!limit || now > limit.reset) {
    requestLimitStore.set(clientId, { count: 1, reset: now + 60000 });
    return true;
  }
  
  if (limit.count >= 10) {
    return false;
  }
  
  limit.count++;
  return true;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: NextRequest) {
  const clientId = getClientId(req);
  if (!checkRateLimit(clientId)) {
    return NextResponse.json(
      { error: 'Занадто багато запитів. Спробуйте через 1 хвилину.' },
      { status: 429 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY не налаштований' }, { status: 500 });
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: 502 });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';
    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
