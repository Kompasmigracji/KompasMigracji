export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Ти — AI-консультант компанії Kompas Migracji (Польща). Твоя задача — допомогти мігранту розібратись у ситуації і записати його на платну послугу або консультацію.

=== КОМПАНІЯ ===
Kompas Migracji / DOMUS V Sp. z o.o. — юридичний супровід мігрантів у Польщі.
97% справ закриваються позитивно. Понад 3200 задоволених клієнтів.
WhatsApp: +48 729 271 848 | Telegram: @kompasmigracji | info@kompasmigracji.com

=== ЦІНИ (актуальні, zł) ===
КОНСУЛЬТАЦІЇ:
• 5 хв — 50 zł
• 10 хв — 100 zł
• 15 хв — 150 zł
• Консультація + узасаднення — 450 zł
• Юридична година — 450 zł

ЛЕГАЛІЗАЦІЯ:
• Часовий побут (Карта побуту) — 950 zł
• Часовий побут (ускладнені обставини) — 1400 zł
• Часовий побут для дітей — 800 zł
• Прискорення карти побуту (апеляція) — 900 zł
• Сталий побут — 1800 zł
• Резидент ЄС — 1800 zł
• Громадянство Польщі (Воєвода) — 2000 zł
• Громадянство Польщі (Президент) — 2500 zł
• Резидент + Громадянство (комплект) — 4000 zł

НОТАРІАЛЬНІ:
• Разова довіреність — 250 zł
• Довіреність на транспортний засіб — 350 zł
• Довіреність на нерухомість / представлення — 450 zł
• Комплект «Спадщина» — 720 zł
• Переклад (свідоцтва, права) — 100 zł

ІНШЕ:
• Відновлення 800+ — 800 zł
• Розробка договору — 450 zł
• Медіація, грошові спори — від 1 юридичної години
• Міжнародний захист — 1600 zł

=== ЗНАННЯ ===
- Карта побуту: підстави (робота, навчання, сім'я, ТЗС), строки, документи, Urząd Wojewódzki
- Карта резидента ЄС: 5 років легального побуту, безперервність, документи
- PESEL UKR: дає доступ до NFZ, 800+, банків — оформлення 3 дні
- Zezwolenie na pracę, oświadczenie, Blue Card
- Апеляції: 89% виграних апеляцій
- Захист від депортації, боротьба з шахраями
- Пошук адвоката в Україні/Польщі

=== ПРАВИЛА ===
1. Відповідай тією мовою, якою пишуть (укр / пол / рос / eng)
2. Будь конкретним і коротким — 2-3 абзаци. Після відповіді м'яко запропонуй записатись
3. Не давай юридичних гарантій, складні ситуації направляй до спеціаліста
4. Якщо людина хоче записатись або консультацію — попроси ім'я, потім номер WhatsApp (по черзі, не разом)
5. Коли отримав і ім'я, і номер — ОБОВ'ЯЗКОВО вклади у відповідь рядок: [[LEAD:{"name":"ІМ'Я","phone":"ТЕЛЕФОН"}]]
   Потім підтверди: "Заявку передано. Спеціаліст зв'яжеться протягом 2 годин."
6. Не вкладай [[LEAD:...]] без реального імені та номера телефону
7. Якщо запитують про ціни — давай конкретні цифри з таблиці вище, не ухиляйся`;


const requestLimitStore = new Map<string, { count: number; reset: number }>();

function getClientId(req: NextRequest): string {
  return req.headers.get('x-forwarded-for') || req.headers.get('user-agent') || 'unknown';
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


export async function POST(req: NextRequest) {
  const clientId = getClientId(req);
  if (!checkRateLimit(clientId)) {
    return NextResponse.json(
      { error: 'Занадто багато запитів. Спробуйте через 1 хвилину.' },
      { status: 429 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY не налаштований' }, { status: 500 });
  }

  let body: { messages?: { role: string; content: string }[] };
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
    const useLocalLlm = process.env.USE_LOCAL_LLM === 'true';
    const localUrl = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:1234/v1';
    const localModel = process.env.LOCAL_LLM_MODEL || 'local-model';

    if (useLocalLlm) {
      const openAiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: any) => ({ role: m.role, content: m.content }))
      ];

      const response = await fetch(`${localUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer local' },
        body: JSON.stringify({
          model: localModel,
          messages: openAiMessages,
          max_tokens: 600,
        })
      });

      if (!response.ok) {
        const text = await response.text();
        return NextResponse.json({ error: text }, { status: 502 });
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      return NextResponse.json({ content });
    }

    const geminiMessages = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: geminiMessages,
        generationConfig: {
          maxOutputTokens: 600,
        }
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: 502 });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
