'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

type Msg = { role: 'user' | 'assistant'; content: string };

const GREETING = 'Привіт! 👋 Я AI-асистент Kompas Migracji.\n\nРозкажіть про вашу ситуацію — допоможу розібратись з легалізацією в Польщі або підберу потрібну послугу.';

const QUICK = ['Карта побуту', 'PESEL / NFZ', 'Ціни на послуги', 'Записатись на консультацію'];

export default function KompasAI() {
  const [shown,    setShown]    = useState(false);
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: GREETING }]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 5000 + Math.random() * 5000);

    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setShown(true);
      setOpen(true);
      const serviceName = customEvent.detail;
      if (serviceName) {
        setMessages([
          { role: 'assistant', content: `Привіт! 👋 Я AI-асистент Kompas Migracji.\n\nБачу, вас цікавить послуга «${serviceName}». Які у вас є питання або чим я можу допомогти?` }
        ]);
      }
    };
    
    window.addEventListener('OPEN_AI_CHAT', handleOpenChat);

    return () => {
      clearTimeout(t);
      window.removeEventListener('OPEN_AI_CHAT', handleOpenChat);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  const doSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next: Msg[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res  = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      let content: string = data.content || 'Вибачте, сталася помилка. Напишіть нам у WhatsApp: +48 729 271 848';

      const leadMatch = content.match(/\[\[LEAD:(\{.*?\})\]\]/);
      if (leadMatch) {
        try {
          const lead = JSON.parse(leadMatch[1]);
          content = content.replace(/\[\[LEAD:.*?\]\]\n?/, '').trim();
          fetch('/api/lead', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ ...lead, source: 'chat-ai' }),
          }).catch(() => {});
        } catch { /* ignore parse errors */ }
      }

      setMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Немає підключення. Напишіть нам у WhatsApp: +48 729 271 848' }]);
    }
    setLoading(false);
  }, [messages, loading]);

  if (!shown) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-5 sm:right-8 z-50 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer overflow-hidden group shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-blue-500/30"
            style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' }}
          >
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full border-[2px] border-blue-400 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
            
            {/* Shimmer */}
            <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite]" />
            
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 drop-shadow-md">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <circle cx="9" cy="10" r="1" fill="white"></circle>
              <circle cx="15" cy="10" r="1" fill="white"></circle>
            </svg>
            
            {/* Notification Dot */}
            {messages.length === 1 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-blue-900 animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[60] w-[calc(100vw-40px)] sm:w-[380px] h-[600px] max-h-[calc(100vh-40px)] flex flex-col rounded-3xl overflow-hidden bg-[#0f1115]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0f1115]" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Kompas AI</div>
                  <div className="text-xs text-blue-400 font-medium tracking-wide uppercase mt-0.5 animate-pulse">Online</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm shadow-lg' 
                      : 'bg-white/10 text-gray-100 rounded-bl-sm border border-white/5'
                  }`}>
                    {m.content.split('\n').map((line, j) => (
                      <span key={j}>
                        {line}
                        {j !== m.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-4 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} className="h-1" />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {QUICK.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => doSend(q)}
                    className="px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium hover:bg-blue-500/20 transition-colors whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-[#0a0a0a] border-t border-white/10">
              <form
                onSubmit={e => { e.preventDefault(); doSend(input); }}
                className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-2 py-1 focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(input); }
                  }}
                  placeholder="Напишіть повідомлення..."
                  className="flex-1 bg-transparent border-none text-white text-sm px-3 py-2.5 resize-none max-h-32 focus:outline-none focus:ring-0 placeholder-gray-500"
                  rows={1}
                  style={{ minHeight: '40px', scrollbarWidth: 'none' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white disabled:opacity-50 disabled:bg-gray-600 transition-all ml-1 shrink-0 hover:scale-105"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </form>
              <div className="text-center mt-2 text-[10px] text-gray-500 font-medium">
                Kompas AI 2.0 ⚡
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
