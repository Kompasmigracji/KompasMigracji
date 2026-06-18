'use client';
import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/lifeos/GlassCard';

export default function ModulesPage() {
  const [modules, setModules] = useState([
    { name: 'FateEngine', active: true, desc: 'Calculates probability vectors and life paths.' },
    { name: 'SoulEngine', active: true, desc: 'Tracks spiritual resonance, values, and emotional states.' },
    { name: 'OmegaLayer', active: false, desc: 'Meta-analysis layer that oversees the entire system.' },
    { name: 'MagiaEngine', active: false, desc: 'Rituals, energy tracking, and field manipulation.' }
  ]);

  const toggleModule = (name: string) => {
    setModules(prev => prev.map(m => m.name === name ? { ...m, active: !m.active } : m));
    // In the future, this will sync with Supabase 'system_modules' table
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8">
        <h2 className="text-3xl font-light text-white tracking-wide"><span className="font-bold text-cyan-400">System</span> Modules</h2>
        <p className="text-slate-400 mt-2">Activate and configure LifeOS core engines.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map(mod => (
          <GlassCard key={mod.name} className="relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
            {/* Active Glow Indicator */}
            {mod.active && (
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-[40px] pointer-events-none"></div>
            )}
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-medium text-white flex items-center gap-2">
                  {mod.name}
                  {mod.active && <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></span>}
                </h3>
                <p className="text-sm text-slate-400 mt-2 pr-8">{mod.desc}</p>
              </div>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => toggleModule(mod.name)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${mod.active ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mod.active ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex gap-4">
              <button className="text-xs font-medium text-cyan-400 hover:text-cyan-300">CONFIGURE</button>
              <button className="text-xs font-medium text-slate-400 hover:text-white">VIEW LOGS</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
