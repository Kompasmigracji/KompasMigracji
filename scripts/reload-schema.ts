import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  const client = new Client({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase via Postgres!');
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('Reloaded schema');
  } catch (error) {
    console.error('Error reloading schema:', error);
  } finally {
    await client.end();
  }
}

run();
