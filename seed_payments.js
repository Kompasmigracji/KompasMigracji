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
    // Drop existing if any, and create a custom payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS custom_payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        type VARCHAR(50),
        type_label VARCHAR(100),
        description TEXT,
        manager VARCHAR(100),
        amount NUMERIC,
        currency VARCHAR(10),
        status VARCHAR(50)
      );
    `);
    console.log("Created custom_payments table");

    await client.query(`
      INSERT INTO custom_payments (type, type_label, description, manager, amount, currency, status)
      VALUES
        ('income', 'Оплаты', 'Банковский перевод PL: Чат з Alena Holovina', 'Анна Новікова', 500.00, 'PLN', 'cancelled'),
        ('expense', 'Затраты', 'Бонус сотруднику: Чат 2', 'Анна Новікова', -50.00, 'PLN', 'paid'),
        ('income', 'Оплаты', 'Банковская карта UA: Чат з Vasyl Babiy', 'Олександр Воронцов', 220.00, 'PLN', 'paid')
    `);
    console.log("Seeded custom_payments");

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

main();
