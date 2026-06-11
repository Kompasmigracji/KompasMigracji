'use client';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const GREETING = 'Привіт! Я AI-асистент Kompas Migracji 👋\n\nДопоможу з питаннями про Карту побуту, легалізацію та наші послуги.\n\nОберіть тему або напишіть своє питання:';
const LEAD_RE = /\[\[LEAD:(\{[^}]*\})\]\]/;

interface Msg { 
  id: string;
  role: 'user' | 'assistant'; 
  content: string; 
  greeting?: boolean; 
}

const styles = {
  container: { position: 'fixed' as const, bottom: 24, right: 24, zIndex: 9998 },
  chatButton: { 
    width: 58, 
    height: 58, 
    borderRadius: '50%', 
    border: 'none', 
    cursor: 'pointer', 
    background: 'linear-gradient(135deg, #f97316, #ea580c)', 
    boxShadow: '0 4px 20px rgba(249,115,22,0.45)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  badge: { position: 'absolute' as const, top: 4, right: 4, width: 12, height: 12, borderRadius: '50%', background: '#22c55e', border: '2px solid #fff', animation: 'km-ping 2s ease-in-out infinite' },
  chatWindow: { 
    position: 'fixed' as const, 
    bottom: 96, 
    right: 24, 
    zIndex: 9999, 
    width: 'min(370px, calc(100vw - 32px))', 
    height: 'min(540px, calc(100vh - 120px))', 
    background: '#f8fafc', 
    borderRadius: 18, 
    boxShadow: '0 8px 40px rgba(0,0,0,0.18)', 
    display: 'flex', 
    flexDirection: 'column' as const, 
    overflow: 'hidden', 
    animation: 'km-fade-in 0.22s ease-out', 
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  header: { background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  avatar: { width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  headerText: { flex: 1 },
  title: { color: '#f1f5f9', fontWeight: 700, fontSize: 14 },
  status: { color: '#94a3b8', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 },
  statusDot: { width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' },
  closeButton: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748b' },
  messagesContainer: { flex: 1, overflowY: 'auto' as const, padding: '16px 14px 8px', scrollbarWidth: 'thin' as const, scrollbarColor: '#e2e8f0 transparent' as const },
  bubble: (isUser: boolean) => ({ 
    display: 'flex', 
    justifyContent: isUser ? 'flex-end' : 'flex-start', 
    marginBottom: 10 
  }),
  bubbleContent: (isUser: boolean) => ({ 
    maxWidth: '78%', 
    padding: '10px 14px', 
    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px', 
    background: isUser ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#fff', 
    color: isUser ? '#fff' : '#1e293b', 
    fontSize: 13, 
    lineHeight: 1.55, 
    whiteSpace: 'pre-wrap' as const, 
    boxShadow: isUser ? 'none' : '0 1px 3px rgba(0,0,0,0.08)', 
    border: isUser ? 'none' : '1px solid #e2e8f0'
  }),
  inputArea: { padding: '10px 12px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 },
  textarea: { flex: 1, border: '1px solid #e2e8f0', borderRadius: 12, padding: '9px 12px', fontSize: 13, lineHeight: 1.5, resize: 'none' as const, outline: 'none', fontFamily: 'inherit', background: '#f8fafc', color: '#1e293b', maxHeight: 90, overflowY: 'auto' as const },
  sendButton: (disabled: boolean) => ({ 
    width: 38, 
    height: 38, 
    borderRadius: '50%', 
    border: 'none', 
    cursor: 'pointer', 
    background: disabled ? '#e2e8f0' : 'linear-gradient(135deg, #f97316, #ea580c)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    flexShrink: 0, 
    transition: 'background 0.15s'
  }),
  footer: { textAlign: 'center' as const, fontSize: 10, color: '#94a3b8', padding: '4px 0 8px', background: '#fff' },
  typingContainer: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  typingDot: (delay: number) => ({ 
    width: 7, 
    height: 7, 
    borderRadius: '50%', 
    background: '#94a3b8', 
    display: 'block', 
    animation: 'km-bounce 1.2s ease-in-out infinite', 
    animationDelay: `${delay * 0.2}s`
  }),
};

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={styles.bubble(isUser)}>
      {!isUser && <div style={styles.avatar}>🧭</div>}
      <div style={styles.bubbleContent(isUser)}>
        {msg.content}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={styles.typingContainer}>
      <div style={styles.avatar}>🧭</div>
      <div style={{ padding: '10px 16px', background: '#fff', borderRadius: '18px 18px 18px 4px', border: '1px solid #e2e8f0', display: 'flex', gap: 5, alignItems: 'center' }}>
        {[0, 1, 2].map(i => <span key={`dot-${i}`} style={styles.typingDot(i)} />)}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ id: 'greeting', role: 'assistant', content: GREETING, greeting: true }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageCountRef = useRef(0);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { if (open) { setHasNew(false); setTimeout(() => inputRef.current?.focus(), 100); } }, [open]);

  const sendText = async (text: string, currentMessages: Msg[]) => {
    const messageId = `msg-${Date.now()}-${messageCountRef.current++}`;
    const history: Msg[] = [...currentMessages, { id: messageId, role: 'user', content: text }];
    setMessages(history);
    setLoading(true);
    try {
      const apiMessages = history.filter(m => !m.greeting).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: apiMessages }) });
      const data = await res.json();
      let content = data.content || 'Вибачте, сталася помилка. Спробуйте пізніше.';
      const match = content.match(LEAD_RE);
      if (match) {
        try {
          const lead = JSON.parse(match[1]);
          if (supabase && lead.name && lead.phone) {
            await supabase.from('leads').insert({
              first_name: lead.name,
              contact: lead.phone,
              situation: 'Заявка через AI-чат',
            });
          }
        } catch (err) {
          console.error('Failed to save lead:', err);
        }
        content = content.replace(LEAD_RE, '').replace(/\n{3,}/g, '\n\n').trim();
      }
      const assistantId = `msg-${Date.now()}-${messageCountRef.current++}`;
      setMessages([...history, { id: assistantId, role: 'assistant', content }]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorId = `msg-${Date.now()}-${messageCountRef.current++}`;
      setMessages([...history, { id: errorId, role: 'assistant', content: 'Вибачте, сталася помилка. Спробуйте пізніше або напишіть нам у WhatsApp.' }]);
    }
    setLoading(false);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    await sendText(text, messages);
  };

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      <style>{`
        @keyframes km-bounce { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-5px);opacity:1} }
        @keyframes km-fade-in { from{opacity:0;transform:translateY(16px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes km-ping { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.7} }
      `}</style>

      <div style={styles.container}>
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Відкрити чат"
          style={styles.chatButton}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {open
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          }
          {hasNew && !open && <span style={styles.badge} />}
        </button>

        {open && (
          <div style={styles.chatWindow}>
            <div style={styles.header}>
              <div style={styles.avatar}>🧭</div>
              <div style={styles.headerText}>
                <div style={styles.title}>Kompas AI</div>
                <div style={styles.status}>
                  <span style={styles.statusDot} />
                  Онлайн · Відповідає одразу
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={styles.closeButton} aria-label="Закрити чат">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={styles.messagesContainer}>
              {messages.map((msg) => <Bubble key={msg.id} msg={msg} />)}
              {loading && <TypingDots />}
              {messages.length === 1 && !loading && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {[
                    '🚨 Загрожує депортація',
                    '📋 Карта побуту',
                    '💰 Скільки коштує?',
                    '📅 Записатися',
                  ].map(chip => (
                    <button
                      key={chip}
                      onClick={() => { if (!loading) sendText(chip, messages); }}
                      style={{
                        padding: '6px 12px', borderRadius: 20, border: '1.5px solid #e2e8f0',
                        background: '#f8fafc', color: '#1e293b', fontSize: 12, cursor: 'pointer',
                        fontFamily: 'inherit', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#f97316'; (e.currentTarget as HTMLButtonElement).style.background = '#fff7ed'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'; }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div style={styles.inputArea}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Напишіть питання..."
                rows={1}
                style={styles.textarea}
                onInput={e => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 90) + 'px'; }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                style={styles.sendButton(!input.trim() || loading)}
                aria-label="Відправити повідомлення"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? '#fff' : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <div style={styles.footer}>
              Powered by Claude AI · Kompas Migracji
            </div>
          </div>
        )}
      </div>
    </>
  );
}
