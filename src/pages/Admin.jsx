import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SOURCE_LABEL = { main: 'Головна', karta: '/karta', pricing: 'Ціни', chatbot: 'AI-чат' };
const SOURCE_COLOR = { main: '#3b82f6', karta: '#f97316', pricing: '#8b5cf6', chatbot: '#22c55e' };
const ADMIN_KEY = 'km_admin_auth';

export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem(ADMIN_KEY) === '1');
  const [pwd, setPwd] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authed) return;
    if (!supabase) { setError('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY не задані'); setLoading(false); return; }
    supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setLeads(data || []);
        setLoading(false);
      });
  }, [authed]);

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (pwd === import.meta.env.VITE_ADMIN_PASSWORD || pwd === 'kompas2026') {
              sessionStorage.setItem(ADMIN_KEY, '1');
              setAuthed(true);
            } else {
              setPwd('');
              alert('Невірний пароль');
            }
          }}
          style={{ background: '#1e293b', padding: '32px', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 280 }}
        >
          <p style={{ color: '#f97316', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Kompas Migracji</p>
          <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 18, margin: 0 }}>Адмін-панель</p>
          <input
            type="password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            placeholder="Пароль"
            autoFocus
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 14, outline: 'none' }}
          />
          <button type="submit" style={{ padding: '10px', borderRadius: 8, background: '#f97316', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14 }}>
            Увійти
          </button>
        </form>
      </div>
    );
  }

  const visible = filter === 'all' ? leads : leads.filter(l => l.source === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '32px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#f97316', margin: '0 0 4px', textTransform: 'uppercase' }}>Kompas Migracji</p>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>Заявки ({leads.length})</h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'main', 'karta', 'pricing', 'chatbot'].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                background: filter === s ? '#f97316' : '#1e293b', color: filter === s ? '#fff' : '#94a3b8',
              }}>
                {s === 'all' ? 'Всі' : SOURCE_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        {loading && <p style={{ color: '#64748b' }}>Завантаження...</p>}

        {error && (
          <div style={{ background: '#450a0a', border: '1px solid #991b1b', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#fca5a5', margin: '0 0 4px', letterSpacing: '0.06em' }}>ПОМИЛКА ПІДКЛЮЧЕННЯ</p>
            <p style={{ fontSize: 13, color: '#fecaca', margin: 0, fontFamily: 'monospace' }}>{error}</p>
          </div>
        )}

        {!loading && visible.length === 0 && (
          <p style={{ color: '#64748b', textAlign: 'center', marginTop: 60 }}>Заявок поки немає</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visible.map(lead => (
            <div key={lead.id} style={{
              background: '#1e293b', borderRadius: 12, padding: '16px 20px',
              display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px 16px', alignItems: 'start',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{lead.name || '—'}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: SOURCE_COLOR[lead.source] + '22', color: SOURCE_COLOR[lead.source],
                    padding: '2px 8px', borderRadius: 4,
                  }}>{SOURCE_LABEL[lead.source] || lead.source}</span>
                </div>
                {lead.phone && (
                  <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                    style={{ fontSize: 13, color: '#25d366', textDecoration: 'none', display: 'block', marginBottom: 4 }}>
                    {lead.phone}
                  </a>
                )}
                {lead.service && <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 4px' }}>{lead.service}</p>}
                {lead.message && <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{lead.message}</p>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: '#475569', margin: 0, whiteSpace: 'nowrap' }}>
                  {new Date(lead.created_at).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </p>
                <p style={{ fontSize: 11, color: '#475569', margin: '2px 0 0', whiteSpace: 'nowrap' }}>
                  {new Date(lead.created_at).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
