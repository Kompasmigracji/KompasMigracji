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
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
  `);
  console.log('TABLES:', res.rows.map(r => r.table_name));
  await client.end();
}

main();
