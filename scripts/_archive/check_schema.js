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
  const res1 = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'buyers'");
  console.log('BUYERS:', res1.rows);
  const res2 = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders'");
  console.log('ORDERS:', res2.rows);
  await client.end();
}

main();
