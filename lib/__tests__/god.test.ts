/**
 * Unit tests for lib/god.ts
 */

const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();
const mockLimit = jest.fn();

const chainMethods = () => ({
  select: mockSelect.mockReturnThis(),
  insert: mockInsert.mockReturnThis(),
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
  it('dispatches a task to Primus agent', async () => {
    // First call: getGodAgent → god_policies
    // Second call: find Primus agent
    // Third call: insert task
    let callCount = 0;
    mockFrom.mockImplementation((table: string) => {
      callCount++;
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
        chain.insert = jest.fn().mockReturnThis();
        // insert doesn't chain to single in evaluateAndCommandGod
        (chain as any).insert.mockResolvedValue({ error: null });
      }
      return chain;
    });

    const result = await evaluateAndCommandGod({ command: 'scale', payload: { factor: 2 } });
    expect(result).toBe(true);
  });
});
