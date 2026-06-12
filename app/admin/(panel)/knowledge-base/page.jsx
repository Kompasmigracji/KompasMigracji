"use client";
/* KompasCRM — Knowledge Base & Legal Wiki */
import React, { useState, useEffect } from "react";
import { Icon, Avatar, Badge, DataTable, SearchInput, StatCard } from "@/components/admin/ui";

export default function KnowledgeBasePage() {
  const [articles] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("articles");

  // AI Knowledge Base logs
  const [wikiLogs, setWikiLogs] = useState([]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-028 generated PDF templates directory sync structure for staff downloads." },
      { type: "agent", text: "Agent-095 tracked page view event on KB-01: 'Karta Pobytu Requirements'." },
      { type: "coordinator", text: "Coordinator [Agent-C11] flagged Draft KB-04 for review: needs regulatory updates check." },
      { type: "system", text: "President digital key stamped to general security guidelines article." },
      { type: "agent", text: "Agent-154 calculated average reading time metric: 4.2 minutes per session." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setWikiLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const columns = [
    { header: "Article Title", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={row.category === "Legal Updates" ? "alert" : row.category === "Guides" ? "book-open" : "file-text"} size={16} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", color: "var(--text)" }}>
            {row.title}
            {row.urgent && <Badge status="red" text="URGENT READ" />}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 2 }}>{row.id} • {row.category}</div>
        </div>
      </div>
    )},
    { header: "Author", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Avatar name={row.author} size={24} />
      </div>
    )},
    { header: "Last Updated", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{row.date}</span> },
    { header: "Views", cell: (row) => <span style={{ fontWeight: 600, color: "var(--text)" }}>{row.views}</span> },
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "published" ? "green" : "dim"} text={row.status.toUpperCase()} />
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost" style={{ padding: 6, minHeight: "auto" }}><Icon name="edit" size={16} /></button>
      </div>
    )}
  ];

  const filteredArticles = articles.filter(art =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xs)", flexShrink: 0, flexWrap: "wrap", gap: "var(--space-md)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>База Знань & Wiki (Legal Center)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Внутрішня база інструкцій, юридичних шаблонів, регламентів та стандартів обслуговування.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="archive" size={16} /> Категорії</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Написати Статтю</button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kc-grid kc-grid-3" style={{ marginBottom: "var(--space-sm)" }}>
        <StatCard icon="file" value="128" label="Всього статей" sub="База знань" />
        <StatCard icon="compass" value="Legal Updates" label="Популярний розділ" sub="База знань" />
        <StatCard icon="alert" value="2" label="Непрочитані оновлення" sub="Необхідна дія" />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)", overflowX: "auto" }}>
        <button onClick={() => setActiveTab("articles")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "articles" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "articles" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap"
          }}>
          <Icon name="book-open" size={16} /> Статті Бази Знань
        </button>
        <button onClick={() => setActiveTab("logs")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "logs" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "logs" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap"
          }}>
          <Icon name="cpu" size={16} /> AI Indexer Logs
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 300 }}>
        {activeTab === "articles" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Пошук статей за назвою, тегом чи ID..." />
            <div className="kc-card" style={{ padding: 0, overflow: "hidden" }}>
              <DataTable columns={columns} data={filteredArticles} />
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="kc-card" style={{ background: "#0d1117", border: "1px solid var(--border)", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи авто-індексації бази знань</h3>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: 8, maxHeight: 350, overflowY: "auto" }}>
              {wikiLogs.map((log, index) => {
                let color = "#8b949e";
                if (log.type === "coordinator") color = "#58a6ff";
                if (log.type === "system") color = "#56d364";
                return (
                  <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                    <span style={{ color: "#8b949e" }}>[{log.time}]</span>{" "}
                    <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
