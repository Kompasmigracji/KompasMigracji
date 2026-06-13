const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: 'db.uxbgrzmggeujgmryfohl.supabase.co',
    port: 5432,
    user: 'postgres',
    password: 'Khrysto2107aA@!',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query("UPDATE leads SET contact = '@' || username WHERE username IS NOT NULL");
    console.log(`Updated ${res.rowCount} rows in leads`);
  } catch (err) {
    console.error("Error connecting to DB:", err);
  } finally {
    await client.end();
  }
}

main();
