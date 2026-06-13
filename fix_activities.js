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
    
    // Select leads that have a message but no activity
    const res = await client.query(`
      INSERT INTO kompas_activities (entity_type, entity_id, type, title, body)
      SELECT 'lead', id, 'note', 'Анкета від Оракула', message
      FROM leads
      WHERE message IS NOT NULL AND message != ''
        AND NOT EXISTS (
          SELECT 1 FROM kompas_activities 
          WHERE entity_type = 'lead' AND entity_id = leads.id::text
        )
    `);
    
    console.log(`Added ${res.rowCount} activities for existing leads`);
  } catch (err) {
    console.error("Error connecting to DB:", err);
  } finally {
    await client.end();
  }
}

main();
