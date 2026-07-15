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
  const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'kompas_audit_log'");
  console.log('AUDIT LOG:', res.rows);
  await client.end();
}

main();
