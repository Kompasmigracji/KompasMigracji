"use client";
/* KompasCRM — Main Dashboard */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  StatCard, Sparkline, Badge, Spinner, EmptyState, Icon, BarList, Avatar, ProgressBar
} from "@/components/admin/ui";

const SOURCE_LABEL = {
  bot: "Telegram-бот", site: "Website", facebook: "Facebook",
  instagram: "Instagram", other: "Other",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setStats(d)))
      .catch(() => setError("Failed to load analytics"));
  }, []);

  if (error) {
    return (
      <div className="kc-error">
        <Icon name="alert" size={18} />
        <span>{error}</span>
      </div>
    );
  }
  
  if (!stats) return <Spinner />;

  const conv = stats.leads.total ? Math.round((stats.leads.converted / stats.leads.total) * 100) : 0;
  const duesTotal = stats.duesCollected + (stats.duesOutstanding || 0);
  const duesRate = duesTotal ? Math.round((stats.duesCollected / duesTotal) * 100) : 0;
  
  const sources = (stats.leadsBySource || []).map((s) => ({
    label: SOURCE_LABEL[s.source] || s.source,
    value: s.count,
    color: s.source === 'bot' ? 'var(--color-info)' : 'var(--color-primary)',
  }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <h2 className="kc-h2" style={{ margin: 0 }}>Overview</h2>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-ghost"><Icon name="calendar" size={16} /> Last 30 Days</button>
          <button className="kc-btn kc-btn-primary"><Icon name="file" size={16} /> Export Report</button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="kc-grid kc-grid-4" style={{ marginBottom: "var(--space-lg)" }}>
        <StatCard 
          icon="users" value={stats.members.total} label="Total Members" 
          sub={`${stats.members.active} active · ${stats.members.pending} pending`} 
          trend={12} 
        />
        <StatCard 
          icon="target" value={stats.leads.new} label="New Leads" 
          sub={`${stats.leads.total} total · ${conv}% conversion`} 
          trend={5} 
        />
        <StatCard 
          icon="briefcase" value={stats.cases.active} label="Active Cases" 
          sub={`${stats.cases.resolved} resolved this month`} 
          trend={-2} 
        />
        <StatCard 
          icon="cash" value={`${stats.duesCollected.toLocaleString("uk-UA")} zł`} 
          label="Revenue Collected" 
          sub={`${duesRate}% collection rate`} 
          trend={8} 
        />
      </div>

      <div className="kc-grid kc-grid-2" style={{ marginBottom: "var(--space-lg)" }}>
        {/* Analytics Chart */}
        <div className="kc-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="kc-card-cap">Lead Generation Trend</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'var(--space-lg) 0' }}>
            <Sparkline data={stats.series || [5, 10, 8, 15, 12, 20, 18, 25, 22, 30, 28, 35, 40, 38]} w={400} h={120} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "var(--space-md)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>14 days ago</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text)", fontWeight: 500 }}>Total: {stats.series?.reduce((a, b) => a + b, 0) || 306}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Today</div>
          </div>
        </div>

        {/* Lead Sources & Progress */}
        <div className="kc-card">
          <h3 className="kc-card-cap">Lead Sources</h3>
          {sources.length ? (
            <div style={{ marginBottom: "var(--space-xl)" }}><BarList items={sources} /></div>
          ) : (
            <EmptyState title="No leads yet" icon="target" />
          )}

          <h3 className="kc-card-cap">Revenue Collection</h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
            <span style={{ fontSize: "var(--text-2xl)", fontWeight: 600, fontFamily: "var(--font-heading)" }}>
              {stats.duesCollected.toLocaleString("uk-UA")} <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)", fontWeight: 400 }}>zł</span>
            </span>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--color-danger)" }}>
              / {(stats.duesOutstanding || 0).toLocaleString("uk-UA")} zł pending
            </span>
          </div>
          <ProgressBar progress={duesRate} label={`Collection Rate`} color="var(--color-success)" />
        </div>
      </div>

      <div className="kc-grid kc-grid-2">
        {/* Recent Leads */}
        <div className="kc-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0 }}>Recent Leads</h3>
            <Link href="/admin/leads" className="kc-link" style={{ fontSize: "var(--text-xs)" }}>View All →</Link>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {stats.recentLeads?.length ? stats.recentLeads.map((l) => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "var(--panel-2)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <Avatar name={l.name || "Unknown"} size={32} />
                  <div>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>{l.name || "Without name"}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{SOURCE_LABEL[l.source] || l.source}</div>
                  </div>
                </div>
                <Badge status={l.status} />
              </div>
            )) : <EmptyState />}
          </div>
        </div>

        {/* Quick Actions & Tasks (Mock for now until Tasks API exists) */}
        <div className="kc-card">
          <h3 className="kc-card-cap">Tasks Due Today</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-md)", padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
              <input type="checkbox" style={{ marginTop: 3 }} />
              <div>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text)" }}>Call Alex regarding contract</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)", marginTop: 4 }}>Due in 2 hours</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-md)", padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
              <input type="checkbox" style={{ marginTop: 3 }} />
              <div>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text)" }}>Review residency application for Maria</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 4 }}>Due at 16:00</div>
              </div>
            </div>
          </div>

          <h3 className="kc-card-cap">Quick Actions</h3>
          <div className="kc-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)" }}>
            <button className="kc-btn" style={{ justifyContent: "flex-start", padding: "12px" }}>
              <div style={{ background: "var(--brass-bg)", color: "var(--color-primary)", padding: 6, borderRadius: 6 }}><Icon name="plus" size={16} /></div>
              Add Lead
            </button>
            <button className="kc-btn" style={{ justifyContent: "flex-start", padding: "12px" }}>
              <div style={{ background: "color-mix(in srgb, var(--color-info) 15%, transparent)", color: "var(--color-info)", padding: 6, borderRadius: 6 }}><Icon name="file" size={16} /></div>
              Create Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
