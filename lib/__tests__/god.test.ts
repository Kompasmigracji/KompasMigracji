/**
 * Unit tests for lib/god.ts
 */

const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();
const mockLimit = jest.fn();

const chainMethods = () => ({
  select: mockSelect.mockReturnThis(),
  insert: mockInsert.mockReturnThis(),
  update: mockUpdate.mockReturnThis(),
  eq: mockEq.mockReturnThis(),
  single: mockSingle,
  limit: mockLimit.mockReturnThis(),
});

const mockFrom = jest.fn().mockReturnValue(chainMethods());

jest.mock('../supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}));

import { getGodAgent, evaluateAndCommandGod } from '../god';

beforeEach(() => {
  jest.clearAllMocks();
  mockFrom.mockReturnValue(chainMethods());
});

describe('getGodAgent', () => {
  it('returns a GodAgent with policy data', async () => {
    mockSingle.mockResolvedValue({
      data: { policy_json: { auto_restart: true } },
      error: null,
    });

    const god = await getGodAgent();
    expect(god).not.toBeNull();
    expect(god!.name).toBe('Grand Architect Oleksandr Khrysytodul');
    expect(god!.policies).toEqual({ auto_restart: true });
  });

  it('returns null on error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'fail' } });

    const god = await getGodAgent();
    expect(god).toBeNull();
  });
});

describe('evaluateAndCommandGod', () => {
  it('dispatches a task to Primus agent and executes it synchronously', async () => {
    // evaluateAndCommandGod now forwards to dispatchTask, which:
    //  1. inserts the agent_tasks row (insert().select().single())
    //  2. applies the task's bounded effect
    //  3. updates the row to completed/failed (update().eq().select().single())
    const insertedTask = {
      id: 'task-1',
      agent_id: 'primus-id',
      type: 'scale',
      payload: { factor: 2 },
      status: 'running',
    };
    const completedTask = {
      ...insertedTask,
      status: 'completed',
      result: { effect: 'scale', acknowledged: true, appliedChange: false },
    };

    // Shared across both `agent_tasks` chain calls (insert, then update).
    const agentTasksSingle = jest
      .fn()
      .mockResolvedValueOnce({ data: insertedTask, error: null })
      .mockResolvedValueOnce({ data: completedTask, error: null });

    mockFrom.mockImplementation((table: string) => {
      const chain = chainMethods();
      if (table === 'god_policies') {
        chain.single = jest.fn().mockResolvedValue({
          data: { policy_json: {} },
          error: null,
        });
      } else if (table === 'agents') {
        chain.single = jest.fn().mockResolvedValue({
          data: { id: 'primus-id' },
          error: null,
        });
      } else if (table === 'agent_tasks') {
        chain.single = agentTasksSingle;
      }
      return chain;
    });

    const result = await evaluateAndCommandGod({ command: 'scale', payload: { factor: 2 } });
    expect(result).toEqual(completedTask);
    expect(result?.status).toBe('completed');
  });

  it('returns null when no Primus agent exists', async () => {
    mockFrom.mockImplementation((table: string) => {
      const chain = chainMethods();
      if (table === 'god_policies') {
        chain.single = jest.fn().mockResolvedValue({
          data: { policy_json: {} },
          error: null,
        });
      } else if (table === 'agents') {
        chain.single = jest.fn().mockResolvedValue({ data: null, error: { message: 'not found' } });
      }
      return chain;
    });

    const result = await evaluateAndCommandGod({ command: 'scale', payload: {} });
    expect(result).toBeNull();
  });
});
