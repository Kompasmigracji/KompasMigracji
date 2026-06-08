import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function cleanEnv(s: string | undefined): string {
  let r = s || '';
  while (r.length > 0 && r.charCodeAt(0) === 65279) r = r.slice(1);
  return r.split(String.fromCharCode(13)).join('').trim();
}

const host = cleanEnv(process.env.PGHOST);
const port = Number(cleanEnv(process.env.PGPORT)) || 5432;
const user = cleanEnv(process.env.PGUSER) || 'postgres';
const password = cleanEnv(process.env.PGPASSWORD);
const database = cleanEnv(process.env.PGDATABASE) || 'postgres';

const client = new Client({
  host,
  port,
  user,
  password,
  database,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log('🔌 Connecting to Postgres...');
  await client.connect();
  console.log('✅ Connected.');

  const sqlPath = path.resolve(process.cwd(), 'supabase/crm_extensions.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('🚀 Applying schema from supabase/crm_extensions.sql...');
  await client.query(sql);
  console.log('✅ CRM Extensions Schema applied successfully!');

  await client.end();
}

main().catch(err => {
  console.error('❌ Error applying CRM extensions schema:', err);
  process.exit(1);
});
