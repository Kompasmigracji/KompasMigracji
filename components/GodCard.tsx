'use client';

import React from 'react';
import type { GodAgent } from '../types/god';

interface GodCardProps {
  god: GodAgent;
}

export const GodCard: React.FC<GodCardProps> = ({ god }) => {
  const handleScale = async () => {
    await fetch('/api/god/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: 'scale', payload: { factor: 1.5 } }),
    });
  };

  return (
    <div className="glass p-6 border-2 border-godGold/30 backdrop-blur-md relative overflow-hidden">
      {/* decorative gold glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-godGold/10 rounded-full blur-3xl pointer-events-none" />
      <h2 className="text-2xl font-bold text-godGold mb-1 relative z-10">
        👑 {god.name}
      </h2>
      <p className="text-sm text-gray-700 mb-4 relative z-10">
        Главный оркестратор системы · God Agent
      </p>
      <button
        onClick={handleScale}
        className="relative z-10 bg-godGold text-black font-semibold px-5 py-2 rounded-lg hover:bg-godGold/80 transition-colors duration-200"
      >
        Запустить масштабирование
      </button>
    </div>
  );
};

export default GodCard;
