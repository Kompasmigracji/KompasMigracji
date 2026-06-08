"use client";
/* iPhoenixCRM — Advanced Analytics (PostHog style) */
import React from "react";
import { Icon } from "@/components/admin/ui";

export default function AnalyticsPage() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Analytics & Insights</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Product analytics, conversion funnels, and team performance tracking.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <select className="kc-input" style={{ width: 150, padding: "8px 12px" }}>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Dashboard</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1 }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Users (DAU)</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: "var(--space-xs)" }}>1,492</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-success)", marginTop: "var(--space-xs)", display: "flex", alignItems: "center", gap: 4 }}><Icon name="trending-up" size={12} /> +12.5%</div>
        </div>
        <div className="kc-card" style={{ flex: 1 }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Lead Conversion Rate</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: "var(--space-xs)" }}>8.4%</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-success)", marginTop: "var(--space-xs)", display: "flex", alignItems: "center", gap: 4 }}><Icon name="trending-up" size={12} /> +1.2%</div>
        </div>
        <div className="kc-card" style={{ flex: 1 }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>MRR Growth</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: "var(--space-xs)" }}>€12,450</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)", marginTop: "var(--space-xs)", display: "flex", alignItems: "center", gap: 4 }}><Icon name="trending-down" size={12} /> -2.1%</div>
        </div>
        <div className="kc-card" style={{ flex: 1 }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Session Duration</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: "var(--space-xs)" }}>4m 12s</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: "var(--space-xs)", display: "flex", alignItems: "center", gap: 4 }}><Icon name="minus" size={12} /> 0.0%</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1 }}>
        {/* Left: Main Chart Area */}
        <div className="kc-card" style={{ flex: 2, display: "flex", flexDirection: "column" }}>
          <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-lg)" }}>Conversion Funnel: Website Visitor to Paid Client</h3>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "var(--space-md)", padding: "0 var(--space-xl)", position: "relative" }}>
            {/* Fake Funnel Bar Chart */}
            <div style={{ flex: 1, height: "100%", background: "color-mix(in srgb, var(--color-primary) 20%, transparent)", borderRadius: "8px 8px 0 0", position: "relative" }}>
              <div style={{ position: "absolute", bottom: -25, width: "100%", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--dim)" }}>Visitors (100%)</div>
            </div>
            <div style={{ flex: 1, height: "65%", background: "color-mix(in srgb, var(--color-primary) 50%, transparent)", borderRadius: "8px 8px 0 0", position: "relative" }}>
              <div style={{ position: "absolute", bottom: -25, width: "100%", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--dim)" }}>Leads (65%)</div>
            </div>
            <div style={{ flex: 1, height: "40%", background: "color-mix(in srgb, var(--color-primary) 80%, transparent)", borderRadius: "8px 8px 0 0", position: "relative" }}>
              <div style={{ position: "absolute", bottom: -25, width: "100%", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--dim)" }}>Proposals (40%)</div>
            </div>
            <div style={{ flex: 1, height: "15%", background: "var(--color-primary)", borderRadius: "8px 8px 0 0", position: "relative" }}>
              <div style={{ position: "absolute", bottom: -25, width: "100%", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--dim)" }}>Closed (15%)</div>
            </div>
          </div>
        </div>

        {/* Right: Top Performing Sources */}
        <div className="kc-card" style={{ flex: 1 }}>
          <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-lg)" }}>Top Acquisition Sources</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {[
              { name: "Google Organic", value: "45%", color: "#4285F4" },
              { name: "Direct Traffic", value: "25%", color: "var(--dim)" },
              { name: "LinkedIn Ads", value: "15%", color: "#0077B5" },
              { name: "Referrals", value: "10%", color: "var(--color-success)" },
              { name: "Other", value: "5%", color: "var(--panel-border)" }
            ].map(source => (
              <div key={source.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", marginBottom: 4 }}>
                  <span>{source.name}</span>
                  <span style={{ fontWeight: 600 }}>{source.value}</span>
                </div>
                <div style={{ height: 6, background: "var(--panel-2)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: source.value, background: source.color, borderRadius: 3 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
