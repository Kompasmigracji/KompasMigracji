import { getSupabase } from './supabase';
import { dispatchTask } from './agents';
import type { GodAgent, GodCommand } from '../types/god';
import type { AgentTask } from '../types/agents';

function getDb() {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');
  return sb;
}

/** Load God agent (singleton) */
export async function getGodAgent(): Promise<GodAgent | null> {
  const { data, error } = await getDb()
    .from('god_policies')
    .select('policy_json')
    .limit(1)
    .single();
  if (error) {
    console.error('Failed to load God policies', error);
    return null;
  }
  return {
    id: 'god-singleton',
    name: 'Grand Architect Oleksandr Khrysytodul',
    policies: data?.policy_json || {},
    createdAt: new Date().toISOString(),
  } as GodAgent;
}

/**
 * Evaluate a God command and forward it to Primus (agent with role 'primus').
 *
 * Dispatches through `dispatchTask`, which now executes the task's bounded
 * effect synchronously (e.g. 'scale') and marks it completed/failed
 * immediately, instead of only writing an inert `agent_tasks` row.
 * Returns the resulting task (or null on failure) so callers/routes can
 * report the real outcome back to the UI.
 */
export async function evaluateAndCommandGod(command: GodCommand): Promise<AgentTask | null> {
  const god = await getGodAgent();
  if (!god) return null;

  const db = getDb();

  // Forward any command to Primus (agent with role 'primus')
  const { data: primusAgent, error } = await db
    .from('agents')
    .select('id')
    .eq('role', 'primus')
    .single();
  if (error || !primusAgent) {
    console.error('No Primus agent found', error);
    return null;
  }

  return dispatchTask(primusAgent.id, command.command, command.payload || {});
}
