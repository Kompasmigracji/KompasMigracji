'use client';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const LEAD_RE = /\[\[LEAD:(\{[^}]*\})\]\]/;

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
  const [sessionId, setSessionId] = useState('');
  const [showBadge, setShowBadge] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const greetingMsg: Msg = { 
    id: 'greeting', 
    role: 'assistant', 
    content: t('chat_greeting_msg'),
    greeting: true 
  };

  useEffect(() => {
    const sid = localStorage.getItem('km_chat_session') || generateUUID();
    if (!localStorage.getItem('km_chat_session')) {
      localStorage.setItem('km_chat_session', sid);
    }
    setSessionId(sid);
    
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
      if (!isOpen && (!saved || JSON.parse(saved).length <= 1)) {
        setShowBadge(true);
      }
    }, 4500);
    
    return () => clearTimeout(tBadge);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length > 0 && messages[0].id !== 'greeting') {
      localStorage.setItem('km_chat_msgs', JSON.stringify(messages));
    }
    if (messages.length > 1 && !isOpen) {
      setHasUnread(true);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setShowBadge(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, messages]);

  const saveMessageToDb = async (msg: Msg) => {
    if (!supabase) return;
    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: msg.role,
        content: msg.content
      });
    } catch (err) {
      console.error('Failed to save message', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    setInput('');
    
    const userMsg: Msg = { id: generateUUID(), role: 'user', content: userText };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setIsLoading(true);
    
    await saveMessageToDb(userMsg);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs.map(m => ({ role: m.role, content: m.content })) })
      });
      
      const data = await res.json();
      let assistantContent = data.content || t('chat_error');
      
      const leadMatch = assistantContent.match(LEAD_RE);
      if (leadMatch) {
        try {
          const leadData = JSON.parse(leadMatch[1]);
          assistantContent = assistantContent.replace(LEAD_RE, '').trim();
          
          await fetch('/api/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...leadData, source: 'chatbot' })
          });
        } catch (e) {
          console.error('Lead parse error', e);
        }
      }
      
      const botMsg: Msg = { id: generateUUID(), role: 'assistant', content: assistantContent };
      setMessages(prev => [...prev, botMsg]);
      await saveMessageToDb(botMsg);
      
    } catch (err) {
      const errMsg: Msg = { id: generateUUID(), role: 'assistant', content: t('chat_error') };
      setMessages(prev => [...prev, errMsg]);
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer overflow-hidden group shadow-[0_0_20px_rgba(249,115,22,0.3)] border border-orange-500/30"
            style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}
          >
            <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_3s_infinite]" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 drop-shadow-md">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {(hasUnread || showBadge) && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-orange-600 animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-6 z-[60] w-[calc(100vw-48px)] sm:w-[350px] h-[500px] max-h-[calc(100vh-120px)] flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-[#111] border border-orange-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-gradient-to-r from-orange-600/10 to-transparent border-b border-orange-500/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Konsultant AI</div>
                  <div className="text-[10px] text-green-400 font-medium tracking-wide uppercase mt-0.5 animate-pulse">{t('chat_online')}</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {messages.map((m, i) => (
                <motion.div
                  key={m.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-sm shadow-lg' 
                      : 'bg-white/80 text-gray-800 rounded-bl-sm border border-black/5'
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
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/60 border border-black/5 rounded-2xl rounded-bl-sm px-4 py-4 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-black/10">
              <form
                onSubmit={e => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center bg-white/60 border border-black/10 rounded-2xl px-2 py-1.5 focus-within:border-orange-500/50 focus-within:bg-white/80 transition-all"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('ai_placeholder') || 'Напишіть повідомлення...'}
                  className="flex-1 bg-transparent border-none text-gray-900 text-sm px-3 py-2 resize-none max-h-24 focus:outline-none focus:ring-0 placeholder-gray-500"
                  rows={1}
                  style={{ minHeight: '36px', scrollbarWidth: 'none' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-gray-900 disabled:opacity-50 disabled:bg-gray-700 transition-all ml-1 shrink-0 hover:bg-orange-500"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
