import { GET as getStatus } from '../../app/api/agents/primus/status/route';
import { POST as postCommand } from '../../app/api/god/command/route';
import { getSupabase } from '../supabase';
import { getAllAgents } from '../agents';
import { evaluateAndCommandGod } from '../god';

// Mock agents.ts functions
jest.mock('../agents', () => ({
  getAllAgents: jest.fn(),
}));

// Mock god.ts functions
jest.mock('../god', () => ({
  evaluateAndCommandGod: jest.fn(),
}));

// Mock supabase client
const mockGetSession = jest.fn();

jest.mock('../supabase', () => ({
  getSupabase: jest.fn(),
}));

describe('Integration Tests - API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/agents/primus/status', () => {
    it('returns 503 if Supabase is not configured', async () => {
      (getSupabase as jest.Mock).mockReturnValue(null);

      const res = await getStatus();
      expect(res.status).toBe(503);
      const json = await res.json();
      expect(json.error).toBe('Supabase not configured');
    });

    it('returns 403 if user is unauthorized (no session)', async () => {
      const mockSupabase = {
        auth: { getSession: mockGetSession.mockResolvedValue({ data: { session: null } }) },
      };
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);

      const res = await getStatus();
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toBe('Unauthorized');
    });

    it('returns 403 if user has the wrong email', async () => {
      const mockSupabase = {
        auth: {
          getSession: mockGetSession.mockResolvedValue({
            data: { session: { user: { email: 'hacker@example.com' } } },
          }),
        },
      };
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);

      const res = await getStatus();
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toBe('Unauthorized');
    });

    it('returns 200 and agents list on success', async () => {
      const mockSupabase = {
        auth: {
          getSession: mockGetSession.mockResolvedValue({
            data: { session: { user: { email: 'iphoenixgsm@gmail.com' } } },
          }),
        },
      };
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);

      const mockAgentsList = [{ id: '1', name: 'Primus', role: 'primus', status: 'idle' }];
      (getAllAgents as jest.Mock).mockResolvedValue(mockAgentsList);

      const res = await getStatus();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.agents).toEqual(mockAgentsList);
    });
  });

  describe('POST /api/god/command', () => {
    it('returns 503 if Supabase is not configured', async () => {
      (getSupabase as jest.Mock).mockReturnValue(null);
      const req = {
        json: async () => ({ command: 'test' }),
      } as unknown as Request;

      const res = await postCommand(req);
      expect(res.status).toBe(503);
      const json = await res.json();
      expect(json.error).toBe('Supabase not configured');
    });

    it('returns 403 if unauthorized', async () => {
      const mockSupabase = {
        auth: { getSession: mockGetSession.mockResolvedValue({ data: { session: null } }) },
      };
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);
      const req = {
        json: async () => ({ command: 'test' }),
      } as unknown as Request;

      const res = await postCommand(req);
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toBe('Unauthorized');
    });

    it('returns 400 if command is missing', async () => {
      const mockSupabase = {
        auth: {
          getSession: mockGetSession.mockResolvedValue({
            data: { session: { user: { email: 'iphoenixgsm@gmail.com' } } },
          }),
        },
      };
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);
      const req = {
        json: async () => ({ payload: {} }),
      } as unknown as Request;

      const res = await postCommand(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Missing command');
    });

    it('returns 500 if dispatching command fails', async () => {
      const mockSupabase = {
        auth: {
          getSession: mockGetSession.mockResolvedValue({
            data: { session: { user: { email: 'iphoenixgsm@gmail.com' } } },
          }),
        },
      };
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);
      (evaluateAndCommandGod as jest.Mock).mockResolvedValue(false);

      const req = {
        json: async () => ({ command: 'scale' }),
      } as unknown as Request;

      const res = await postCommand(req);
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBe('Failed to dispatch command');
    });

    it('returns 200 on success', async () => {
      const mockSupabase = {
        auth: {
          getSession: mockGetSession.mockResolvedValue({
            data: { session: { user: { email: 'iphoenixgsm@gmail.com' } } },
          }),
        },
      };
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);
      (evaluateAndCommandGod as jest.Mock).mockResolvedValue(true);

      const req = {
        json: async () => ({ command: 'scale', payload: { factor: 2 } }),
      } as unknown as Request;

      const res = await postCommand(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.message).toBe('Command dispatched');
      expect(json.command).toBe('scale');
    });
  });
});
