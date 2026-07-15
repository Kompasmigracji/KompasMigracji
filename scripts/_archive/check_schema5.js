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
  const res1 = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'kompas_chat_history'");
  console.log('kompas_chat_history:', res1.rows);
  const res2 = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'message_templates'");
  console.log('message_templates:', res2.rows);
  await client.end();
}

main();
