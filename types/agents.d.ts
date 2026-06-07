export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'busy' | 'error';
  last_heartbeat: string | null;
  created_at: string;
}

export interface AgentTask {
  id: string;
  agent_id: string;
  type: string;
  payload: any;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: any;
  started_at?: string;
  finished_at?: string;
}
