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
    // 1. Create Buyers
    const bRes = await client.query(`
      INSERT INTO buyers (id, full_name, email, phone) 
      VALUES 
        (gen_random_uuid(), 'Alena Holovina', 'alena@example.com', '+380501234567'),
        (gen_random_uuid(), 'Artur', 'roman@protonmail.com', '+380630113262'),
        (gen_random_uuid(), 'Yurii', 'yurii@proton.me', '+48500200300')
      RETURNING id;
    `);
    
    console.log(`Inserted ${bRes.rowCount} buyers`);
    
    const buyerIds = bRes.rows.map(r => r.id);

    // 2. Create Orders
    const oRes = await client.query(`
      INSERT INTO orders (id, order_number, buyer_id, status, payment_status, total_price)
      VALUES
        (gen_random_uuid(), 'ORD-001', $1, 'Новый', 'Не оплачен', 150.00),
        (gen_random_uuid(), 'ORD-002', $2, 'Выполняется', 'Оплачен', 320.50),
        (gen_random_uuid(), 'ORD-003', $2, 'Новый', 'Частично оплачен', 50.00),
        (gen_random_uuid(), 'ORD-004', $3, 'Завершен', 'Оплачен', 1000.00)
    `, [buyerIds[0], buyerIds[1], buyerIds[2]]);

    console.log(`Inserted ${oRes.rowCount} orders`);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

main();
