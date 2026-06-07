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
  it('returns the created task on success', async () => {
    const fakeTask = { id: 't1', agent_id: 'a1', type: 'restart', status: 'queued' };
    mockSingle.mockResolvedValue({ data: fakeTask, error: null });

    const result = await dispatchTask('a1', 'restart', {});
    expect(result).toEqual(fakeTask);
    expect(mockFrom).toHaveBeenCalledWith('agent_tasks');
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
