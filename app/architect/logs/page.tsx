// app/architect/logs/page.tsx
'use client';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { GlassCard } from '@/components/lifeos/GlassCard';

interface SystemLog {
  id: string;
  level: string;
  source: string;
  message: string;
  details: any;
  created_at: string;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
});

function formatTime(ts: string) {
  try {
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return ts;
  }
}

export default function LogsPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500 italic">Loading…</div>}>
      <LogsContent />
    </Suspense>
  );
}

function LogsContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const query = source ? `&source=${encodeURIComponent(source)}` : '';

  const { data, error, isLoading } = useSWR<{ logs: SystemLog[] }>(
    `/api/architect/logs?limit=200${query}`,
    fetcher,
    { refreshInterval: 15000 }
  );

  const logs = data?.logs ?? [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-light text-white tracking-wide">System <span className="font-bold text-cyan-400">Logs</span> & Events</h2>
          <p className="text-slate-400 mt-2">
            Live stream of `system_logs` — auto-refreshes every 15s.
            {source && (
              <>
                {' '}Filtered by source: <span className="text-purple-400">{source}</span>
                {' '}·{' '}
                <Link href="/architect/logs" className="text-cyan-400 hover:underline">clear filter</Link>
              </>
            )}
          </p>
        </div>
        {isLoading && <span className="text-xs text-slate-500 font-mono">Loading…</span>}
      </header>

      <GlassCard className="font-mono text-sm">
        {error && (
          <div className="mb-4 px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            Failed to load system logs.
          </div>
        )}

        <div className="flex border-b border-white/10 pb-3 mb-3 text-slate-500 uppercase tracking-widest text-xs">
          <div className="w-24">Time</div>
          <div className="w-24">Level</div>
          <div className="w-40">Source</div>
          <div className="flex-1">Message</div>
        </div>

        {!isLoading && logs.length === 0 && !error && (
          <div className="text-sm text-slate-500 italic py-4">No system log entries found yet.</div>
        )}

        <div className="space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {logs.map(log => (
            <div key={log.id} className="flex group hover:bg-white/5 py-1 -mx-2 px-2 rounded transition-colors">
              <div className="w-24 text-slate-500">{formatTime(log.created_at)}</div>
              <div className="w-24">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                  log.level === 'error' ? 'bg-red-500/20 text-red-400' :
                  log.level === 'warn' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {log.level}
                </span>
              </div>
              <div className="w-40 text-purple-400 truncate pr-4">{log.source}</div>
              <div className="flex-1 text-slate-300">{log.message}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
