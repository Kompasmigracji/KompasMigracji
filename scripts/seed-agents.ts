/**
 * Seed script — registers Primus + 10 functional agents in Supabase.
 *
 * Usage (from project root):
 *   npx tsx scripts/seed-agents.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !key) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

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

async function seed() {
  console.log('🌱 Seeding agents…');

  for (const agent of AGENTS) {
    const { data, error } = await supabase
      .from('agents')
      .upsert(agent, { onConflict: 'name' })
      .select()
      .single();

    if (error) {
      console.error(`  ❌ ${agent.name}: ${error.message}`);
    } else {
      console.log(`  ✅ ${agent.name} (${data.id})`);
    }
  }

  // Seed default God policy
  const { error: policyErr } = await supabase
    .from('god_policies')
    .upsert(
      {
        policy_name: 'default',
        policy_json: {
          owner: 'Grand Architect Oleksandr Khrysytodul',
          email: 'iphoenixgsm@gmail.com',
          heartbeat_timeout_ms: 120000,
          auto_restart: true,
          motivation_enabled: true,
        },
        enabled: true,
      },
      { onConflict: 'policy_name' }
    );

  if (policyErr) {
    console.error(`  ❌ God policy: ${policyErr.message}`);
  } else {
    console.log('  ✅ God default policy');
  }

  console.log('🎉 Done!');
}

seed();
