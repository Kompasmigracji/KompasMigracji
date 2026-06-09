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
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('❌ Please specify the path to the migration SQL file.');
    process.exit(1);
  }

  const migrationFile = args[0];
  const sqlPath = path.isAbsolute(migrationFile)
    ? migrationFile
    : path.resolve(process.cwd(), migrationFile);

  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ Migration file not found: ${sqlPath}`);
    process.exit(1);
  }

  console.log(`🔌 Connecting to Postgres (${host}/${database})...`);
  await client.connect();
  console.log('✅ Connected.');

  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log(`🚀 Applying SQL from ${path.basename(sqlPath)}...`);
  
  await client.query(sql);
  console.log('✅ Migration executed successfully!');

  await client.end();
}

main().catch(err => {
  console.error('❌ Error executing migration:', err);
  process.exit(1);
});
