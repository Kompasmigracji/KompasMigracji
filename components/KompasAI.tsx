'use client';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const LEAD_RE = /\[\[LEAD:(\{[^}]+\})\]\]/;

export default function KompasAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'Вітаю! Я AI-асистент Kompas Migracji 🧭\n\nДопомагаю з питаннями легалізації в Польщі. Запитуйте!'
      }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      let content: string = data.content || 'Вибачте, сталася помилка. Спробуйте ще раз.';

      const match = LEAD_RE.exec(content);
      if (match) {
        try {
          const lead = JSON.parse(match[1]);
          if (supabase) {
            try { await supabase.from('leads').insert({ ...lead, source: 'ai_chat' }); } catch {}
          }
        } catch {}
        content = content.replace(LEAD_RE, '').trim();
      }

      setMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Помилка підключення. Спробуйте пізніше.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-btn text-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        aria-label={open ? 'Закрити чат' : 'Відкрити AI-асистент'}
      >
        {open ? '✕' : '🧭'}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ width: 'min(384px, calc(100vw - 48px))', height: 440 }}
        >
          <div className="gradient-btn px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <span className="text-white text-lg">🧭</span>
            <div>
              <div className="text-white font-semibold text-sm">Kompas AI</div>
              <div className="text-white/70 text-xs">Асистент з питань легалізації</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-navy border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-xl rounded-bl-none px-3 py-2 text-sm text-gray-400 shadow-sm">
                  •••
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-gray-100 bg-white flex gap-2 flex-shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Напишіть питання..."
              className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
              disabled={loading}
              autoFocus
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="gradient-btn text-white px-3 py-2 rounded-lg text-sm disabled:opacity-40 transition-opacity"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
