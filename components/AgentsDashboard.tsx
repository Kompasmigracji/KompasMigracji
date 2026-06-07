import React from 'react';
import useSWR from 'swr';
import AgentCard from '../components/AgentCard';
import GodCard from '../components/GodCard';
import type { Agent } from '../types/agents';
import type { GodAgent } from '../types/god';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const AgentsDashboard: React.FC = () => {
  const { data: godData, error: godError } = useSWR<GodAgent>('/api/god/command', fetcher);
  const { data: agents, error } = useSWR<Agent[]>('/api/agents/primus/status', fetcher);

  if (error || godError) return <div className="text-red-500">Ошибка загрузки данных</div>;
  if (!agents) return <div className="text-gray-400">Загрузка агентов…</div>;

  return (
    <div className="p-6 space-y-6">
      {godData && <GodCard god={godData} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

export default AgentsDashboard;
