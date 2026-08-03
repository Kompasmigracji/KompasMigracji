/**
 * Unit tests for lib/agents.ts
 *
 * Uses a lightweight mock of Supabase to verify function behaviour
 * without hitting a real database.
 */

// ── Mock Supabase ──────────────────────────────────────────────
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();

const chainMethods = () => ({
  select: mockSelect.mockReturnThis(),
  insert: mockInsert.mockReturnThis(),
  update: mockUpdate.mockReturnThis(),
  eq: mockEq.mockReturnThis(),
  single: mockSingle,
});

const mockFrom = jest.fn().mockReturnValue(chainMethods());

jest.mock('../supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}));

import {
  registerAgent,
  heartbeat,
  dispatchTask,
  getAllAgents,
  setAgentStatus,
} from '../agents';

// ── Helpers ────────────────────────────────────────────────────
beforeEach(() => {
  jest.clearAllMocks();
  // reset chain
  mockFrom.mockReturnValue(chainMethods());
});

// ── Tests ──────────────────────────────────────────────────────

describe('registerAgent', () => {
  it('returns the created agent on success', async () => {
    const fakeAgent = { id: '1', name: 'TestBot', role: 'test', status: 'idle' };
    mockSingle.mockResolvedValue({ data: fakeAgent, error: null });

    const result = await registerAgent('TestBot', 'test');
    expect(result).toEqual(fakeAgent);
    expect(mockFrom).toHaveBeenCalledWith('agents');
  });

  it('returns null on error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'fail' } });

    const result = await registerAgent('TestBot', 'test');
    expect(result).toBeNull();
  });
});

describe('heartbeat', () => {
  it('returns true when update succeeds', async () => {
    mockEq.mockResolvedValue({ error: null });

    const result = await heartbeat('agent-1');
    expect(result).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith('agents');
  });

  it('returns false when update fails', async () => {
    mockEq.mockResolvedValue({ error: { message: 'fail' } });

    const result = await heartbeat('agent-1');
    expect(result).toBe(false);
  });
});

describe('dispatchTask', () => {
  // dispatchTask now: (1) inserts the agent_tasks row, (2) applies the task's
  // bounded effect synchronously (writing to the `agents` table for
  // restart/motivate), (3) updates the agent_tasks row to completed/failed.
  // Each table gets its own chain/mock so effects on `agents` don't collide
  // with the `agent_tasks` insert/update calls.
  const setupChains = () => {
    const agentTasksSingle = jest.fn();
    const agentsEq = jest.fn().mockResolvedValue({ error: null });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'agent_tasks') {
        return {
          insert: jest.fn().mockReturnThis(),
          update: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: agentTasksSingle,
        };
      }
      if (table === 'agents') {
        return {
          update: jest.fn().mockReturnThis(),
          eq: agentsEq,
        };
      }
      return chainMethods();
    });

    return { agentTasksSingle, agentsEq };
  };

  it('inserts the task then marks it completed after applying the restart effect', async () => {
    const { agentTasksSingle, agentsEq } = setupChains();
    const insertedTask = { id: 't1', agent_id: 'a1', type: 'restart', status: 'running' };
    agentTasksSingle
      .mockResolvedValueOnce({ data: insertedTask, error: null })
      .mockResolvedValueOnce({
        data: { ...insertedTask, status: 'completed', result: { effect: 'restart', newStatus: 'idle' } },
        error: null,
      });

    const result = await dispatchTask('a1', 'restart', {});

    expect(result?.status).toBe('completed');
    expect(result?.result).toMatchObject({ effect: 'restart', newStatus: 'idle' });
    // The restart effect actually resets the agent's status/heartbeat.
    expect(agentsEq).toHaveBeenCalledWith('id', 'a1');
    expect(mockFrom).toHaveBeenCalledWith('agent_tasks');
    expect(mockFrom).toHaveBeenCalledWith('agents');
  });

  it('applies the motivate effect and reports it as completed', async () => {
    const { agentTasksSingle } = setupChains();
    const insertedTask = { id: 't2', agent_id: 'a1', type: 'motivate', status: 'running' };
    agentTasksSingle
      .mockResolvedValueOnce({ data: insertedTask, error: null })
      .mockResolvedValueOnce({
        data: { ...insertedTask, status: 'completed', result: { effect: 'motivate', message: 'Go team!' } },
        error: null,
      });

    const result = await dispatchTask('a1', 'motivate', { message: 'Go team!' });

    expect(result?.status).toBe('completed');
    expect(result?.result).toMatchObject({ effect: 'motivate', message: 'Go team!' });
  });

  it('honestly reports that scale has no effect when no capacity field exists', async () => {
    const { agentTasksSingle } = setupChains();
    const insertedTask = { id: 't3', agent_id: 'primus', type: 'scale', status: 'running' };
    agentTasksSingle
      .mockResolvedValueOnce({ data: insertedTask, error: null })
      .mockResolvedValueOnce({
        data: { ...insertedTask, status: 'completed', result: { effect: 'scale', appliedChange: false } },
        error: null,
      });

    const result = await dispatchTask('primus', 'scale', { factor: 2 });

    expect(result?.status).toBe('completed');
    expect(result?.result).toMatchObject({ effect: 'scale', appliedChange: false });
  });

  it('returns null on error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'fail' } });

    const result = await dispatchTask('a1', 'restart', {});
    expect(result).toBeNull();
  });
});

describe('getAllAgents', () => {
  it('returns all agents', async () => {
    const agents = [
      { id: '1', name: 'Bot1', role: 'test', status: 'idle' },
      { id: '2', name: 'Bot2', role: 'test2', status: 'busy' },
    ];
    mockSelect.mockResolvedValue({ data: agents, error: null });

    const result = await getAllAgents();
    expect(result).toEqual(agents);
  });

  it('returns empty array on error', async () => {
    mockSelect.mockResolvedValue({ data: null, error: { message: 'fail' } });

    const result = await getAllAgents();
    expect(result).toEqual([]);
  });
});

describe('setAgentStatus', () => {
  it('returns true on success', async () => {
    mockEq.mockResolvedValue({ error: null });

    const result = await setAgentStatus('a1', 'busy');
    expect(result).toBe(true);
  });

  it('returns false on failure', async () => {
    mockEq.mockResolvedValue({ error: { message: 'fail' } });

    const result = await setAgentStatus('a1', 'error');
    expect(result).toBe(false);
  });
});
