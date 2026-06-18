// app/architect/logs/page.tsx
import React from 'react';
import { GlassCard } from '@/components/lifeos/GlassCard';

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
  // In a real implementation, query `system_logs`
  const logs = [
    { id: 1, level: 'info', source: 'System', msg: 'LifeOS Core Modules Initialized', time: '10:00:00' },
    { id: 2, level: 'info', source: 'ALEX-DIGITAL', msg: 'Context loaded successfully', time: '10:00:05' },
    { id: 3, level: 'warn', source: 'HealthSync', msg: 'Pulse data not found. Engine offline.', time: '10:00:10' },
    { id: 4, level: 'info', source: 'FateEngine', msg: 'Calculated 3 major probability paths.', time: '10:05:00' },
    { id: 5, level: 'error', source: 'Vercel Deploy', msg: 'Build warning: unused variable in /lib/db.ts', time: '10:45:12' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h2 className="text-3xl font-light text-white tracking-wide">System <span className="font-bold text-cyan-400">Logs</span> & Events</h2>
        <p className="text-slate-400 mt-2">Real-time stream of all LifeOS activities.</p>
      </header>

      <GlassCard className="font-mono text-sm">
        <div className="flex border-b border-white/10 pb-3 mb-3 text-slate-500 uppercase tracking-widest text-xs">
          <div className="w-24">Time</div>
          <div className="w-24">Level</div>
          <div className="w-40">Source</div>
          <div className="flex-1">Message</div>
        </div>
        
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="flex group hover:bg-white/5 py-1 -mx-2 px-2 rounded transition-colors">
              <div className="w-24 text-slate-500">{log.time}</div>
              <div className="w-24">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                  log.level === 'error' ? 'bg-red-500/20 text-red-400' :
                  log.level === 'warn' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {log.level}
                </span>
              </div>
              <div className="w-40 text-purple-400 truncate pr-4">{log.source}</div>
              <div className="flex-1 text-slate-300">{log.msg}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
