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

// Mock simulation behaviors for each agent role
const AGENT_BEHAVIORS: Record<string, (payload: any) => Promise<any>> = {
  primus: async (payload) => {
    console.log('👑 [Primus] Coordinating active agents, checking system metrics, and preparing agent squad updates...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { status: 'success', active_agents: 10, msg: 'Orchestration cycle completed cleanly.' };
  },
  ui_ux: async (payload) => {
    console.log('🎨 [UI/UX Polisher] Scanning pages for glassmorphism, alignment, responsive spacing, and dark mode variables...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { status: 'success', optimized_pages: ['/admin/agents', '/portal'], styles_applied: 'glassmorphism-hover-cards' };
  },
  performance: async (payload) => {
    console.log('⚡ [Performance Optimizer] Bundling assets, checking next build cache, analyzing page weight...');
    await new Promise(resolve => setTimeout(resolve, 2500));
    return { status: 'success', bundle_savings_kb: 145, compression: 'brotli-enabled' };
  },
  seo: async (payload) => {
    console.log('🔍 [SEO Strategist] Validating multilingual meta tags, heading structures, and schema JSON-LD...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { status: 'success', locales_verified: ['uk', 'pl', 'en', 'ru'], score: 98 };
  },
  ai_chatbot: async (payload) => {
    console.log('🤖 [AI Chatbot Engineer] Refining prompt templates and vector index parameters for Orakul chat...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { status: 'success', response_latency_ms: 120, precision: 0.96 };
  },
  lead_automation: async (payload) => {
    console.log('📈 [Lead-Automation Bot] Processing pipeline triggers, moving old trash leads to archive...');
    await new Promise(resolve => setTimeout(resolve, 2500));
    return { status: 'success', leads_archived: 18, automation_checks: 'passed' };
  },
  payments: async (payload) => {
    console.log('💳 [Payments Integrator] Verifying Przelewy24 callback webhooks and transaction signatures...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { status: 'success', callback_integrity: 'valid', ssl_level: 'strong' };
  },
  devops: async (payload) => {
    console.log('🛠️ [DevOps Agent] Checking GitHub action logs and validating vercel.json serverless functions...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { status: 'success', ci_pipeline: 'healthy', deploy_check: 'passed' };
  },
  security: async (payload) => {
    console.log('🛡️ [Security Guardian] Reviewing JWT token validation, cookie policies, and RLS tables...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { status: 'success', rls_policies: 'enforced', vulnerable_endpoints: 0 };
  },
  docs: async (payload) => {
    console.log('📝 [Documentation Curator] Parsing codebase structure to generate updated release logs...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { status: 'success', updated_files: ['README.md'], version: 'v1.0-orchestrator' };
  },
  analytics: async (payload) => {
    console.log('📊 [Analytics Observer] Reading Vercel analytics metrics and user speed insights data...');
    await new Promise(resolve => setTimeout(resolve, 2500));
    return { status: 'success', page_load_avg_ms: 280, error_rate: 0.0 };
  },
};

async function processNextTask() {
  // Find a task in 'queued' or 'running' status
  const { rows: tasks } = await client.query(`
    SELECT t.id, t.agent_id, t.type, t.payload, t.status, a.name, a.role
    FROM agent_tasks t
    JOIN agents a ON t.agent_id = a.id
    WHERE t.status IN ('queued', 'running')
    LIMIT 1
  `);

  if (tasks.length === 0) {
    return false;
  }

  const task = tasks[0];
  console.log(`\n──────────────────────────────────────────────────────────────────────`);
  console.log(`🚀 [Task Dispatcher] Picked up task ${task.id} for agent: ${task.name} (${task.role})`);

  // Update status to running if queued
  if (task.status === 'queued') {
    await client.query("UPDATE agent_tasks SET status = 'running', started_at = NOW() WHERE id = $1", [task.id]);
  }

  // Update agent heartbeat and status to busy
  await client.query("UPDATE agents SET status = 'busy', last_heartbeat = NOW() WHERE id = $1", [task.agent_id]);

  try {
    const behavior = AGENT_BEHAVIORS[task.role];
    let result = {};
    if (behavior) {
      result = await behavior(task.payload);
    } else {
      console.log(`⚠️ No simulated behavior for role: ${task.role}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = { status: 'warning', msg: 'Generic task executed.' };
    }

    // Complete task
    await client.query(`
      UPDATE agent_tasks
      SET status = 'finished', result = $1, finished_at = NOW()
      WHERE id = $2
    `, [JSON.stringify(result), task.id]);

    // Set agent to idle and update heartbeat
    await client.query("UPDATE agents SET status = 'idle', last_heartbeat = NOW() WHERE id = $1", [task.agent_id]);
    console.log(`✅ [Task Dispatcher] Task ${task.id} completed successfully by ${task.name}!`);

  } catch (error: any) {
    console.error(`❌ [Task Dispatcher] Task ${task.id} failed with error:`, error.message);
    await client.query(`
      UPDATE agent_tasks
      SET status = 'failed', result = $1, finished_at = NOW()
      WHERE id = $2
    `, [JSON.stringify({ error: error.message }), task.id]);
    await client.query("UPDATE agents SET status = 'error', last_heartbeat = NOW() WHERE id = $1", [task.agent_id]);
  }

  return true;
}

async function runMonitorCycle() {
  console.log('\n🔍 [Monitor Squad] Running periodic agent heartbeat scan...');
  const { rows: agents } = await client.query('SELECT id, name, role, last_heartbeat, status FROM agents');
  const now = new Date();
  
  let staleCount = 0;
  for (const agent of agents) {
    if (!agent.last_heartbeat) continue;
    const diff = now.getTime() - new Date(agent.last_heartbeat).getTime();
    
    // If agent is not idle and hasn't updated heartbeat in over 2 minutes (we simulate fast timeouts for local demo)
    if (agent.status === 'busy' && diff > 120 * 1000) {
      console.log(`⚠️ [Monitor Squad] Agent ${agent.name} is stale (heartbeat age: ${Math.round(diff / 1000)}s). Resetting...`);
      await client.query("UPDATE agents SET status = 'error', last_heartbeat = NOW() WHERE id = $1", [agent.id]);
      await client.query(`
        UPDATE agent_tasks 
        SET status = 'failed', result = '{"error": "heartbeat timeout"}' 
        WHERE agent_id = $1 AND status = 'running'
      `, [agent.id]);
      staleCount++;
    }
  }
  
  if (staleCount === 0) {
    console.log('✅ [Monitor Squad] All agents healthy and active.');
  }
}

async function main() {
  console.log('🔌 Connecting to database...');
  await client.connect();
  console.log('✅ Connected.');

  console.log('👑 [Primus Engine] Active and listening for tasks. Press Ctrl+C to stop.');

  let monitorTimer = 0;

  while (true) {
    const worked = await processNextTask();
    if (!worked) {
      // If no tasks, wait a bit
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    monitorTimer += 2000;
    if (monitorTimer >= 10000) {
      await runMonitorCycle();
      monitorTimer = 0;
    }
  }
}

main().catch(err => {
  console.error('❌ Daemon Error:', err);
  process.exit(1);
});
