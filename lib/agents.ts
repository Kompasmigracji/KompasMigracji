import { getSupabase } from './supabase';
import type { Agent, AgentTask } from '../types/agents';

function getDb() {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');
  return sb;
}

type TaskEffect = { status: 'completed' | 'failed'; result: any };

/**
 * Perform the actual, bounded, synchronous effect for a dispatched task type.
 *
 * This is what makes `dispatchTask` real instead of only writing an inert
 * `agent_tasks` row that nothing ever reads (see prior audit of the
 * God/Primus system). Every task type dispatchable from the admin UI
 * (`restart`, `motivate` from AgentCard; `scale` from GodCard via
 * evaluateAndCommandGod) must be handled here explicitly and honestly —
 * no fabricated LLM calls or code execution, no fabricated schema concepts.
 */
async function applyTaskEffect(
  db: ReturnType<typeof getDb>,
  agentId: string,
  type: string,
  payload: any
): Promise<TaskEffect> {
  const nowIso = new Date().toISOString();

  switch (type) {
    case 'restart': {
      // Reset the agent back to its healthy state: idle status + fresh heartbeat.
      const { error } = await db
        .from('agents')
        .update({ status: 'idle', last_heartbeat: nowIso })
        .eq('id', agentId);
      if (error) {
        console.error('Restart effect failed', error);
        return { status: 'failed', result: { error: error.message } };
      }
      return {
        status: 'completed',
        result: { effect: 'restart', newStatus: 'idle', restartedAt: nowIso },
      };
    }

    case 'motivate': {
      // Cosmetic encouragement ping — no code/LLM execution performed. We still
      // record a real, visible state change: bump the heartbeat (already shown
      // on the AgentCard) and persist the message on the task result so it is a
      // real, inspectable log entry rather than nothing.
      const message =
        (payload && typeof payload.message === 'string' && payload.message) ||
        'Keep up the great work!';
      const { error } = await db
        .from('agents')
        .update({ last_heartbeat: nowIso })
        .eq('id', agentId);
      if (error) {
        console.error('Motivate effect failed', error);
        return { status: 'failed', result: { error: error.message } };
      }
      return {
        status: 'completed',
        result: { effect: 'motivate', message, pingedAt: nowIso },
      };
    }

    case 'scale': {
      // The `agents` table (supabase/agents_schema.sql) has no
      // capacity/concurrency/instance-count column — there is nothing to
      // actually scale in this environment. Rather than fabricate that
      // concept, log the request and report back honestly.
      const factor = payload && payload.factor;
      return {
        status: 'completed',
        result: {
          effect: 'scale',
          acknowledged: true,
          appliedChange: false,
          note:
            'The agents schema has no capacity/concurrency field, so no compute capacity was actually changed. Request logged only.',
          requestedFactor: typeof factor === 'number' ? factor : null,
        },
      };
    }

    default: {
      return {
        status: 'completed',
        result: { effect: 'noop', note: `No automated effect is defined for task type "${type}".` },
      };
    }
  }
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

/**
 * Dispatch a task to an agent and execute it synchronously.
 *
 * Writes the `agent_tasks` row for history/audit, then performs the actual
 * bounded effect for the task type (see `applyTaskEffect`), then marks the
 * row `completed`/`failed` immediately — tasks are no longer left `queued`
 * forever waiting for a processor that doesn't exist in production.
 */
export async function dispatchTask(agentId: string, type: string, payload: any = {}): Promise<AgentTask | null> {
  const db = getDb();
  const nowIso = new Date().toISOString();

  const { data, error } = await db
    .from('agent_tasks')
    .insert({ agent_id: agentId, type, payload, status: 'running', started_at: nowIso })
    .select()
    .single();
  if (error) {
    console.error('Dispatch task error', error);
    return null;
  }
  const task = data as AgentTask;

  const effect = await applyTaskEffect(db, agentId, type, payload);

  const { data: updated, error: updateError } = await db
    .from('agent_tasks')
    .update({ status: effect.status, result: effect.result, finished_at: new Date().toISOString() })
    .eq('id', task.id)
    .select()
    .single();
  if (updateError) {
    console.error('Failed to finalize task', updateError);
    // Best effort: the effect already ran, so report it even though
    // persisting the final row state failed.
    return { ...task, status: effect.status, result: effect.result } as AgentTask;
  }
  return updated as AgentTask;
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
