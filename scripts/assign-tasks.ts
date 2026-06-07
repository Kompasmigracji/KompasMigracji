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

const TASKS: Record<string, { type: string; payload: any }> = {
  primus: {
    type: 'orchestrate',
    payload: { action: 'coordinate_agents', check_interval_ms: 10000 },
  },
  ui_ux: {
    type: 'polish_ui',
    payload: { target: 'admin_dashboard', glassmorphism: true },
  },
  performance: {
    type: 'optimize_performance',
    payload: { target: 'static_generation', optimize_images: true },
  },
  seo: {
    type: 'audit_seo',
    payload: { multilingual: true, target_locales: ['uk', 'pl', 'en', 'ru'] },
  },
  ai_chatbot: {
    type: 'tune_llm',
    payload: { target: 'orakul_chat', prompt_version: 'v2.1' },
  },
  lead_automation: {
    type: 'clean_leads',
    payload: { purge_trash: true, age_days: 30 },
  },
  payments: {
    type: 'verify_payment_routes',
    payload: { gateways: ['przelewy24'], env: 'production' },
  },
  devops: {
    type: 'ci_cd_audit',
    payload: { target: 'github_actions_ci', check_vercel_status: true },
  },
  security: {
    type: 'audit_security',
    payload: { target: 'jwt_auth_middleware', rls: true },
  },
  docs: {
    type: 'document_codebase',
    payload: { format: 'markdown', update_readme: true },
  },
  analytics: {
    type: 'observe_analytics',
    payload: { providers: ['vercel_analytics', 'speed_insights'] },
  },
};

async function main() {
  console.log('🔌 Connecting to Postgres...');
  await client.connect();
  console.log('✅ Connected.');

  console.log('🔍 Fetching seeded agents...');
  const { rows: agents } = await client.query('SELECT id, name, role FROM agents');
  console.log(`📋 Found ${agents.length} agents.`);

  console.log('🚀 Assigning tasks to all agents...');
  for (const agent of agents) {
    const taskConfig = TASKS[agent.role];
    if (!taskConfig) {
      console.log(`⚠️ No task configuration for role: ${agent.role}`);
      continue;
    }

    // Set agent status to busy when task is assigned
    await client.query("UPDATE agents SET status = 'busy', last_heartbeat = NOW() WHERE id = $1", [agent.id]);

    const { rows: insertedTasks } = await client.query(`
      INSERT INTO agent_tasks (agent_id, type, payload, status, started_at)
      VALUES ($1, $2, $3, 'running', NOW())
      RETURNING id, type;
    `, [agent.id, taskConfig.type, JSON.stringify(taskConfig.payload)]);

    console.log(`  ✅ Assigned "${taskConfig.type}" to ${agent.name} (Task ID: ${insertedTasks[0].id}, Status: RUNNING)`);
  }

  console.log('🎉 All tasks assigned and agents are actively working!');
  await client.end();
}

main().catch(err => {
  console.error('❌ Error assigning tasks:', err);
  process.exit(1);
});
