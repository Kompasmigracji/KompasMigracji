import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

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

const CRM_TASKS: Record<string, { type: string; payload: any }> = {
  ui_ux: {
    type: 'polish_ui',
    payload: { target: 'rodo_consent_dashboard', layout: 'glassmorphism' },
  },
  security: {
    type: 'audit_security',
    payload: { target: 'api_admin_rodo_endpoint', check_rls: true },
  },
  docs: {
    type: 'document_codebase',
    payload: { target: 'crm_extensions_documentation', update_diagram: true },
  },
  payments: {
    type: 'verify_payment_routes',
    payload: { target: 'przelewy24_p24_webhook', mock_invoice_api: true },
  },
  ai_chatbot: {
    type: 'tune_llm',
    payload: { target: 'orakul_bilingual_split_prompt', enforce_no_language_mixing: true },
  },
  primus: {
    type: 'orchestrate',
    payload: { action: 'coordinate_agents', check_interval_ms: 10000 },
  },
  performance: {
    type: 'optimize_performance',
    payload: { target: 'crm_analytics_queries' },
  },
  seo: {
    type: 'audit_seo',
    payload: { target: 'plans_multilingual_indexing' },
  },
  lead_automation: {
    type: 'clean_leads',
    payload: { target: 'crm_auto_handoff_trigger' },
  },
  devops: {
    type: 'ci_cd_audit',
    payload: { target: 'crm_api_endpoints_vercel' },
  },
  analytics: {
    type: 'observe_analytics',
    payload: { target: 'crm_conversion_dashboard' },
  },
};

async function main() {
  console.log('🔌 Connecting to Postgres...');
  await client.connect();
  console.log('✅ Connected.');

  console.log('🔍 Fetching agents...');
  const { rows: agents } = await client.query('SELECT id, name, role FROM agents');
  console.log(`📋 Found ${agents.length} agents.`);

  console.log('🚀 Assigning CRM tasks to all agents...');
  for (const agent of agents) {
    const taskConfig = CRM_TASKS[agent.role];
    if (!taskConfig) {
      console.log(`⚠️ No CRM task configuration for role: ${agent.role}`);
      continue;
    }

    // Update agent status to busy
    await client.query("UPDATE agents SET status = 'busy', last_heartbeat = NOW() WHERE id = $1", [agent.id]);

    const { rows: insertedTasks } = await client.query(`
      INSERT INTO agent_tasks (agent_id, type, payload, status, started_at)
      VALUES ($1, $2, $3, 'running', NOW())
      RETURNING id, type;
    `, [agent.id, taskConfig.type, JSON.stringify(taskConfig.payload)]);

    console.log(`  ✅ Assigned "${taskConfig.type}" to ${agent.name} (Task ID: ${insertedTasks[0].id}, Status: RUNNING)`);
  }

  console.log('🎉 New CRM tasks assigned successfully!');
  await client.end();
}

main().catch(err => {
  console.error('❌ Error assigning CRM tasks:', err);
  process.exit(1);
});
