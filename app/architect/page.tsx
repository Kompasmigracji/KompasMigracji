// app/architect/page.tsx
import React from 'react';
import { GlassCard } from '@/components/lifeos/GlassCard';
import { getSupabaseAdmin } from '@/lib/supabase';
import nextDynamic from 'next/dynamic';

const ArchitectCharts = nextDynamic(() => import('@/components/lifeos/ArchitectCharts').then(mod => mod.ArchitectCharts), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full flex items-center justify-center text-slate-500">Loading charts...</div>
});

export const dynamic = 'force-dynamic';

export default async function ArchitectDashboard() {
  const supabase = getSupabaseAdmin();
  
  let modules = [
    { name: 'FateEngine', is_active: true, status: 'Online', load: '0%' },
    { name: 'SoulEngine', is_active: true, status: 'Online', load: '0%' },
    { name: 'OmegaLayer', is_active: false, status: 'Offline', load: '0%' },
  ];
  let logs: any[] = [];
  let recentTxCount = 0;
  let totalRevenue = 0;
  let soulVibe = 'Dormant';
  let soulResonance = 0;
  let fateStatus = 'Balanced';
  let fateRecommendation = 'System is alive.';

  // Mock historical data for charts
  const revenueData = [
    { name: 'Mon', amount: 120 },
    { name: 'Tue', amount: 300 },
    { name: 'Wed', amount: 250 },
    { name: 'Thu', amount: 450 },
    { name: 'Fri', amount: 380 },
    { name: 'Sat', amount: 600 },
    { name: 'Sun', amount: 0 } // Will be updated with today's real revenue
  ];

  const energyData = [
    { name: 'Mon', resonance: 40 },
    { name: 'Tue', resonance: 60 },
    { name: 'Wed', resonance: 55 },
    { name: 'Thu', resonance: 85 },
    { name: 'Fri', resonance: 75 },
    { name: 'Sat', resonance: 95 },
    { name: 'Sun', resonance: 0 } // Will be updated with today's real resonance
  ];

  if (supabase) {
    try {
      // 1. Fetch system modules
      const { data: dbModules } = await supabase.from('system_modules').select('*');
      if (dbModules && dbModules.length > 0) {
        modules = dbModules.map(m => ({
          name: m.name,
          is_active: m.is_active,
          status: m.is_active ? 'Online' : 'Offline',
          load: m.is_active ? 'Active' : '0%'
        }));
      }

      // 2. Fetch System Logs
      const { data: dbLogs } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      logs = dbLogs || [];

      // Extract specific Engine states from the latest logs
      const latestSoul = logs.find(l => l.source === 'SoulEngine');
      if (latestSoul && latestSoul.details) {
        soulVibe = latestSoul.message.replace('SoulEngine Cycle Completed: Vibe is ', '');
        soulResonance = latestSoul.details.resonance || 0;
      }

      const latestFate = logs.find(l => l.source === 'FateEngine');
      if (latestFate && latestFate.details) {
        fateStatus = latestFate.message.replace('FateEngine Cycle Completed: Status is ', '');
        fateRecommendation = latestFate.details.recommendation || 'Maintain trajectory.';
      }

      // 3. Fetch Transactions (Finance Pulse)
      const { data: txs } = await supabase.from('transactions').select('amount');
      if (txs) {
        recentTxCount = txs.length;
        totalRevenue = txs.reduce((acc, curr) => acc + (curr.amount || 0), 0);
      }

      // Inject real real-time data into the end of our charts
      revenueData[revenueData.length - 1].amount = totalRevenue;
      energyData[energyData.length - 1].resonance = Math.floor(soulResonance * 100);

    } catch (e) {
      console.error("Dashboard error:", e);
    }
  }

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light text-white tracking-wide">Command / <span className="font-bold text-cyan-400">The Matrix</span></h2>
          <p className="text-slate-400 mt-2">Central Nervous System of LifeOS. Monitoring Fate, Soul, and Financial parameters.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full shadow-lg">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Sys-Link Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module Status */}
        <GlassCard title="Core Modules">
          <ul className="space-y-4">
            {modules.map(m => (
              <li key={m.name} className="flex justify-between items-center">
                <span className={m.is_active ? "text-slate-200 font-medium" : "text-slate-500"}>{m.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{m.load}</span>
                  <span className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded border ${
                    m.is_active 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                      : 'bg-slate-800/50 text-slate-500 border-slate-700/50'
                  }`}>
                    {m.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Current Focus (Fate & Finance) */}
        <GlassCard title="System Pulse">
          <div className="space-y-5">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Fate Status</div>
              <div className={`text-lg ${fateStatus.includes('Overload') ? 'text-rose-400' : 'text-emerald-400'}`}>
                {fateStatus}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Soul Resonance</div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-1000" style={{ width: `${Math.max(10, soulResonance * 100)}%` }}></div>
              </div>
              <div className="text-[10px] text-slate-400 text-right">{soulVibe}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Financial Load</div>
              <div className="text-lg text-white">${totalRevenue.toFixed(2)} <span className="text-xs text-slate-500">({recentTxCount} txs)</span></div>
            </div>
          </div>
        </GlassCard>

        {/* ALEX-DIGITAL / Engine Output */}
        <GlassCard title="Fate Recommendation">
          <div className="text-sm italic text-slate-300 border-l-2 border-cyan-500/50 pl-4 py-2 leading-relaxed h-[100px] overflow-y-auto custom-scrollbar">
            "{fateRecommendation}"
          </div>
          <div className="mt-4 flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              ALEX-DIGITAL Online
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Dynamic Recharts Component */}
      <ArchitectCharts revenueData={revenueData} energyData={energyData} />
      
      {/* System Events Feed */}
      <GlassCard title="Autonomous Event Feed" className="mt-8">
        {logs.length === 0 ? (
          <div className="text-sm text-slate-500 italic py-4">No recent system events found in the Matrix.</div>
        ) : (
          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {logs.map((log, i) => (
              <div key={log.id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-6 last:pb-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-400 group-[.is-active]:text-cyan-400 group-[.is-active]:border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-slate-900/50 backdrop-blur-sm transition-all hover:bg-slate-800/50 hover:border-white/10 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      log.level === 'error' ? 'text-rose-400' :
                      log.level === 'warn' ? 'text-amber-400' :
                      'text-cyan-500'
                    }`}>{log.source}</span>
                    <time className="text-xs text-slate-500 font-mono">{log.created_at ? formatTime(log.created_at) : 'Just now'}</time>
                  </div>
                  <div className="text-sm text-slate-300">
                    {log.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
