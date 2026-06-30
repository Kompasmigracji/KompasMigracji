'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function AIAssistantIntake() {
  const t = useTranslations();
  const QUICK_REPLIES = [
    t('ai_quick_1'),
    t('ai_quick_2'),
    t('ai_quick_3'),
    t('ai_quick_4')
  ];

  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: t('ai_greeting') }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadCreated, setLeadCreated] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next: Msg[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      let content: string = data.content || t('ai_error');

      const leadMatch = content.match(/\[\[LEAD:(\{.*?\})\]\]/);
      if (leadMatch) {
        try {
          const lead = JSON.parse(leadMatch[1]);
          content = content.replace(/\[\[LEAD:.*?\]\]\n?/, '').trim();
          fetch('/api/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...lead, source: 'ai-intake-page' }),
          }).catch(() => {});
          setLeadCreated(true);
        } catch { /* ignore parse errors */ }
      }

      setMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: t('ai_no_conn') }]);
    }
    setLoading(false);
  }, [messages, loading]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 h-[calc(100vh-120px)] min-h-[600px] max-h-[900px]">
        
        {/* Left sidebar - Branding & Instructions */}
        <div className="hidden lg:flex flex-col w-1/3 p-10 relative overflow-hidden bg-[#0f172a]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-blue-900 opacity-90 z-0"></div>
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none z-0 text-white">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/>
            </svg>
          </div>
          
          <div className="relative z-10 flex flex-col h-full text-white">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1">
                <Image src="/logo.svg" alt="Kompas Migracji" width={32} height={32} className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight m-0 text-white">Kompas Migracji</h2>
                <span className="text-blue-300 text-xs font-semibold uppercase tracking-wider">AI Intake System</span>
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-serif font-light mb-6 leading-tight text-white">
                {t('ai_title_1')} <span className="text-orange-400 font-medium">{t('ai_title_2')}</span>
              </h1>
              <p className="text-gray-300 mb-8 leading-relaxed text-sm">
                {t('ai_desc')}
              </p>
              
              <ul className="space-y-5">
                {[
                  { icon: '🔒', title: t('ai_f1_title'), desc: t('ai_f1_desc') },
                  { icon: '⚡', title: t('ai_f2_title'), desc: t('ai_f2_desc') },
                  { icon: '⚖️', title: t('ai_f3_title'), desc: t('ai_f3_desc') }
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
                    <span className="text-2xl mt-1">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="relative w-10 h-10 rounded-full border-2 border-[#0f172a] bg-gray-200 overflow-hidden"><Image src="/team/user1.jpg" alt="" fill className="object-cover" /></div>
                  <div className="relative w-10 h-10 rounded-full border-2 border-[#0f172a] bg-gray-300 overflow-hidden"><Image src="/team/user2.jpg" alt="" fill className="object-cover" /></div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-orange-500 flex items-center justify-center text-xs font-bold text-white">+3k</div>
                </div>
                <div className="text-xs text-gray-300">
                  <strong className="text-white block text-sm">{t('ai_stat_1')}</strong>
                  {t('ai_stat_2')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Chat interface */}
        <div className="flex-1 flex flex-col h-full bg-white relative">
          
          {/* Header Mobile / Chat Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center text-white text-xl shadow-md">
                🧭
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] text-sm lg:text-base m-0">{t('ai_name')}</h3>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t('ai_online')}
                </div>
              </div>
            </div>
            
            {leadCreated && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {t('ai_lead_ok')}
              </span>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user';
              return (
                <div key={i} className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center text-white text-sm shrink-0 shadow-sm">
                      🧭
                    </div>
                  )}
                  <div className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
                    ${isUser 
                      ? 'bg-[#0f172a] text-white rounded-br-sm' 
                      : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm whitespace-pre-wrap'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex items-end gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center text-white text-sm shrink-0 shadow-sm">
                  🧭
                </div>
                <div className="bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} className="h-1" />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && !loading && (
            <div className="px-6 pb-2 flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSend(reply)}
                  className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-full text-sm font-medium transition-colors cursor-pointer"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
            <div className="relative flex items-center shadow-sm border border-gray-200 rounded-2xl bg-gray-50 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition-all overflow-hidden p-1.5">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                disabled={loading || leadCreated}
                placeholder={leadCreated ? t('ai_sent') : t('ai_placeholder')}
                className="w-full bg-transparent border-0 focus:ring-0 resize-none py-3 px-4 text-gray-700 text-base max-h-32 min-h-[56px] disabled:opacity-50 outline-none"
                rows={1}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || loading || leadCreated}
                className="absolute right-2.5 bottom-2.5 w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed border-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <div className="text-center mt-3 text-xs text-gray-400">
              {t('ai_policy')}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
