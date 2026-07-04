// components/lifeos/GlassCard.tsx
import React from 'react';

export function GlassCard({ children, title, className = '' }: { children: React.ReactNode, title?: string, className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-900/40 backdrop-blur-md border border-black/10 shadow-2xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/20 ${className}`}>
      {/* Subtle neon glow on top edge */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
      
      {title && (
        <div className="px-6 py-4 border-b border-black/5">
          <h3 className="text-lg font-medium text-cyan-50 tracking-wide">{title}</h3>
        </div>
      )}
      <div className="p-6 text-slate-300">
        {children}
      </div>
    </div>
  );
}
