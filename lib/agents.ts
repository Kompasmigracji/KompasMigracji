import { getSupabase } from './supabase';
import type { Agent, AgentTask } from '../types/agents';

function getDb() {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');
  return sb;
}

/** Register a new agent */
export async function registerAgent(name: string, role: string): Promise<Agent | null> {
  const { data, error } = await getDb().from('agents').insert({ name, role }).select().single();
  if (error) {
    console.error('Failed to register agent', error);
    return null;
  }
  return data as Agent;
}

/** Update agent heartbeat */
export async function heartbeat(agentId: string): Promise<boolean> {
  const { error } = await getDb()
    .from('agents')
    .update({ last_heartbeat: new Date().toISOString() })
    .eq('id', agentId);
  return !error;
}

/** Dispatch a task to an agent */
export async function dispatchTask(agentId: string, type: string, payload: any = {}): Promise<AgentTask | null> {
  const { data, error } = await getDb()
    .from('agent_tasks')
    .insert({ agent_id: agentId, type, payload })
    .select()
    .single();
  if (error) {
    console.error('Dispatch task error', error);
    return null;
  }
  return data as AgentTask;
}

/** Get health overview of all agents */
export async function getAllAgents(): Promise<Agent[]> {
  const { data, error } = await getDb().from('agents').select('*');
  if (error) {
    console.error('Fetch agents error', error);
    return [];
  }
  return data as Agent[];
}

/** Update agent status */
export async function setAgentStatus(agentId: string, status: 'idle' | 'busy' | 'error'): Promise<boolean> {
  const { error } = await getDb()
    .from('agents')
    .update({ status })
    .eq('id', agentId);
  return !error;
}
