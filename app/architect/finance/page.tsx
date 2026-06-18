'use client';
import React, { useState } from 'react';
import { GlassCard } from '@/components/lifeos/GlassCard';

export default function FinanceCFOPage() {
  const [messages, setMessages] = useState([
    { role: 'agent', content: 'Greetings, Architect. I am the CFO LLM persona. The OmegaLayer is analyzing Academy transactions. Awaiting your financial directives.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'cfo_analyst', message: userMsg })
      });
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'agent', content: data.reply }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'agent', content: '[Error] Financial link disrupted.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Analyze Revenue', msg: 'Analyze recent Academy transactions and provide a revenue summary.' },
    { label: 'Pricing Strategy', msg: 'Suggest a monetization strategy for the new advanced courses.' },
    { label: 'Forecast', msg: 'Provide a 30-day revenue forecast based on current conversion rates.' }
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-6">
        <h2 className="text-3xl font-light text-white tracking-wide"><span className="font-bold text-emerald-400">CFO LLM</span> Terminal</h2>
        <p className="text-slate-400 mt-2">Financial Intelligence & Academy Monetization Tracker.</p>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-sm text-slate-400 mb-1">Total Revenue (Mock)</div>
          <div className="text-2xl font-bold text-white">$450.00</div>
          <div className="text-xs text-emerald-400 mt-1">+12% this week</div>
        </GlassCard>
        <GlassCard className="p-4 border-l-4 border-l-cyan-500">
          <div className="text-sm text-slate-400 mb-1">Active Subscriptions</div>
          <div className="text-2xl font-bold text-white">24</div>
          <div className="text-xs text-cyan-400 mt-1">4 new today</div>
        </GlassCard>
        <GlassCard className="p-4 border-l-4 border-l-purple-500">
          <div className="text-sm text-slate-400 mb-1">Conversion Rate</div>
          <div className="text-2xl font-bold text-white">12.5%</div>
          <div className="text-xs text-purple-400 mt-1">Target: 15%</div>
        </GlassCard>
      </div>

      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden border-emerald-500/20">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.role === 'user' 
                  ? 'bg-emerald-600/20 text-emerald-50 border border-emerald-500/30' 
                  : 'bg-black/40 text-slate-200 border border-emerald-500/20'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-black/40 border border-emerald-500/20 rounded-2xl px-5 py-3 flex gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-emerald-500/20 bg-black/40">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map(action => (
              <button 
                key={action.label}
                onClick={() => { setInput(action.msg); setTimeout(() => sendMessage(), 50); }}
                className="whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
          
          <form onSubmit={sendMessage} className="flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Query CFO LLM..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 rounded-lg bg-emerald-600/80 text-white font-medium hover:bg-emerald-500 disabled:opacity-50 transition-all"
            >
              Analyze
            </button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}
