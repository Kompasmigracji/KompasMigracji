import { supabase } from './agents';
import type { GodAgent, GodCommand } from '../types/god';
import type { Agent } from '../types/agents';

/** Load God agent (singleton) */
export async function getGodAgent(): Promise<GodAgent | null> {
  const { data, error } = await supabase
    .from('god_policies')
    .select('policy_json')
    .limit(1)
    .single();
  if (error) {
    console.error('Failed to load God policies', error);
    return null;
  }
  // For simplicity we embed name & id statically – can be stored in a separate table later
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

  // Example: forward any command to Primus (agent with role 'primus')
  const { data: primusAgents, error } = await supabase
    .from('agents')
    .select('id')
    .eq('role', 'primus')
    .single();
  if (error || !primusAgents) {
    console.error('No Primus agent found', error);
    return false;
  }

  // Dispatch as a task to Primus
  const { error: taskErr } = await supabase.from('agent_tasks').insert({
    agent_id: primusAgents.id,
    type: command.command,
    payload: command.payload || {},
  });
  if (taskErr) {
    console.error('Failed to dispatch God command to Primus', taskErr);
    return false;
  }
  return true;
}
