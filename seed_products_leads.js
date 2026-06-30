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
    // 1. Seed Products
    const pRes = await client.query(`
      INSERT INTO products (id, name, category, price, qty_in_stock)
      VALUES
        (gen_random_uuid(), 'Автомобіль', 'Транспорт', 15000.00, 2),
        (gen_random_uuid(), 'Консультація з ВНЖ', 'Послуги', 150.00, 999),
        (gen_random_uuid(), 'Допомога з документами', 'Послуги', 50.00, 999)
      ON CONFLICT DO NOTHING;
    `);
    console.log("Products seeded.");

    // 2. Seed Leads
    const lRes = await client.query(`
      INSERT INTO leads (id, title, name, phone, source, funnel_step)
      VALUES
        (gen_random_uuid(), 'Чат з Антоном', 'Антон Павлюченко', '+380501112233', 'Приватний вайбер', 'Новий'),
        (gen_random_uuid(), 'Чат з Марією', 'Марія Коваль', '+380671112233', 'Telegram', 'Кваліфікація'),
        (gen_random_uuid(), 'Заявка з сайту', 'Олексій', 'alex@example.com', 'Сайт', 'Переговори')
      ON CONFLICT DO NOTHING;
    `);
    console.log("Leads seeded.");

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

main();
