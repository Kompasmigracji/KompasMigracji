// app/architect/settings/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/lifeos/GlassCard';

const SYSTEM_MODE_OPTIONS = [
  { value: 'dev', label: 'Development' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
  { value: 'omega', label: 'Ω-Mode' },
];

const THEME_OPTIONS = [
  { value: 'cyber-neon', label: 'Cyber-Neon Glass' },
  { value: 'void-minimal', label: 'Void Minimal' },
  { value: 'light-matrix', label: 'Light Matrix' },
];

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<Record<string, SaveState>>({});

  const [cycleRunning, setCycleRunning] = useState(false);
  const [cycleResult, setCycleResult] = useState<{ vibe?: string; status?: string } | null>(null);
  const [cycleError, setCycleError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/architect/settings');
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const body = await res.json();
        if (!cancelled) setSettings(body.settings || {});
      } catch (err: any) {
        if (!cancelled) setLoadError(err.message || 'Failed to load settings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const updateSetting = async (key: string, value: string) => {
    const previous = settings[key];
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveState(prev => ({ ...prev, [key]: 'saving' }));

    try {
      const res = await fetch('/api/architect/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${res.status}`);
      }
      setSaveState(prev => ({ ...prev, [key]: 'saved' }));
      setTimeout(() => setSaveState(prev => ({ ...prev, [key]: 'idle' })), 2000);
    } catch (err) {
      setSettings(prev => ({ ...prev, [key]: previous }));
      setSaveState(prev => ({ ...prev, [key]: 'error' }));
    }
  };

  const runCycleNow = async () => {
    setCycleRunning(true);
    setCycleError(null);
    setCycleResult(null);
    try {
      const res = await fetch('/api/architect/cycle', { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || `Request failed: ${res.status}`);
      setCycleResult({ vibe: body.soul?.vibe, status: body.fate?.status });
    } catch (err: any) {
      setCycleError(err.message || 'Failed to run LifeOS cycle');
    } finally {
      setCycleRunning(false);
    }
  };

  // Ensures the <select> shows the real stored value even if it's not one of
  // our known options (e.g. a legacy/seed value from a different environment).
  const optionsFor = (base: { value: string; label: string }[], current: any) => {
    if (current && !base.some(o => o.value === current)) {
      return [{ value: String(current), label: `${current} (current)` }, ...base];
    }
    return base;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h2 className="text-3xl font-light text-white tracking-wide">System <span className="font-bold text-cyan-400">Configuration</span></h2>
        <p className="text-slate-400 mt-2">Global parameters for LifeOS, persisted to `architect_settings`.</p>
      </header>

      {loadError && (
        <div className="px-4 py-3 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          Failed to load settings: {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard title="Environment">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">System Mode</span>
              <div className="flex items-center gap-2">
                {saveState.system_mode === 'saving' && <span className="text-[10px] text-slate-500">saving…</span>}
                {saveState.system_mode === 'saved' && <span className="text-[10px] text-emerald-400">saved</span>}
                {saveState.system_mode === 'error' && <span className="text-[10px] text-red-400">error</span>}
                <select
                  disabled={loading}
                  value={settings.system_mode ?? ''}
                  onChange={(e) => updateSetting('system_mode', e.target.value)}
                  className="bg-black/50 border border-white/10 rounded px-3 py-1 text-sm text-cyan-400 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                >
                  {optionsFor(SYSTEM_MODE_OPTIONS, settings.system_mode).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Theme Engine</span>
              <div className="flex items-center gap-2">
                {saveState.theme === 'saving' && <span className="text-[10px] text-slate-500">saving…</span>}
                {saveState.theme === 'saved' && <span className="text-[10px] text-emerald-400">saved</span>}
                {saveState.theme === 'error' && <span className="text-[10px] text-red-400">error</span>}
                <select
                  disabled={loading}
                  value={settings.theme ?? ''}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  className="bg-black/50 border border-white/10 rounded px-3 py-1 text-sm text-purple-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                >
                  {optionsFor(THEME_OPTIONS, settings.theme).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Security & Access">
          <div className="space-y-4 text-sm">
            <div className="p-3 rounded bg-red-900/20 border border-red-500/30 text-red-200">
              <p className="font-medium text-red-400 mb-1">Architect Access Level</p>
              God Mode is currently active. All database tables and configuration files are accessible.
            </div>

            {/*
              This used to be a "Rotate Application Keys" button with no
              onClick and no backing data: there's no concept of a LifeOS-issued
              application key anywhere in this codebase for it to rotate
              (grepped for api_key/apiKey/rotate — only external provider keys
              like ANTHROPIC_API_KEY, Stripe, etc., which are env vars, not
              something an admin panel button can safely "rotate"). Repurposed
              into a real action: manually trigger the same SoulEngine/FateEngine
              cycle the daily cron (app/api/cron/lifeos) runs on a schedule.
            */}
            <button
              onClick={runCycleNow}
              disabled={cycleRunning}
              className="w-full mt-2 px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded text-slate-300 disabled:opacity-50"
            >
              {cycleRunning ? 'Running LifeOS Cycle…' : 'Re-run LifeOS Cycle Now'}
            </button>
            {cycleResult && (
              <div className="px-3 py-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                Cycle complete — Soul vibe: {cycleResult.vibe || 'n/a'}, Fate status: {cycleResult.status || 'n/a'}.
              </div>
            )}
            {cycleError && (
              <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {cycleError}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
