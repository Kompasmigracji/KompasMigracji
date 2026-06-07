import React from 'react';
import { useRouter } from 'next/navigation';
import { setAgentStatus, dispatchTask } from '../lib/agents';
import type { Agent } from '../types/agents';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const router = useRouter();

  const handleRestart = async () => {
    // Set status to busy, then create a restart task
    await setAgentStatus(agent.id, 'busy');
    await dispatchTask(agent.id, 'restart', {});
    // optimistic UI update could be added here
  };

  const handleMotivate = async () => {
    // Simple motivational message task
    await dispatchTask(agent.id, 'motivate', { message: 'Вы делаете отличную работу! 🚀' });
  };

  const statusColor =
    agent.status === 'idle' ? 'bg-green-500' : agent.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="glass p-4 flex flex-col gap-3 transform transition hover:scale-105 hover:shadow-xl">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
        <span className={`${statusColor} w-3 h-3 rounded-full`} title={agent.status}></span>
      </div>
      <p className="text-sm text-gray-300">Роль: {agent.role}</p>
      <p className="text-xs text-gray-400">
        Последний heartbeat: {agent.last_heartbeat ? new Date(agent.last_heartbeat).toLocaleTimeString() : '—'}
      </p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleRestart}
          className="bg-primusBlue text-white px-3 py-1 rounded hover:bg-primusBlue/80 transition"
        >
          Перезапустить
        </button>
        <button
          onClick={handleMotivate}
          className="bg-monitorGreen text-white px-3 py-1 rounded hover:bg-monitorGreen/80 transition"
        >
          Мотивировать
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
