'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { GlassCard } from '@/components/lifeos/GlassCard';

interface SystemModule {
  id: string | number;
  name: string;
  is_active: boolean;
  updated_at: string;
}

// Presentational-only copy — same pattern as AgentConsole's local flavor-text
// registry (see components/admin/AgentConsole.jsx): real state (is_active)
// comes from the DB, the descriptive blurb is static UI copy keyed by
// whatever module name actually exists in `system_modules`, not hardcoded
// data itself.
const MODULE_DESCRIPTIONS: Record<string, string> = {
  FateEngine: 'Calculates probability vectors and life paths.',
  SoulEngine: 'Tracks spiritual resonance, values, and emotional states.',
  OmegaLayer: 'Meta-analysis layer that oversees the entire system.',
  MagiaEngine: 'Rituals, energy tracking, and field manipulation.',
  HealthSync: 'Biometric data synchronization.',
};

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
});

export default function ModulesPage() {
  const { data, error, isLoading, mutate } = useSWR<{ modules: SystemModule[] }>(
    '/api/architect/modules',
    fetcher
  );
  const [pendingId, setPendingId] = useState<string | number | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const modules = data?.modules ?? [];

  const toggleModule = async (mod: SystemModule) => {
    setToggleError(null);
    setPendingId(mod.id);
    const nextActive = !mod.is_active;

    // Optimistic update
    mutate(
      { modules: modules.map(m => m.id === mod.id ? { ...m, is_active: nextActive } : m) },
      { revalidate: false }
    );

    try {
      const res = await fetch('/api/architect/modules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: mod.id, is_active: nextActive }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${res.status}`);
      }
      await mutate();
    } catch (err: any) {
      setToggleError(err.message || 'Failed to update module');
      await mutate(); // revert to server truth
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8">
        <h2 className="text-3xl font-light text-white tracking-wide"><span className="font-bold text-cyan-400">System</span> Modules</h2>
        <p className="text-slate-400 mt-2">Activate and configure LifeOS core engines. Changes persist to `system_modules`.</p>
      </header>

      {error && (
        <div className="mb-6 px-4 py-3 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          Failed to load system modules.
        </div>
      )}
      {toggleError && (
        <div className="mb-6 px-4 py-3 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {toggleError}
        </div>
      )}

      {isLoading && (
        <div className="text-sm text-slate-500 italic">Loading modules…</div>
      )}

      {!isLoading && modules.length === 0 && !error && (
        <div className="text-sm text-slate-500 italic">No modules found in `system_modules`.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map(mod => (
          <GlassCard key={mod.id} className="relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
            {/* Active Glow Indicator */}
            {mod.is_active && (
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-[40px] pointer-events-none"></div>
            )}

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-medium text-white flex items-center gap-2">
                  {mod.name}
                  {mod.is_active && <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></span>}
                </h3>
                <p className="text-sm text-slate-400 mt-2 pr-8">
                  {MODULE_DESCRIPTIONS[mod.name] || 'LifeOS engine module.'}
                </p>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleModule(mod)}
                disabled={pendingId === mod.id}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${mod.is_active ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mod.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Updated {mod.updated_at ? new Date(mod.updated_at).toLocaleString() : '—'}
              </span>
              <Link
                href={`/architect/logs?source=${encodeURIComponent(mod.name)}`}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                VIEW LOGS
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
