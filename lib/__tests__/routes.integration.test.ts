import { GET as getStatus } from '../../app/api/agents/primus/status/route';
import { POST as postCommand } from '../../app/api/god/command/route';
import { getSupabase } from '../supabase';
import { getAllAgents } from '../agents';
import { evaluateAndCommandGod } from '../god';
import { requireAuth } from '../auth';

// Mock agents.ts functions
jest.mock('../agents', () => ({
  getAllAgents: jest.fn(),
}));

// Mock god.ts functions
jest.mock('../god', () => ({
  evaluateAndCommandGod: jest.fn(),
}));

// Mock supabase client
jest.mock('../supabase', () => ({
  getSupabase: jest.fn(),
}));

// Mock JWT-cookie auth
jest.mock('../auth', () => ({
  requireAuth: jest.fn(),
}));

const mockSupabase = {};
const adminAuth = { user: { sub: '1', role: 'admin', email: 'admin@test' } };

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

    it('returns 401 if there is no session', async () => {
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);
      (requireAuth as jest.Mock).mockResolvedValue({ error: 'Требуется вход', status: 401 });

      const res = await getStatus();
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe('Unauthorized');
    });

    it('returns 403 if user is not an admin', async () => {
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);
      (requireAuth as jest.Mock).mockResolvedValue({ error: 'Недостаточно прав', status: 403 });

      const res = await getStatus();
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toBe('Unauthorized');
    });

    it('returns 200 and agents list on success', async () => {
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);
      (requireAuth as jest.Mock).mockResolvedValue(adminAuth);

      const mockAgentsList = [{ id: '1', name: 'Primus', role: 'primus', status: 'idle' }];
      (getAllAgents as jest.Mock).mockResolvedValue(mockAgentsList);

      const res = await getStatus();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.agents).toEqual(mockAgentsList);
      expect(requireAuth).toHaveBeenCalledWith(['admin']);
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

    it('returns 401 if unauthorized', async () => {
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);
      (requireAuth as jest.Mock).mockResolvedValue({ error: 'Требуется вход', status: 401 });
      const req = {
        json: async () => ({ command: 'test' }),
      } as unknown as Request;

      const res = await postCommand(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe('Unauthorized');
    });

    it('returns 400 if command is missing', async () => {
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);
      (requireAuth as jest.Mock).mockResolvedValue(adminAuth);
      const req = {
        json: async () => ({ payload: {} }),
      } as unknown as Request;

      const res = await postCommand(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Missing command');
    });

    it('returns 500 if dispatching command fails', async () => {
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);
      (requireAuth as jest.Mock).mockResolvedValue(adminAuth);
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
      (getSupabase as jest.Mock).mockReturnValue(mockSupabase);
      (requireAuth as jest.Mock).mockResolvedValue(adminAuth);
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
