import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

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

const AGENTS = [
  { name: 'Primus', role: 'primus' },
  { name: 'UI/UX Polisher', role: 'ui_ux' },
  { name: 'Performance Optimizer', role: 'performance' },
  { name: 'SEO Strategist', role: 'seo' },
  { name: 'AI Chatbot Engineer', role: 'ai_chatbot' },
  { name: 'Lead-Automation Bot', role: 'lead_automation' },
  { name: 'Payments Integrator', role: 'payments' },
  { name: 'DevOps CI/CD Agent', role: 'devops' },
  { name: 'Security Guardian', role: 'security' },
  { name: 'Documentation Curator', role: 'docs' },
  { name: 'Analytics Observer', role: 'analytics' },
];

async function main() {
  console.log('🔌 Connecting to Postgres...');
  await client.connect();
  console.log('✅ Connected.');

  console.log('📦 Altering agents table to add UNIQUE constraint on name...');
  await client.query(`
    ALTER TABLE agents ADD CONSTRAINT agents_name_key UNIQUE (name);
  `).catch(err => {
    if (err.code === '42P16' || err.message.includes('already exists')) {
      console.log('ℹ️ UNIQUE constraint on agents(name) already exists.');
    } else {
      throw err;
    }
  });

  console.log('🌱 Seeding agents directly via Postgres pool...');
  for (const agent of AGENTS) {
    const res = await client.query(`
      INSERT INTO agents (name, role, status)
      VALUES ($1, $2, 'idle')
      ON CONFLICT (name) DO UPDATE SET role = EXCLUDED.role
      RETURNING id, name, role;
    `, [agent.name, agent.role]);
    console.log(`  ✅ ${res.rows[0].name} (${res.rows[0].id})`);
  }

  console.log('🌱 Seeding default God policy...');
  await client.query(`
    INSERT INTO god_policies (policy_name, policy_json, enabled)
    VALUES ('default', $1, true)
    ON CONFLICT (policy_name) DO UPDATE SET policy_json = EXCLUDED.policy_json, enabled = EXCLUDED.enabled;
  `, [JSON.stringify({
    owner: 'Grand Architect Oleksandr Khrysytodul',
    email: 'iphoenixgsm@gmail.com',
    heartbeat_timeout_ms: 120000,
    auto_restart: true,
    motivation_enabled: true,
  })]);
  console.log('  ✅ God default policy');

  console.log('🎉 Done!');
  await client.end();
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
