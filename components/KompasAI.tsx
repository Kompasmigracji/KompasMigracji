'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

const GREETING = 'Привіт! 👋 Я AI-асистент Kompas Migracji.\n\nРозкажіть про вашу ситуацію — допоможу розібратись з легалізацією в Польщі або підберу потрібну послугу.';

const QUICK = ['Карта побуту', 'PESEL / NFZ', 'Ціни на послуги', 'Записатись на консультацію'];

const ORANGE = '#f97316';
const NAVY   = '#0f172a';

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
    return () => clearTimeout(t);
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
      <style>{`
        @keyframes kai-in    { from{opacity:0;transform:scale(0.6) translateY(10px)} to{opacity:1;transform:none} }
        @keyframes kai-panel { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:none} }
        @keyframes kai-pulse { 0%,100%{box-shadow:0 4px 20px rgba(249,115,22,0.5)} 60%{box-shadow:0 4px 20px rgba(249,115,22,0.5),0 0 0 12px rgba(249,115,22,0)} }
        @keyframes kai-dot   { 0%,80%,100%{opacity:0.2} 40%{opacity:1} }
        .kai-btn   { animation: kai-in 0.4s cubic-bezier(0.22,1,0.36,1) both, kai-pulse 2.5s 1.5s infinite; }
        .kai-panel { animation: kai-panel 0.3s cubic-bezier(0.22,1,0.36,1) both; }
        .kai-d1    { animation: kai-dot 1.4s infinite; }
        .kai-d2    { animation: kai-dot 1.4s 0.2s infinite; }
        .kai-d3    { animation: kai-dot 1.4s 0.4s infinite; }
        .kai-scroll::-webkit-scrollbar       { width:4px; }
        .kai-scroll::-webkit-scrollbar-track { background:transparent; }
        .kai-scroll::-webkit-scrollbar-thumb { background:#1e293b; border-radius:4px; }
        .kai-chip:hover { background:rgba(249,115,22,0.18) !important; }
        .kai-close:hover { color:#fff !important; }
      `}</style>

      {/* Floating compass button */}
      {!open && (
        <button
          className="kai-btn"
          onClick={() => setOpen(true)}
          aria-label="Kompas AI — відкрити чат"
          style={{
            position:'fixed', bottom:24, right:24, zIndex:9997,
            width:60, height:60, borderRadius:'50%',
            background:'linear-gradient(135deg,#f97316,#ea580c)',
            border:'none', cursor:'pointer', fontSize:26,
          }}
        >🧭</button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="kai-panel"
          style={{
            position:'fixed', bottom:24, right:24, zIndex:9997,
            width:'min(360px,calc(100vw - 32px))',
            height:'min(540px,calc(100vh - 48px))',
            background:NAVY, borderRadius:20,
            border:'1px solid rgba(249,115,22,0.25)',
            boxShadow:'0 16px 56px rgba(0,0,0,0.6)',
            display:'flex', flexDirection:'column', overflow:'hidden',
            fontFamily:"'Syne',sans-serif",
          }}
        >
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 15px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(249,115,22,0.07)', flexShrink:0 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#f97316,#ea580c)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>
              🧭
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:800, color:ORANGE, letterSpacing:'0.1em', textTransform:'uppercase', lineHeight:1.2 }}>Kompas AI</div>
              <div style={{ fontSize:10, color:'#10b981', display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:'#10b981', display:'inline-block' }}/>
                Онлайн · відповідає одразу
              </div>
            </div>
            <button
              className="kai-close"
              onClick={() => setOpen(false)}
              style={{ background:'none', border:'none', color:'#334155', fontSize:19, cursor:'pointer', lineHeight:1, padding:'2px 4px', transition:'color 0.15s' }}
            >✕</button>
          </div>

          {/* Messages */}
          <div className="kai-scroll" style={{ flex:1, overflowY:'auto', padding:'14px 12px', display:'flex', flexDirection:'column', gap:10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display:'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems:'flex-end', gap:6 }}>
                {msg.role === 'assistant' && (
                  <span style={{ fontSize:15, flexShrink:0, marginBottom:2 }}>🧭</span>
                )}
                <div style={{
                  maxWidth:'78%', padding:'10px 13px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? ORANGE : '#1e293b',
                  color: msg.role === 'user' ? '#fff' : '#e2e8f0',
                  fontSize:13, lineHeight:1.65,
                  whiteSpace:'pre-wrap', wordBreak:'break-word',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display:'flex', alignItems:'flex-end', gap:6 }}>
                <span style={{ fontSize:15, flexShrink:0 }}>🧭</span>
                <div style={{ padding:'12px 15px', borderRadius:'16px 16px 16px 4px', background:'#1e293b', display:'flex', gap:5, alignItems:'center' }}>
                  <span className="kai-d1" style={{ width:6, height:6, borderRadius:'50%', background:'#64748b', display:'inline-block' }}/>
                  <span className="kai-d2" style={{ width:6, height:6, borderRadius:'50%', background:'#64748b', display:'inline-block' }}/>
                  <span className="kai-d3" style={{ width:6, height:6, borderRadius:'50%', background:'#64748b', display:'inline-block' }}/>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick chips — only at start */}
          {messages.length === 1 && !loading && (
            <div style={{ padding:'0 12px 10px', display:'flex', gap:6, flexWrap:'wrap', flexShrink:0 }}>
              {QUICK.map(q => (
                <button
                  key={q}
                  className="kai-chip"
                  onClick={() => doSend(q)}
                  style={{ padding:'6px 12px', borderRadius:20, border:`1px solid rgba(249,115,22,0.3)`, background:'rgba(249,115,22,0.08)', color:ORANGE, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', transition:'background 0.15s' }}
                >{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:8, alignItems:'flex-end', flexShrink:0 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(input); } }}
              placeholder="Напишіть питання..."
              rows={1}
              style={{ flex:1, background:'#1e293b', border:'1.5px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 13px', color:'#e2e8f0', fontSize:13, fontFamily:'inherit', resize:'none', outline:'none', lineHeight:1.5, maxHeight:80, overflowY:'auto' }}
            />
            <button
              onClick={() => doSend(input)}
              disabled={loading || !input.trim()}
              style={{ width:40, height:40, borderRadius:10, border:'none', flexShrink:0, background: loading || !input.trim() ? '#1e293b' : ORANGE, cursor: loading || !input.trim() ? 'default' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.15s' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={loading || !input.trim() ? '#334155' : '#fff'} strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
