'use client';

import React from 'react';
import useSWR from 'swr';
import AgentCard from './AgentCard';
import GodCard from './GodCard';
import type { Agent } from '../types/agents';
import type { GodAgent } from '../types/god';
import { useTranslations } from 'next-intl';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const AgentsDashboard: React.FC = () => {
  const t = useTranslations();
  const { data: statusData, error, mutate } = useSWR<{ agents: Agent[] }>(
    '/api/agents/primus/status',
    fetcher,
    { refreshInterval: 10000 }
  );
  const [checking, setChecking] = React.useState(false);
  const [checkResult, setCheckResult] = React.useState<string | null>(null);

  const agents = statusData?.agents ?? [];

  const god: GodAgent = {
    id: 'god-singleton',
    name: 'Grand Architect Oleksandr Khrysytodul',
    policies: {},
    createdAt: new Date().toISOString(),
  };

  const runHealthCheck = async () => {
    setChecking(true);
    setCheckResult(null);
    try {
      const res = await fetch('/api/agents/monitor/cron', { method: 'POST' });
      const data = await res.json();
      setCheckResult(res.ok ? (data.message || 'OK') : (data.error || 'Помилка'));
      mutate();
    } catch (e: any) {
      setCheckResult(e?.message || 'Помилка мережі');
    } finally {
      setChecking(false);
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        {t('admin_err_load')}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('admin_title')}
        </h1>
        <div className="flex items-center gap-3">
          {checkResult && <span className="text-xs text-gray-600">{checkResult}</span>}
          <button
            onClick={runHealthCheck}
            disabled={checking}
            className="bg-white/60 border border-black/10 text-sm px-3 py-1.5 rounded-lg hover:bg-white/80 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {checking ? '…' : 'Перевірити агентів зараз'}
          </button>
        </div>
      </div>

      <GodCard god={god} onCommandDispatched={() => mutate()} />

      {agents.length === 0 ? (
        <div className="text-gray-500 text-center py-12">
          {statusData ? t('admin_no_agents') : t('admin_loading')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onTaskDispatched={() => mutate()} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentsDashboard;
