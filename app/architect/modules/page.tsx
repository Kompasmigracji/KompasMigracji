// app/architect/modules/page.tsx
'use client';
import React, { useState } from 'react';
import { GlassCard } from '@/components/lifeos/GlassCard';
import { NeonToggle } from '@/components/lifeos/NeonToggle';

export default function ModulesPage() {
  const [modules, setModules] = useState([
    { id: 'FateEngine', name: 'FateEngine', active: true, desc: 'Probability and timeline calculations.' },
    { id: 'SoulEngine', name: 'SoulEngine', active: true, desc: 'Values and spiritual state processor.' },
    { id: 'OmegaLayer', name: 'Ω-Layer', active: true, desc: 'Meta-system observer and correlator.' },
    { id: 'HealthSync', name: 'Health Metrics', active: false, desc: 'Biometric data synchronization (Sleep, Pulse).' },
    { id: 'CRM', name: 'Relations Engine', active: false, desc: 'Energetic effects of social interactions.' },
  ]);

  const toggleModule = (id: string, active: boolean) => {
    setModules(modules.map(m => m.id === id ? { ...m, active } : m));
    // In a real app, this would call an API to update `system_modules` in Supabase
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h2 className="text-3xl font-light text-white tracking-wide">System <span className="font-bold text-purple-400">Modules</span></h2>
        <p className="text-slate-400 mt-2">Manage feature flags and active engines for LifeOS.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map(m => (
          <GlassCard key={m.id} title={m.name}>
            <p className="text-sm text-slate-400 mb-6 min-h-[40px]">{m.desc}</p>
            <div className="pt-4 border-t border-white/5">
              <NeonToggle 
                label={m.active ? "Online" : "Offline"} 
                isActive={m.active} 
                onToggle={(val) => toggleModule(m.id, val)} 
              />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
