const { Client } = require('pg');
const client = new Client({
  host: 'db.uxbgrzmggeujgmryfohl.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'Khrysto2107aA@!',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  console.log("Connected to DB");

  try {
    // Drop existing if any, and create custom tables for Chats demo
    await client.query(`
      CREATE TABLE IF NOT EXISTS custom_chats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100),
        source VARCHAR(50),
        source_icon VARCHAR(50),
        source_color VARCHAR(20),
        last_message TEXT,
        time VARCHAR(20),
        unread INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'open',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS custom_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        chat_id UUID REFERENCES custom_chats(id) ON DELETE CASCADE,
        text TEXT,
        time VARCHAR(20),
        sender VARCHAR(20),
        is_seen BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("Created custom_chats and custom_messages tables");

    const chat1Res = await client.query(`
      INSERT INTO custom_chats (name, source, source_icon, source_color, last_message, time, unread, status)
      VALUES ('Олександр Рей', 'viber', 'phone', '#a855f7', 'Дякую', '16:21', 0, 'open')
      RETURNING id;
    `);
    const chat1Id = chat1Res.rows[0].id;

    await client.query(`
      INSERT INTO custom_messages (chat_id, text, time, sender, is_seen)
      VALUES 
        ($1, 'Добрий день! Цікавить карта побиту.', '15:20', 'client', true),
        ($1, E'Доброго дня, Олександре! Для подачі на карту побиту нам потрібні такі документи:\\n- Паспорт (всі сторінки)\\n- Договір оренди\\n- Підтвердження доходу', '15:25', 'manager', true),
        ($1, 'Зрозумів. А якщо я працюю через агенцію?', '15:30', 'client', true),
        ($1, 'Тоді потрібна умова з агенцією та Załącznik nr 1. Бажаєте записатись на детальну консультацію?', '15:45', 'manager', true),
        ($1, 'Так, давайте на завтра.', '16:00', 'client', true),
        ($1, 'Записав вас на 14:00. До зв''язку!', '16:05', 'manager', true),
        ($1, 'Дякую', '16:21', 'client', false)
    `, [chat1Id]);

    await client.query(`
      INSERT INTO custom_chats (name, source, source_icon, source_color, last_message, time, unread, status)
      VALUES 
        ('Valentyn D', 'telegram', 'send', '#3b82f6', 'Телеграм', '12:18', 1, 'open'),
        ('Інна', 'viber', 'phone', '#a855f7', 'Скільки коштуватиме довідка?', '20:06', 0, 'open')
    `);

    console.log("Seeded chats");

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

main();
