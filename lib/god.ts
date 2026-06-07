import { getSupabase } from './supabase';
import type { GodAgent, GodCommand } from '../types/god';

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

/** Evaluate health of all agents and decide if scaling or restart needed */
export async function evaluateAndCommandGod(command: GodCommand): Promise<boolean> {
  const god = await getGodAgent();
  if (!god) return false;

  const db = getDb();

  // Forward any command to Primus (agent with role 'primus')
  const { data: primusAgent, error } = await db
    .from('agents')
    .select('id')
    .eq('role', 'primus')
    .single();
  if (error || !primusAgent) {
    console.error('No Primus agent found', error);
    return false;
  }

  // Dispatch as a task to Primus
  const { error: taskErr } = await db.from('agent_tasks').insert({
    agent_id: primusAgent.id,
    type: command.command,
    payload: command.payload || {},
  });
  if (taskErr) {
    console.error('Failed to dispatch God command to Primus', taskErr);
    return false;
  }
  return true;
}
