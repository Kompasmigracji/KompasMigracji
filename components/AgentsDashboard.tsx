'use client';

import React from 'react';
import useSWR from 'swr';
import AgentCard from './AgentCard';
import GodCard from './GodCard';
import type { Agent } from '../types/agents';
import type { GodAgent } from '../types/god';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const AgentsDashboard: React.FC = () => {
  const { data: statusData, error } = useSWR<{ agents: Agent[] }>(
    '/api/agents/primus/status',
    fetcher,
    { refreshInterval: 10000 }
  );

  const agents = statusData?.agents ?? [];

  const god: GodAgent = {
    id: 'god-singleton',
    name: 'Grand Architect Oleksandr Khrysytodul',
    policies: {},
    createdAt: new Date().toISOString(),
  };

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        Ошибка загрузки данных агентов
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-2">
        🛡️ Primus — Панель Агентов
      </h1>

      <GodCard god={god} />

      {agents.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          {statusData ? 'Нет зарегистрированных агентов' : 'Загрузка агентов…'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentsDashboard;
