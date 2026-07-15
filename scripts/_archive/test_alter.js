const { Client } = require('pg');
const client = new Client({ host: 'db.uxbgrzmggeujgmryfohl.supabase.co', port: 5432, user: 'postgres', password: 'Khrysto2107aA@!', database: 'postgres', ssl: { rejectUnauthorized: false } });
client.connect()
.then(() => client.query("ALTER TABLE leads ADD COLUMN IF NOT EXISTS funnel_step TEXT"))
.then(res => { console.log('success:', res); client.end(); })
.catch(err => { console.error('Error adding column:', err); client.end(); });
