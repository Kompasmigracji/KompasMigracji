import React from 'react';
import { evaluateAndCommandGod } from '../lib/god';
import type { GodAgent } from '../types/god';

interface GodCardProps {
  god: GodAgent;
}

export const GodCard: React.FC<GodCardProps> = ({ god }) => {
  const handleScale = async () => {
    // Example command to trigger scaling or any custom action
    await evaluateAndCommandGod({ command: 'scale', payload: { factor: 1.5 } });
  };

  return (
    <div className="glass p-6 border-2 border-godGold/30 backdrop-blur-md mb-4">
      <h2 className="text-2xl font-bold text-godGold mb-2">{god.name}</h2>
      <p className="text-sm text-gray-200 mb-4">Главный оркестратор системы.</p>
      <button
        onClick={handleScale}
        className="bg-godGold text-black px-4 py-2 rounded hover:bg-godGold/80 transition"
      >
        Запустить масштабирование
      </button>
    </div>
  );
};

export default GodCard;
