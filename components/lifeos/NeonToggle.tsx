// components/lifeos/NeonToggle.tsx
'use client';
import React from 'react';

export function NeonToggle({ isActive, onToggle, label }: { isActive: boolean, onToggle: (val: boolean) => void, label: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-slate-200 font-medium">{label}</span>
      <button 
        onClick={() => onToggle(!isActive)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isActive ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isActive ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
