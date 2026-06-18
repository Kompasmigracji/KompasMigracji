// app/architect/settings/page.tsx
import React from 'react';
import { GlassCard } from '@/components/lifeos/GlassCard';

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h2 className="text-3xl font-light text-white tracking-wide">System <span className="font-bold text-cyan-400">Configuration</span></h2>
        <p className="text-slate-400 mt-2">Global parameters for LifeOS.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard title="Environment">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">System Mode</span>
              <select className="bg-black/50 border border-white/10 rounded px-3 py-1 text-sm text-cyan-400 focus:outline-none focus:border-cyan-500">
                <option>Development</option>
                <option>Staging</option>
                <option>Production</option>
                <option>Ω-Mode</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Theme Engine</span>
              <select className="bg-black/50 border border-white/10 rounded px-3 py-1 text-sm text-purple-400 focus:outline-none focus:border-purple-500">
                <option>Cyber-Neon Glass</option>
                <option>Void Minimal</option>
                <option>Light Matrix</option>
              </select>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Security & Access">
          <div className="space-y-4 text-sm">
            <div className="p-3 rounded bg-red-900/20 border border-red-500/30 text-red-200">
              <p className="font-medium text-red-400 mb-1">Architect Access Level</p>
              God Mode is currently active. All database tables and configuration files are accessible.
            </div>
            <button className="w-full mt-2 px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded text-slate-300">
              Rotate Application Keys
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
