// app/architect/ai/page.tsx
'use client';
import React, { useState } from 'react';
import { GlassCard } from '@/components/lifeos/GlassCard';

export default function AIPage() {
  const [messages, setMessages] = useState([
    { role: 'agent', content: 'Greetings, Architect. I am ALEX-DIGITAL. Fate and Soul engines are online. How shall we direct the trajectory today?' }
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
        body: JSON.stringify({ mode: 'strategist', message: userMsg })
      });
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'agent', content: data.reply }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'agent', content: '[Error] Neural link disrupted.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Generate Daily Plan', msg: 'Analyze my tasks and generate a daily plan.' },
    { label: 'Rebuild Goals', msg: 'Let us re-evaluate my long-term goals.' },
    { label: 'Spiritual Review', msg: 'Run a spiritual resonance check via SoulEngine.' }
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-6">
        <h2 className="text-3xl font-light text-white tracking-wide"><span className="font-bold text-cyan-400">ALEX-DIGITAL</span> Core</h2>
        <p className="text-slate-400 mt-2">Central AI interpreter and system orchestrator.</p>
      </header>

      <GlassCard className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.role === 'user' 
                  ? 'bg-cyan-600/20 text-cyan-50 border border-cyan-500/30' 
                  : 'bg-purple-900/20 text-purple-50 border border-purple-500/30'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl px-5 py-3 flex gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map(action => (
              <button 
                key={action.label}
                onClick={() => { setInput(action.msg); setTimeout(() => sendMessage(), 50); }}
                className="whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full bg-cyan-900/30 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
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
              placeholder="Command ALEX-DIGITAL..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-medium hover:from-cyan-500 hover:to-purple-500 disabled:opacity-50 transition-all"
            >
              Send
            </button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}
