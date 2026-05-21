// Kompas Migracji — Telegram Lead Bot
// Env vars required: TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_ID,
//                   NEXT_PUBLIC_SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_KEY (preferred) or VITE_SUPABASE_ANON_KEY

import { createClient } from '@supabase/supabase-js';

const TOKEN    = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_ID = process.env.TELEGRAM_ADMIN_ID;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
// Prefer a server/service key for server-side operations; fall back to anon key if not present
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = process.env.SITE_URL || 'https://kompasmigracji.com';

const TG_API = `https://api.telegram.org/bot${TOKEN}`;
const sb = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY) : null;

// ─── Telegram ────────────────────────────────────────────────────────────────

async function tg(method, body) {
  const r = await fetch(`${TG_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

function ik(...rows) {
  return { inline_keyboard: rows };
}

function btn(text, data) {
  return { text, callback_data: data };
}

// ─── Supabase ────────────────────────────────────────────────────────────────

async function dbGet(table, column, value) {
  if (!sb) return null;
  try {
    const { data, error } = await sb.from(table).select('*').eq(column, value).limit(1).single();
    if (error) {
      console.error(`dbGet ${table} error:`, error);
      if (error.details) console.error('Supabase error details:', error.details);
      return null;
    }
    return data || null;
  } catch (e) {
    console.error(`dbGet ${table} exception:`, e);
    return null;
  }
}

async function dbUpsert(table, row) {
  if (!sb) return;
  try {
    const { data, error } = await sb.from(table).upsert(row, { onConflict: 'chat_id' });
    if (error) {
      console.error(`dbUpsert ${table} error:`, error);
      if (error.details) console.error('Supabase error details:', error.details);
    }
    return data;
  } catch (e) {
    console.error(`dbUpsert ${table} exception:`, e);
  }
}

async function dbInsert(table, row) {
  if (!sb) return;
  try {
    const { data, error } = await sb.from(table).insert(row);
    if (error) {
      console.error(`dbInsert ${table} error:`, error);
      if (error.details) console.error('Supabase error details:', error.details);
    }
    return data;
  } catch (e) {
    console.error(`dbInsert ${table} exception:`, e);
  }
}

// ─── Session ─────────────────────────────────────────────────────────────────

async function getSession(chatId) {
  const s = await dbGet('bot_sessions', 'chat_id', chatId);
  return s || { step: 0, data: {} };
}

async function setSession(chatId, step, data) {
  await dbUpsert('bot_sessions', {
    chat_id: chatId,
    step,
    data,
    updated_at: new Date().toISOString(),
  });
}

// ─── Copy content ─────────────────────────────────────────────────────────────

const COUNTRIES = [
  '🇵🇱 Польща',
  '🇩🇪 Німеччина',
  '🇨🇿 Чехія',
  '🇫🇷 Франція',
  '🇪🇸 Іспанія',
  '🇮🇹 Італія',
  '🇵🇹 Португалія',
  '🌍 Інша / Не визначився',
];

const SERVICES = [
  'Карта побиту / ВНЖ',
  'Громадянство',
  'NIE / PESEL',
  'Бізнес-релокація',
  "Возз'єднання сім'ї",
  'Виза / запрошення',
  'Інше — поясню далі',
];

const URGENCY = [
  '🔥 Горить — треба вже',
  '📅 1–3 місяці',
  '🗓 Готуюсь на майбутнє',
  '🤔 Поки прицінююсь',
];

// ─── Message senders ─────────────────────────────────────────────────────────

async function sendWelcome(chatId, firstName) {
  await tg('sendMessage', {
    chat_id: chatId,
    text:
      `👋 Вітаю${firstName ? `, *${esc(firstName)}*` : ''}\\! Я бот сервісу *Kompas Migracji*\\.

За 2 хвилини розберемось у твоїй ситуації — і Олександр зв'яжеться з конкретною пропозицією, як легально вирішити твоє питання в ЄС\\.

⚡ Якщо терміново — пиши одразу, я передам у руки\\.`,
    parse_mode: 'MarkdownV2',
    reply_markup: ik(
      [btn('🚀 Починаємо', 'start_flow')],
      [btn('💬 У мене є питання', 'has_question')],
    ),
  });
}

async function sendStep1(chatId) {
  const rows = [];
  for (let i = 0; i < COUNTRIES.length; i += 2) {
    rows.push(COUNTRIES.slice(i, i + 2).map(c => btn(c, `c:${c}`)));
  }
  await tg('sendMessage', {
    chat_id: chatId,
    text: '🌍 *Крок 1/5* — Яка країна ЄС тебе цікавить?',
    parse_mode: 'Markdown',
    reply_markup: ik(...rows),
  });
}

async function sendStep2(chatId) {
  await tg('sendMessage', {
    chat_id: chatId,
    text: '📋 *Крок 2/5* — Що саме треба вирішити?',
    parse_mode: 'Markdown',
    reply_markup: ik(...SERVICES.map(s => [btn(s, `s:${s}`)])),
  });
}

async function sendStep3(chatId) {
  await tg('sendMessage', {
    chat_id: chatId,
    text: '⏱ *Крок 3/5* — Наскільки терміново?',
    parse_mode: 'Markdown',
    reply_markup: ik(...URGENCY.map(u => [btn(u, `u:${u}`)])),
  });
}

async function sendStep4(chatId) {
  await tg('sendMessage', {
    chat_id: chatId,
    text:
      '💬 *Крок 4/5* — Розкажи коротко про свою ситуацію\\.\n\n' +
      '_Наприклад: "Виза закінчується через місяць, працюю в IT, є дружина і дитина в Україні" або "Маю відмову у карті побиту, треба апеляція"\\._\n\n' +
      'Пиши як другу — Олександр прочитає сам\\.',
    parse_mode: 'MarkdownV2',
  });
}

async function sendStep5(chatId) {
  await tg('sendMessage', {
    chat_id: chatId,
    text: '📞 *Крок 5/5* — Як з тобою зв\'язатись?\n\nМожеш поділитись номером одним тапом або написати email / інший контакт.',
    parse_mode: 'Markdown',
    reply_markup: {
      keyboard: [[{ text: '📱 Поділитися номером', request_contact: true }]],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
}

async function sendConfirmation(chatId, d) {
  const sit = d.situation || '';
  await tg('sendMessage', {
    chat_id: chatId,
    text:
      `✅ Дякую${d.first_name ? `, *${esc(d.first_name)}*` : ''}\\! Ось як я тебе зрозумів:\n\n` +
      `🌍 *Країна:* ${esc(d.country)}\n` +
      `📋 *Послуга:* ${esc(d.service)}\n` +
      `⏱ *Терміновість:* ${esc(d.urgency)}\n` +
      `💬 *Ситуація:* ${esc(sit.slice(0, 200))}${sit.length > 200 ? '\\.\\.\\.' : ''}\n` +
      `📞 *Контакт:* ${esc(d.contact)}\n\n` +
      `Олександр зв'яжеться протягом 4 годин \\(9:00–21:00 за Гданським часом\\)\\.`,
    parse_mode: 'MarkdownV2',
    reply_markup: ik(
      [btn('✅ Все правильно', 'confirm')],
      [btn('✏️ Виправити', 'fix')],
    ),
  });
}

async function sendFixMenu(chatId) {
  await tg('sendMessage', {
    chat_id: chatId,
    text: '✏️ Що виправити?',
    reply_markup: ik(
      [btn('🌍 Країна', 'goto:1'), btn('📋 Послуга', 'goto:2')],
      [btn('⏱ Терміновість', 'goto:3'), btn('💬 Ситуацію', 'goto:4')],
      [btn('📞 Контакт', 'goto:5')],
    ),
  });
}

async function sendDone(chatId) {
  await tg('sendMessage', {
    chat_id: chatId,
    text:
      `🤝 *До зв'язку\\!*\n\n` +
      `Можеш писати сюди у будь\\-який момент — все, що напишеш, я передам Олександру\\.\n\n` +
      `Поки чекаєш — глянь: 🔗 ${esc(SITE_URL)}`,
    parse_mode: 'MarkdownV2',
    reply_markup: { remove_keyboard: true },
  });
}

async function notifyAdmin(d, chatId) {
  const userRef = d.username ? `@${d.username}` : `tg://user?id=${chatId}`;
  const sit = d.situation || '';
  await tg('sendMessage', {
    chat_id: ADMIN_ID,
    text:
      `🆕 *НОВИЙ ЛІД*\n\n` +
      `👤 ${d.first_name || 'Невідомий'} \\([${esc(d.username ? '@' + d.username : 'відкрити')}](${esc(userRef)})\\)\n` +
      `🌍 ${esc(d.country)} • 📋 ${esc(d.service)}\n` +
      `⏱ ${esc(d.urgency)}\n` +
      `📞 ${esc(d.contact)}\n\n` +
      `💬 *Ситуація:*\n_"${esc(sit.slice(0, 500))}${sit.length > 500 ? '\\.\\.\\.' : ''}"_\n\n` +
      `[💬 Написати клієнту](tg://user?id=${chatId})`,
    parse_mode: 'MarkdownV2',
  });
}

async function saveLead(chatId, d) {
  await dbInsert('leads', {
    chat_id: String(chatId),
    first_name: d.first_name || null,
    username: d.username || null,
    country: d.country || null,
    service: d.service || null,
    urgency: d.urgency || null,
    situation: d.situation || null,
    contact: d.contact || null,
    status: 'new',
  });
}

// Escape MarkdownV2 special chars
function esc(str) {
  return String(str || '').replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

// Resend current step
async function dispatchStep(chatId, step, data) {
  if (step === 1) return sendStep1(chatId);
  if (step === 2) return sendStep2(chatId);
  if (step === 3) return sendStep3(chatId);
  if (step === 4) return sendStep4(chatId);
  if (step === 5) return sendStep5(chatId);
  if (step === 6) return sendConfirmation(chatId, data);
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('OK');

  try {
    await handleUpdate(req.body);
  } catch (e) {
    console.error('Bot error:', e);
  }
  return res.status(200).send('OK');
}

async function handleUpdate(update) {
  const msg = update.message;
  const cb  = update.callback_query;

  const chatId    = msg?.chat?.id ?? cb?.message?.chat?.id;
  const firstName = (msg?.from ?? cb?.from)?.first_name || '';
  const username  = (msg?.from ?? cb?.from)?.username  || '';
  const text      = msg?.text || '';
  const cbData    = cb?.data  || '';
  const contact   = msg?.contact || null;

  if (!chatId || !TOKEN) return;

  if (cb) await tg('answerCallbackQuery', { callback_query_id: cb.id });

  const session = await getSession(chatId);
  const step    = session.step;
  const data    = { ...session.data, first_name: firstName, username };

  // /start
  if (text === '/start') {
    if (step > 0 && step < 99) {
      await tg('sendMessage', {
        chat_id: chatId,
        text: '🔄 У тебе є незавершена розмова. Що робимо?',
        reply_markup: ik(
          [btn('▶️ Продовжити', 'continue')],
          [btn('🔄 Почати спочатку', 'restart')],
        ),
      });
    } else {
      await setSession(chatId, 0, data);
      await sendWelcome(chatId, firstName);
    }
    return;
  }

  // restart / continue
  if (cbData === 'restart') {
    await setSession(chatId, 0, data);
    return sendWelcome(chatId, firstName);
  }
  if (cbData === 'continue') {
    return dispatchStep(chatId, step, data);
  }

  // Початок воронки
  if (cbData === 'start_flow') {
    await setSession(chatId, 1, data);
    return sendStep1(chatId);
  }

  // "У мене є питання"
  if (cbData === 'has_question') {
    await setSession(chatId, -1, data);
    return tg('sendMessage', { chat_id: chatId, text: '💬 Пиши своє питання — передам Олександру одразу.' });
  }

  // Step -1: питання надіслано
  if (step === -1 && text) {
    await tg('forwardMessage', { chat_id: ADMIN_ID, from_chat_id: chatId, message_id: msg.message_id });
    await setSession(chatId, -2, data);
    return tg('sendMessage', {
      chat_id: chatId,
      text: 'Передав Олександру 👍\n\nПоки чекаєш — давай я зберу основне про твою ситуацію, щоб він одразу зайшов у курс?',
      reply_markup: ik(
        [btn('✅ Так, давай', 'start_flow'), btn('❌ Дякую, не треба', 'skip_flow')],
      ),
    });
  }

  if (cbData === 'skip_flow') {
    await setSession(chatId, 99, data);
    return tg('sendMessage', { chat_id: chatId, text: 'Окей! Якщо що — пиши сюди 👋' });
  }

  // Step 1: країна
  if (cbData.startsWith('c:') || (step === 1 && text)) {
    const country = cbData.startsWith('c:') ? cbData.slice(2) : text;
    const nd = { ...data, country };
    await setSession(chatId, 2, nd);
    return sendStep2(chatId);
  }

  // Step 2: послуга
  if (cbData.startsWith('s:') || (step === 2 && text)) {
    const service = cbData.startsWith('s:') ? cbData.slice(2) : text;
    const nd = { ...data, service };
    await setSession(chatId, 3, nd);
    return sendStep3(chatId);
  }

  // Step 3: терміновість
  if (cbData.startsWith('u:') || (step === 3 && text)) {
    const urgency = cbData.startsWith('u:') ? cbData.slice(2) : text;
    const nd = { ...data, urgency };
    await setSession(chatId, 4, nd);
    return sendStep4(chatId);
  }

  // Step 4: ситуація (free text)
  if (step === 4 && text) {
    if (text.length < 20) {
      return tg('sendMessage', {
        chat_id: chatId,
        text: '📝 Додай хоч пару деталей — це сильно економить нам обом час на дзвінку.',
      });
    }
    const nd = { ...data, situation: text.slice(0, 1000) };
    await setSession(chatId, 5, nd);
    return sendStep5(chatId);
  }

  // Step 5: контакт (телефон або текст)
  if (step === 5) {
    let contactStr = '';
    if (contact?.phone_number) contactStr = contact.phone_number;
    else if (text) contactStr = text;
    else return;
    const nd = { ...data, contact: contactStr };
    await setSession(chatId, 6, nd);
    return sendConfirmation(chatId, nd);
  }

  // Step 6: підтвердження
  if (step === 6) {
    if (cbData === 'confirm') {
      await setSession(chatId, 99, data);
      await saveLead(chatId, data);
      await notifyAdmin(data, chatId);
      return sendDone(chatId);
    }
    if (cbData === 'fix') return sendFixMenu(chatId);
    if (cbData.startsWith('goto:')) {
      const gotoStep = parseInt(cbData.split(':')[1], 10);
      await setSession(chatId, gotoStep, data);
      return dispatchStep(chatId, gotoStep, data);
    }
  }

  // Step 99: forward mode — все що пишуть іде до адміна
  if (step === 99 && msg) {
    await tg('forwardMessage', { chat_id: ADMIN_ID, from_chat_id: chatId, message_id: msg.message_id });
    return tg('sendMessage', { chat_id: chatId, text: '✉️ Передав Олександру.' });
  }
}
