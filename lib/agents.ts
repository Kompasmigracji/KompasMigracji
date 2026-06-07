import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Agent, AgentTask } from '../types/agents';

// Supabase client – reads env variables (should be set in .env)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

/** Register a new agent */
export async function registerAgent(name: string, role: string): Promise<Agent | null> {
  const { data, error } = await supabase.from('agents').insert({ name, role }).single();
  if (error) {
    console.error('Failed to register agent', error);
    return null;
  }
  return data as Agent;
}

/** Update agent heartbeat */
export async function heartbeat(agentId: string): Promise<boolean> {
  const { error } = await supabase
    .from('agents')
    .update({ last_heartbeat: new Date().toISOString() })
    .eq('id', agentId);
  return !error;
}

/** Dispatch a task to an agent */
export async function dispatchTask(agentId: string, type: string, payload: any = {}): Promise<AgentTask | null> {
  const { data, error } = await supabase
    .from('agent_tasks')
    .insert({ agent_id: agentId, type, payload })
    .single();
  if (error) {
    console.error('Dispatch task error', error);
    return null;
  }
  return data as AgentTask;
}

/** Get health overview of all agents */
export async function getAllAgents(): Promise<Agent[]> {
  const { data, error } = await supabase.from('agents').select('*');
  if (error) {
    console.error('Fetch agents error', error);
    return [];
  }
  return data as Agent[];
}

/** Update agent status */
export async function setAgentStatus(agentId: string, status: 'idle' | 'busy' | 'error'): Promise<boolean> {
  const { error } = await supabase
    .from('agents')
    .update({ status })
    .eq('id', agentId);
  return !error;
}
