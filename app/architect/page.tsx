// app/architect/page.tsx
import React from 'react';
import { GlassCard } from '@/components/lifeos/GlassCard';
import { q } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ArchitectDashboard() {
  // Mock data fetching for the dashboard
  // In a real app, we'd query the 'system_modules' and 'agent_messages' tables
  const modules = [
    { name: 'FateEngine', status: 'Online', load: '12%' },
    { name: 'SoulEngine', status: 'Online', load: '4%' },
    { name: 'OmegaLayer', status: 'Active', load: '1%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h2 className="text-3xl font-light text-white tracking-wide">Today / <span className="font-bold text-cyan-400">Fate Dashboard</span></h2>
        <p className="text-slate-400 mt-2">System is alive. All modules operating within normal parameters.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module Status */}
        <GlassCard title="Core Modules">
          <ul className="space-y-4">
            {modules.map(m => (
              <li key={m.name} className="flex justify-between items-center">
                <span className="text-slate-300">{m.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{m.load}</span>
                  <span className="px-2 py-1 text-[10px] uppercase tracking-wider rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {m.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Current Focus */}
        <GlassCard title="Active Focus">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Primary Vector</div>
              <div className="text-lg text-white">System Architecture</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Energy Level</div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 w-[85%]"></div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* ALEX-DIGITAL Mini */}
        <GlassCard title="ALEX-DIGITAL Core">
          <div className="text-sm italic text-slate-400 border-l-2 border-cyan-500/50 pl-4 py-1">
            "Your structural trajectory is stable, Architect. Fate paths are converging on the LifeOS integration."
          </div>
          <div className="mt-4 flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              Strategist Mode
            </span>
          </div>
        </GlassCard>
      </div>
      
      {/* System Events */}
      <GlassCard title="Recent System Events" className="mt-8">
        <div className="space-y-4">
          {[
            { time: '10:45 AM', action: 'Deployed LifeOS Core Migration', source: 'DevOps Agent' },
            { time: '10:30 AM', action: 'Analyzed daily parameters', source: 'FateEngine' },
            { time: '09:15 AM', action: 'Spiritual resonance check completed', source: 'SoulEngine' }
          ].map((log, i) => (
            <div key={i} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
              <div className="text-xs text-slate-500 pt-0.5 w-16 shrink-0">{log.time}</div>
              <div>
                <div className="text-sm text-slate-300">{log.action}</div>
                <div className="text-xs text-cyan-600 mt-1">{log.source}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
