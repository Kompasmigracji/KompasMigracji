// app/architect/layout.tsx
import React from 'react';
import Link from 'next/link';
import '../globals.css';

export const metadata = {
  title: 'LifeOS | Architect Panel',
  description: 'Grand Architect Control Center',
};

export default function ArchitectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050510] text-slate-300 font-sans selection:bg-cyan-500/30">
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[150px]"></div>
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-[#0a0a16]/80 backdrop-blur-xl flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent tracking-widest">
              LIFE OS
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Architect Console</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <NavItem href="/architect" icon="⚡" label="System State" />
            <NavItem href="/architect/modules" icon="🧩" label="Modules" />
            <NavItem href="/architect/ai" icon="🧠" label="ALEX-DIGITAL" />
            <NavItem href="/architect/finance" icon="🏦" label="CFO LLM" />
            <NavItem href="/architect/logs" icon="📜" label="Logs & Events" />
            <NavItem href="/architect/settings" icon="⚙️" label="Configuration" />
          </nav>
          
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4] animate-pulse"></div>
              <span className="text-sm font-medium text-cyan-500">Ω-Mode Active</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string, icon: string, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 hover:text-cyan-400 group">
      <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
      {label}
    </Link>
  );
}
