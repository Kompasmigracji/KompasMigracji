'use client';

import React from 'react';
import type { Agent } from '../types/agents';
import { useTranslations } from 'next-intl';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const t = useTranslations();
  const handleRestart = async () => {
    await fetch('/api/agents/primus/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: agent.id, type: 'restart', payload: {} }),
    });
  };

  const handleMotivate = async () => {
    await fetch('/api/agents/primus/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: agent.id,
        type: 'motivate',
        payload: { message: t('admin_motivate_msg') },
      }),
    });
  };

  const statusColor =
    agent.status === 'idle'
      ? 'bg-green-500'
      : agent.status === 'busy'
        ? 'bg-yellow-500'
        : 'bg-red-500';

  const statusLabel =
    agent.status === 'idle'
      ? t('admin_status_active')
      : agent.status === 'busy'
        ? t('admin_status_busy')
        : t('admin_status_err');

  return (
    <div className="glass p-5 flex flex-col gap-3 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{agent.name}</h3>
        <span
          className={`${statusColor} w-3 h-3 rounded-full shrink-0 animate-pulse`}
          title={statusLabel}
        />
      </div>
      <p className="text-sm text-gray-700">{t('admin_role')}<span className="text-primusBlue font-medium">{agent.role}</span></p>
      <p className="text-xs text-gray-500">
        {t('admin_last_hb')}
        {agent.last_heartbeat
          ? new Date(agent.last_heartbeat).toLocaleTimeString()
          : '—'}
      </p>
      <div className="flex gap-2 mt-auto pt-2">
        <button
          onClick={handleRestart}
          className="flex-1 bg-primusBlue/90 text-gray-900 text-sm px-3 py-1.5 rounded-lg hover:bg-primusBlue transition-colors duration-200"
        >
          {t('admin_restart')}
        </button>
        <button
          onClick={handleMotivate}
          className="flex-1 bg-monitorGreen/90 text-gray-900 text-sm px-3 py-1.5 rounded-lg hover:bg-monitorGreen transition-colors duration-200"
        >
          {t('admin_motivate')}
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
