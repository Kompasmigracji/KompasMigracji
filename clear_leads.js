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
    console.log("Connected to DB");
    
    // Clear leads table
    const res = await client.query('DELETE FROM leads');
    console.log(`Deleted ${res.rowCount} rows from leads`);
    
    // Clear kompas_leads table if it exists
    try {
      const res2 = await client.query('DELETE FROM kompas_leads');
      console.log(`Deleted ${res2.rowCount} rows from kompas_leads`);
    } catch (e) {
      console.log("kompas_leads not found or error:", e.message);
    }
  } catch (err) {
    console.error("Error connecting to DB:", err);
  } finally {
    await client.end();
  }
}

main();
