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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY не налаштований' });

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: text });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';
    return res.json({ content });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
