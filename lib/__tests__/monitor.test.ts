/**
 * Unit tests for lib/monitor.ts
 */

// Mock agents and notify modules
jest.mock('../agents', () => ({
  getAllAgents: jest.fn(),
  setAgentStatus: jest.fn().mockResolvedValue(true),
  dispatchTask: jest.fn().mockResolvedValue({ id: 'task-1' }),
}));

jest.mock('../notify', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

import { runMonitorCycle } from '../monitor';
import { getAllAgents, setAgentStatus, dispatchTask } from '../agents';
import { sendEmail } from '../notify';

const mockGetAllAgents = getAllAgents as jest.Mock;
const mockSetAgentStatus = setAgentStatus as jest.Mock;
const mockDispatchTask = dispatchTask as jest.Mock;
const mockSendEmail = sendEmail as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('runMonitorCycle', () => {
  it('does nothing when all agents are healthy', async () => {
    mockGetAllAgents.mockResolvedValue([
      { id: '1', name: 'Bot1', role: 'test', status: 'idle', last_heartbeat: new Date().toISOString() },
    ]);

    await runMonitorCycle();

    expect(mockSetAgentStatus).not.toHaveBeenCalled();
    expect(mockDispatchTask).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('restarts and emails for stale agents (heartbeat > 2 min)', async () => {
    const staleDate = new Date(Date.now() - 3 * 60 * 1000).toISOString(); // 3 min ago
    mockGetAllAgents.mockResolvedValue([
      { id: '1', name: 'StaleBot', role: 'test', status: 'idle', last_heartbeat: staleDate },
    ]);

    await runMonitorCycle();

    expect(mockSetAgentStatus).toHaveBeenCalledWith('1', 'error');
    expect(mockDispatchTask).toHaveBeenCalledWith('1', 'restart', {});
    expect(mockSendEmail).toHaveBeenCalledWith(
      'iphoenixgsm@gmail.com',
      expect.stringContaining('StaleBot'),
      expect.stringContaining('StaleBot')
    );
  });

  it('restarts agents with null heartbeat', async () => {
    mockGetAllAgents.mockResolvedValue([
      { id: '2', name: 'NeverPinged', role: 'new', status: 'idle', last_heartbeat: null },
    ]);

    await runMonitorCycle();

    expect(mockSetAgentStatus).toHaveBeenCalledWith('2', 'error');
    expect(mockDispatchTask).toHaveBeenCalledWith('2', 'restart', {});
    expect(mockSendEmail).toHaveBeenCalled();
  });
});
