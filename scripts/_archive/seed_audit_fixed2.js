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
    const uRes = await client.query('SELECT id FROM kompas_users LIMIT 1');
    let userId = 1;
    if (uRes.rowCount > 0) {
      userId = uRes.rows[0].id;
    } else {
      // Create user
      const insRes = await client.query(`
        INSERT INTO kompas_users (id, full_name, email, role, password_hash) 
        VALUES (999, 'System Admin', 'admin@iphoenix.com', 'admin', 'dummy_hash')
        ON CONFLICT (id) DO UPDATE SET full_name = 'System Admin'
        RETURNING id;
      `);
      userId = insRes.rows[0].id;
    }

    const meta1 = JSON.stringify([
      { label: "Название", from: "(пусто)", to: "Чат з 380673442306" },
      { label: "Источник", from: "(пусто)", to: "Приватний вайбер" },
      { label: "Статус", from: "(пусто)", to: "Новий", isPill: true, pillColor: "#ef4444" }
    ]);
    
    const meta2 = JSON.stringify([
      { label: "ФИО", from: "(пусто)", to: "380673442306" },
      { label: "Телефон", from: "(пусто)", to: "+380673442306" }
    ]);

    await client.query(`
      INSERT INTO kompas_audit_log (id, user_id, action, entity, entity_id, meta, created_at)
      VALUES
        (1001, $1, 'создал(-а) карточку', 'lead', 'L-001', $2, NOW() - INTERVAL '1 hour'),
        (1002, $1, 'создал(-а) контактную информацию', 'contact', 'C-001', $3, NOW() - INTERVAL '55 minutes')
      ON CONFLICT DO NOTHING;
    `, [userId, meta1, meta2]);

    console.log("Audit log seeded with User ID: " + userId);

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

main();
