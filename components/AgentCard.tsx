'use client';

import React from 'react';
import type { Agent } from '../types/agents';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
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
        payload: { message: 'Вы делаете отличную работу! 🚀' },
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
      ? 'Активен'
      : agent.status === 'busy'
        ? 'Занят'
        : 'Ошибка';

  return (
    <div className="glass p-5 flex flex-col gap-3 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white truncate">{agent.name}</h3>
        <span
          className={`${statusColor} w-3 h-3 rounded-full shrink-0 animate-pulse`}
          title={statusLabel}
        />
      </div>
      <p className="text-sm text-gray-300">Роль: <span className="text-primusBlue font-medium">{agent.role}</span></p>
      <p className="text-xs text-gray-400">
        Последний heartbeat:{' '}
        {agent.last_heartbeat
          ? new Date(agent.last_heartbeat).toLocaleTimeString('ru-RU')
          : '—'}
      </p>
      <div className="flex gap-2 mt-auto pt-2">
        <button
          onClick={handleRestart}
          className="flex-1 bg-primusBlue/90 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-primusBlue transition-colors duration-200"
        >
          Перезапустить
        </button>
        <button
          onClick={handleMotivate}
          className="flex-1 bg-monitorGreen/90 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-monitorGreen transition-colors duration-200"
        >
          Мотивировать
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
