"use client";
/* KompasCRM — Plugin & Extensions Marketplace (Mozilla/WP style) */
import React, { useState } from "react";
import { Icon, Badge } from "@/components/admin/ui";

export default function ExtensionsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const [plugins, setPlugins] = useState([
    { id: "plg_1", name: "Stripe Payments Pro", provider: "Kompas Core", category: "finance", rating: 4.9, installs: "10k+", status: "installed", desc: "Process credit cards and Apple Pay directly on your invoices." },
    { id: "plg_2", name: "Telegram Bot Integration", provider: "Community", category: "communication", rating: 4.7, installs: "5k+", status: "available", desc: "Receive lead notifications and reply to clients via Telegram." },
    { id: "plg_3", name: "Google Calendar Sync", provider: "Kompas Core", category: "productivity", rating: 4.8, installs: "25k+", status: "installed", desc: "Two-way sync for appointments and team tasks." },
    { id: "plg_4", name: "OpenAI Auto-Responder", provider: "AI Labs", category: "ai", rating: 4.5, installs: "2k+", status: "available", desc: "Draft email replies automatically based on previous conversations." },
    { id: "plg_5", name: "WooCommerce Importer", provider: "Community", category: "ecommerce", rating: 4.2, installs: "1k+", status: "update_available", desc: "Sync products and orders from your legacy WooCommerce site." }
  ]);

  const categories = [
    { id: "all", label: "All Plugins" },
    { id: "finance", label: "Finance & Payments" },
    { id: "communication", label: "Communication" },
    { id: "productivity", label: "Productivity" },
    { id: "ai", label: "Artificial Intelligence" },
    { id: "ecommerce", label: "E-Commerce" }
  ];

  const filteredPlugins = activeCategory === "all" ? plugins : plugins.filter(p => p.category === activeCategory);

  const togglePlugin = (id) => {
    setPlugins(plugins.map(p => {
      if (p.id === id) {
        if (p.status === "installed") return { ...p, status: "available" };
        if (p.status === "available" || p.status === "update_available") return { ...p, status: "installed" };
      }
      return p;
    }));
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: "flex", gap: 2, color: "var(--color-warning)", alignItems: "center" }}>
        {[1,2,3,4,5].map(star => (
          <Icon key={star} name="star" size={14} style={{ opacity: star <= rating ? 1 : 0.3 }} />
        ))}
        <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginLeft: 4 }}>({rating})</span>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Extensions Marketplace</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Discover and install plugins to extend your CRM capabilities.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-ghost"><Icon name="upload-cloud" size={16} /> Upload Plugin .ZIP</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1, overflow: "hidden" }}>
        {/* Sidebar Categories */}
        <div className="kc-card" style={{ width: 250, flexShrink: 0, padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
          <div style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 8 }}>Categories</div>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer",
                background: activeCategory === cat.id ? "color-mix(in srgb, var(--color-primary) 10%, transparent)" : "transparent",
                color: activeCategory === cat.id ? "var(--color-primary)" : "var(--text)",
                fontWeight: activeCategory === cat.id ? 600 : 400, textAlign: "left"
              }}
            >
              {cat.label}
              <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                {cat.id === "all" ? plugins.length : plugins.filter(p => p.category === cat.id).length}
              </span>
            </button>
          ))}

          <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "var(--space-md)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 8 }}>Updates</div>
            <button className="kc-btn kc-btn-ghost" style={{ width: "100%", justifyContent: "space-between", color: "var(--color-warning)" }}>
              <span>Available Updates</span>
              <Badge status="warning" text={plugins.filter(p => p.status === "update_available").length} />
            </button>
          </div>
        </div>

        {/* Plugins Grid */}
        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-md)", alignContent: "start" }}>
          {filteredPlugins.map(plugin => (
            <div key={plugin.id} className="kc-card" style={{ display: "flex", flexDirection: "column", position: "relative", border: plugin.status === "installed" ? "1px solid var(--color-primary)" : "1px solid var(--border)" }}>
              
              {plugin.status === "update_available" && (
                <div style={{ position: "absolute", top: -8, right: -8 }}>
                  <Badge status="warning" text="Update!" />
                </div>
              )}

              <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--border)" }}>
                  <Icon name="grid" size={24} color="var(--dim)" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>{plugin.name}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", alignItems: "center", gap: 4 }}>
                    By {plugin.provider}
                    {plugin.provider === "Kompas Core" && <Icon name="check" size={12} color="var(--color-success)" />}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
                {renderStars(plugin.rating)}
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="download" size={12} /> {plugin.installs}
                </div>
              </div>

              <p style={{ fontSize: "var(--text-sm)", color: "var(--dim)", lineHeight: 1.5, flex: 1 }}>
                {plugin.desc}
              </p>

              <div style={{ marginTop: "var(--space-md)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {plugin.status === "installed" ? (
                  <Badge status="success" text="Installed" />
                ) : plugin.status === "update_available" ? (
                  <Badge status="warning" text="v2.1 Available" />
                ) : (
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Free</span>
                )}

                <button 
                  className={`kc-btn ${plugin.status === "installed" ? "kc-btn-ghost" : "kc-btn-primary"}`}
                  style={{ color: plugin.status === "installed" ? "var(--color-danger)" : "" }}
                  onClick={() => togglePlugin(plugin.id)}
                >
                  {plugin.status === "installed" ? "Uninstall" : plugin.status === "update_available" ? "Update Now" : "Install"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
