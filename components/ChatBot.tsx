'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  greeting?: boolean;
}

export default function ChatBot() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const greetingMsg: Msg = {
    id: 'greeting',
    role: 'assistant',
    content: t('chat_greeting_msg'),
    greeting: true,
  };

  useEffect(() => {
    const saved = localStorage.getItem('km_chat_msgs');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (Array.isArray(p) && p.length > 0) setMessages(p);
        else setMessages([greetingMsg]);
      } catch {
        setMessages([greetingMsg]);
      }
    } else {
      setMessages([greetingMsg]);
    }
    const tBadge = setTimeout(() => {
      if (!isOpen) setShowBadge(true);
    }, 4500);
    return () => clearTimeout(tBadge);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('km_chat_msgs', JSON.stringify(messages));
    }
    if (messages.length > 1 && !isOpen) setHasUnread(true);
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setShowBadge(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 80);
    }
  }, [isOpen, messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    setInput('');
    const userMsg: Msg = { id: generateUUID(), role: 'user', content: userText };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const botMsg: Msg = {
        id: generateUUID(),
        role: 'assistant',
        content: data.content || t('chat_error'),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: generateUUID(), role: 'assistant', content: t('chat_error') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.08, boxShadow: '0 0 32px rgba(249,115,22,0.55)' }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsOpen(true)}
            aria-label="Відкрити чат"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-[0_8px_30px_rgba(249,115,22,0.4)] border border-orange-500/30"
            style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' }}
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping" style={{ animationDuration: '2.5s' }} />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 drop-shadow">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {(hasUnread || showBadge) && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse shadow" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.93 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed bottom-6 right-6 z-[60] w-[calc(100vw-24px)] sm:w-[370px] max-h-[calc(100vh-100px)] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f0f1a 100%)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* Header */}
            <div
              className="relative px-4 py-3 flex items-center justify-between shrink-0"
              style={{
                background: 'linear-gradient(90deg, rgba(234,88,12,0.18) 0%, rgba(249,115,22,0.08) 100%)',
                borderBottom: '1px solid rgba(249,115,22,0.2)',
              }}
            >
              {/* Decorative glow */}
              <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-orange-500/10 to-transparent pointer-events-none" />

              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}
                  >
                    {/* Robot/AI icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      <circle cx="9" cy="16" r="1" fill="white" stroke="none" />
                      <circle cx="15" cy="16" r="1" fill="white" stroke="none" />
                    </svg>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1a1a2e] shadow" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm tracking-wide">Konsultant AI</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">
                      {t('chat_online')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Clear chat */}
                <button
                  onClick={() => {
                    localStorage.removeItem('km_chat_msgs');
                    setMessages([greetingMsg]);
                  }}
                  title={t('chat_clear')}
                  aria-label={t('chat_clear')}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label={t('chat_close')}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', minHeight: 0, maxHeight: '380px' }}
            >
              {messages.map((m, i) => (
                <motion.div
                  key={m.id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {/* Avatar for assistant */}
                  {m.role === 'assistant' && (
                    <div
                      className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mb-0.5"
                      style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        <circle cx="9" cy="16" r="1" fill="white" stroke="none" />
                        <circle cx="15" cy="16" r="1" fill="white" stroke="none" />
                      </svg>
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'rounded-br-sm text-white'
                        : 'rounded-bl-sm text-white/90'
                    }`}
                    style={
                      m.role === 'user'
                        ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 16px rgba(249,115,22,0.3)' }
                        : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }
                    }
                  >
                    {m.content.split('\n').map((line, j, arr) => (
                      <span key={j}>
                        {line}
                        {j < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-end gap-2">
                  <div
                    className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div
                    className="rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {[0, 150, 300].map(delay => (
                      <span key={delay} className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Quick reply chips */}
            {messages.length <= 1 && !isLoading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {[
                  'Карта Побиту',
                  'Шукаю роботу',
                  'Потрібен адвокат',
                  'Консультація',
                ].map(chip => (
                  <button
                    key={chip}
                    onClick={() => {
                      setInput(chip);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full text-orange-300 border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/60 transition-all"
                    style={{ background: 'rgba(249,115,22,0.08)' }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              className="px-3 py-3 shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              <form
                onSubmit={e => { e.preventDefault(); handleSend(); }}
                className="relative flex items-end gap-2 rounded-xl p-1.5 transition-all focus-within:ring-1 focus-within:ring-orange-500/50"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('ai_placeholder') || 'Напишіть повідомлення...'}
                  className="flex-1 bg-transparent border-none text-white text-sm px-2 py-1.5 resize-none focus:outline-none focus:ring-0 placeholder-white/30"
                  rows={1}
                  style={{ minHeight: '36px', maxHeight: '80px', scrollbarWidth: 'none' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label={t('chat_send')}
                  className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={
                    input.trim() && !isLoading
                      ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }
                      : { background: 'rgba(255,255,255,0.1)' }
                  }
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
              <p className="text-center text-[10px] text-white/20 mt-2">Powered by Kompas AI · +48 729 271 848</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
