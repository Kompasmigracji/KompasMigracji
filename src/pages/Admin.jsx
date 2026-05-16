import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const ADMIN_KEY = 'km_admin_auth';

const STATUS = {
  new:       { label: 'Новий',       color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  contacted: { label: 'Контакт',     color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  closed:    { label: 'Закрито',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  dropped:   { label: 'Відмова',     color: '#64748b', bg: 'rgba(100,116,139,0.12)'},
};

const URGENCY_COLOR = {
  '🔥 Горить — треба вже': '#ef4444',
  '📅 1–3 місяці':         '#f97316',
  '🗓 Готуюсь на майбутнє':'#3b82f6',
  '🤔 Поки прицінююсь':   '#64748b',
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.new;
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
      textTransform: 'uppercase', padding: '3px 9px', borderRadius: 6,
      background: s.bg, color: s.color, whiteSpace: 'nowrap',
    }}>{s.label}</span>
  );
}

function StatusSelector({ lead, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const change = async (newStatus) => {
    setSaving(true);
    setOpen(false);
    await supabase.from('leads').update({ status: newStatus }).eq('id', lead.id);
    onUpdate(lead.id, newStatus);
    setSaving(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={saving}
        style={{
          background: 'none', border: '1px solid #334155', borderRadius: 8,
          padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <StatusBadge status={lead.status || 'new'} />
        <span style={{ color: '#64748b', fontSize: 10 }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '110%', right: 0, zIndex: 99,
          background: '#1e293b', border: '1px solid #334155', borderRadius: 10,
          overflow: 'hidden', minWidth: 130, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {Object.entries(STATUS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => change(key)}
              style={{
                width: '100%', padding: '9px 14px', background: 'none',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                color: val.color, fontSize: 12, fontWeight: 700,
                borderBottom: '1px solid #0f172a',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = val.bg}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {val.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const isTgLead = !!lead.chat_id;
  const name = lead.first_name || lead.name || '—';
  const urgColor = URGENCY_COLOR[lead.urgency] || '#64748b';
  const date = new Date(lead.created_at);

  return (
    <div style={{
      background: '#1e293b', borderRadius: 14, padding: '18px 20px',
      border: `1px solid ${(lead.status === 'new' || !lead.status) ? 'rgba(249,115,22,0.2)' : '#1e293b'}`,
      transition: 'border-color 0.2s',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: isTgLead ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : 'linear-gradient(135deg,#f97316,#ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: '#fff',
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{name}</span>
              {lead.username && (
                <a
                  href={`https://t.me/${lead.username}`}
                  target="_blank" rel="noreferrer"
                  style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none' }}
                >@{lead.username}</a>
              )}
              {isTgLead && (
                <span style={{ fontSize: 10, background: 'rgba(59,130,246,0.12)', color: '#3b82f6', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>
                  TG Bot
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
              {date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              {' '}
              {date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        <StatusSelector lead={lead} onUpdate={onUpdate} />
      </div>

      {/* Tags row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {lead.country && (
          <span style={{ fontSize: 11, background: '#0f172a', color: '#94a3b8', padding: '3px 9px', borderRadius: 6, fontWeight: 600 }}>
            {lead.country}
          </span>
        )}
        {lead.service && (
          <span style={{ fontSize: 11, background: '#0f172a', color: '#a78bfa', padding: '3px 9px', borderRadius: 6, fontWeight: 600 }}>
            {lead.service}
          </span>
        )}
        {lead.urgency && (
          <span style={{ fontSize: 11, background: `${urgColor}15`, color: urgColor, padding: '3px 9px', borderRadius: 6, fontWeight: 700 }}>
            {lead.urgency}
          </span>
        )}
      </div>

      {/* Situation */}
      {(lead.situation || lead.message) && (
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            {expanded
              ? (lead.situation || lead.message)
              : (lead.situation || lead.message || '').slice(0, 160) + ((lead.situation || lead.message || '').length > 160 ? '...' : '')}
          </p>
          {(lead.situation || lead.message || '').length > 160 && (
            <button onClick={() => setExpanded(e => !e)} style={{
              background: 'none', border: 'none', color: '#f97316', fontSize: 12,
              cursor: 'pointer', padding: '4px 0', fontWeight: 600,
            }}>
              {expanded ? 'Згорнути ↑' : 'Читати далі ↓'}
            </button>
          )}
        </div>
      )}

      {/* Contact row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {lead.contact && (
          <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>📞 {lead.contact}</span>
        )}
        {lead.phone && (
          <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
            style={{ fontSize: 13, color: '#25d366', textDecoration: 'none', fontWeight: 600 }}>
            📞 {lead.phone}
          </a>
        )}
        {lead.chat_id && (
          <a href={`tg://user?id=${lead.chat_id}`}
            style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
            ✉️ Написати в Telegram
          </a>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed]   = useState(sessionStorage.getItem(ADMIN_KEY) === '1');
  const [pwd, setPwd]         = useState('');
  const [leads, setLeads]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');

  const load = useCallback(() => {
    if (!supabase) { setError('Supabase не підключений'); setLoading(false); return; }
    setLoading(true);
    supabase.from('leads').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setLeads(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  const updateStatus = (id, status) =>
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l));

  // Stats
  const stats = {
    total:     leads.length,
    new:       leads.filter(l => !l.status || l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    closed:    leads.filter(l => l.status === 'closed').length,
    dropped:   leads.filter(l => l.status === 'dropped').length,
  };

  // Filter + search
  const visible = leads
    .filter(l => filter === 'all' || (l.status || 'new') === filter)
    .filter(l => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (l.first_name || l.name || '').toLowerCase().includes(q) ||
        (l.username || '').toLowerCase().includes(q) ||
        (l.country  || '').toLowerCase().includes(q) ||
        (l.service  || '').toLowerCase().includes(q) ||
        (l.contact  || l.phone || '').toLowerCase().includes(q) ||
        (l.situation || l.message || '').toLowerCase().includes(q)
      );
    });

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (pwd === (import.meta.env.VITE_ADMIN_PASSWORD || 'kompas2026')) {
              sessionStorage.setItem(ADMIN_KEY, '1');
              setAuthed(true);
            } else { setPwd(''); alert('Невірний пароль'); }
          }}
          style={{ background: '#1e293b', padding: '36px', borderRadius: 18, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 300 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🧭</div>
            <p style={{ color: '#f97316', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 4px' }}>Kompas Migracji</p>
            <p style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 20, margin: 0 }}>Адмін-панель</p>
          </div>
          <input
            type="password" value={pwd} onChange={e => setPwd(e.target.value)}
            placeholder="Пароль" autoFocus
            style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 14, outline: 'none' }}
          />
          <button type="submit" style={{ padding: '12px', borderRadius: 10, background: '#f97316', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 15 }}>
            Увійти →
          </button>
        </form>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#f97316', margin: '0 0 2px', textTransform: 'uppercase' }}>Kompas Migracji</p>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>Ліди</h1>
          </div>
          <button onClick={load} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '8px 18px', color: '#94a3b8', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
            ↻ Оновити
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Всього',    value: stats.total,     color: '#f1f5f9' },
            { label: 'Нових',     value: stats.new,       color: '#f97316' },
            { label: 'Контакт',   value: stats.contacted, color: '#3b82f6' },
            { label: 'Закрито',   value: stats.closed,    color: '#22c55e' },
            { label: 'Відмова',   value: stats.dropped,   color: '#64748b' },
          ].map(s => (
            <div key={s.label} style={{ background: '#1e293b', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { key: 'all',       label: `Всі (${stats.total})` },
              { key: 'new',       label: `Нові (${stats.new})` },
              { key: 'contacted', label: `Контакт (${stats.contacted})` },
              { key: 'closed',    label: `Закрито (${stats.closed})` },
              { key: 'dropped',   label: `Відмова (${stats.dropped})` },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 700,
                background: filter === f.key ? '#f97316' : '#1e293b',
                color:      filter === f.key ? '#fff'    : '#94a3b8',
                transition: 'all 0.15s',
              }}>{f.label}</button>
            ))}
          </div>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Пошук..."
            style={{
              flex: 1, minWidth: 180, padding: '8px 14px', borderRadius: 8,
              border: '1px solid #334155', background: '#1e293b',
              color: '#f1f5f9', fontSize: 13, outline: 'none',
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#450a0a', border: '1px solid #991b1b', borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#fca5a5', margin: 0, fontFamily: 'monospace' }}>{error}</p>
          </div>
        )}

        {/* Leads list */}
        {loading && <p style={{ color: '#475569', textAlign: 'center', marginTop: 60 }}>Завантаження...</p>}

        {!loading && visible.length === 0 && (
          <p style={{ color: '#475569', textAlign: 'center', marginTop: 60 }}>Лідів не знайдено</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visible.map(lead => (
            <LeadCard key={lead.id} lead={lead} onUpdate={updateStatus} />
          ))}
        </div>

      </div>
    </div>
  );
}
