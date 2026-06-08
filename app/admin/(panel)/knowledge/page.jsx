"use client";
/* KompasCRM — Knowledge Base & NLP Annotation (Doccano/Piaf style) */
import React, { useState } from "react";
import { Icon, Badge, EmptyState } from "@/components/admin/ui";

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState("articles"); // articles, annotation
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isAnnotating, setIsAnnotating] = useState(false);

  // Mock articles
  const articles = [
    { id: 1, title: "How to process a Residency Application", category: "Onboarding", author: "Alex Admin", date: "May 10, 2026", content: "To process a residency application, first verify all identity documents. Ensure the passport is valid for at least 6 months. Then, submit the M-1 form to the local office." },
    { id: 2, title: "Tax Compliance Rules 2026", category: "Legal", author: "Maria Manager", date: "May 12, 2026", content: "According to the new regulations from the Ministry of Finance, all invoices must be retained for 5 years in digital format. VAT declarations are due on the 25th." },
    { id: 3, title: "Handling Angry Customers", category: "Support", author: "System Bot", date: "May 14, 2026", content: "Always maintain a calm tone. Acknowledge their frustration and offer an immediate escalation path to a Tier 2 manager." }
  ];

  // Annotation Mode State
  const entities = [
    { id: "e1", label: "PERSON", color: "#3B82F6" },
    { id: "e2", label: "ORG", color: "#10B981" },
    { id: "e3", label: "DATE", color: "#F59E0B" },
    { id: "e4", label: "DOC", color: "#8B5CF6" }
  ];
  const [activeEntity, setActiveEntity] = useState(entities[0]);

  // Handle text selection for annotation (Mockup)
  const handleMouseUp = () => {
    if (!isAnnotating) return;
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;
    
    // In a real app, we would wrap the selected text in a span with the entity color.
    // For this mockup, we just show an alert to demonstrate the feature.
    const text = selection.toString();
    alert(`Tagged "${text}" as ${activeEntity.label}`);
    selection.removeAllRanges();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Knowledge Base & AI Lab</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Document internal processes and annotate text datasets for AI training.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)", background: "var(--panel-2)", padding: 4, borderRadius: "var(--radius-lg)" }}>
          <button 
            className={`kc-btn ${activeTab === "articles" ? "kc-btn-primary" : "kc-btn-ghost"}`}
            onClick={() => { setActiveTab("articles"); setIsAnnotating(false); }}
          >
            <Icon name="file" size={16} /> Articles
          </button>
          <button 
            className={`kc-btn ${activeTab === "annotation" ? "kc-btn-primary" : "kc-btn-ghost"}`}
            onClick={() => setActiveTab("annotation")}
          >
            <Icon name="target" size={16} /> AI Annotation
          </button>
        </div>
      </div>

      {activeTab === "articles" && (
        <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1, overflow: "hidden" }}>
          {/* Article List */}
          <div className="kc-card" style={{ width: 350, display: "flex", flexDirection: "column", padding: 0, flexShrink: 0 }}>
            <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-sm)" }}>
              <input type="text" className="kc-input" placeholder="Search articles..." style={{ flex: 1 }} />
              <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {articles.map(a => (
                <div 
                  key={a.id} 
                  onClick={() => setSelectedArticle(a)}
                  style={{ 
                    padding: "var(--space-md)", borderBottom: "1px solid var(--border)", cursor: "pointer",
                    background: selectedArticle?.id === a.id ? "var(--panel-2)" : "transparent"
                  }}
                >
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
                    {a.category}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", justifyContent: "space-between" }}>
                    <span>{a.author}</span>
                    <span>{a.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Article Viewer */}
          <div className="kc-card" style={{ flex: 1, padding: "var(--space-2xl)", overflowY: "auto" }}>
            {selectedArticle ? (
              <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                  <Badge status="info" text={selectedArticle.category} />
                  <span style={{ color: "var(--dim)", fontSize: "var(--text-sm)" }}>Last updated by {selectedArticle.author} on {selectedArticle.date}</span>
                </div>
                <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, marginBottom: "var(--space-xl)", color: "var(--text)" }}>
                  {selectedArticle.title}
                </h1>
                <div style={{ fontSize: "var(--text-lg)", lineHeight: 1.7, color: "var(--text)" }}>
                  {selectedArticle.content}
                </div>
              </div>
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <EmptyState title="Select an article" description="Choose an article from the list to read or edit." icon="file" />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "annotation" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ background: "color-mix(in srgb, var(--color-info) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--color-info) 30%, transparent)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "var(--color-info)", fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Icon name="target" size={16} /> NLP Annotation Mode (Doccano style)
              </div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>
                Highlight text below to tag entities. This data can be exported in JSONL format to train custom NER (Named Entity Recognition) models.
              </div>
            </div>
            <button className="kc-btn kc-btn-primary" onClick={() => setIsAnnotating(!isAnnotating)}>
              {isAnnotating ? "Stop Annotating" : "Start Annotating"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1, overflow: "hidden" }}>
            {/* Annotation Tools */}
            <div className="kc-card" style={{ width: 250, padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)", flexShrink: 0 }}>
              <div style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "var(--text-xs)", color: "var(--dim)" }}>Entity Tags (Shortcut)</div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {entities.map((ent, i) => (
                  <button 
                    key={ent.id}
                    onClick={() => setActiveEntity(ent)}
                    style={{ 
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid",
                      borderColor: activeEntity.id === ent.id ? ent.color : "var(--border)",
                      background: activeEntity.id === ent.id ? `color-mix(in srgb, ${ent.color} 10%, transparent)` : "transparent",
                      color: "var(--text)", cursor: "pointer", textAlign: "left"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: ent.color }}></div>
                      <span style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}>{ent.label}</span>
                    </div>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)", background: "var(--bg)", padding: "2px 6px", borderRadius: 4 }}>{i+1}</span>
                  </button>
                ))}
              </div>

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="kc-btn kc-btn-ghost" style={{ justifyContent: "center" }}><Icon name="plus" size={16} /> Add Custom Tag</button>
                <button className="kc-btn kc-btn-primary" style={{ justifyContent: "center" }}><Icon name="file" size={16} /> Export JSONL</button>
              </div>
            </div>

            {/* Editor Canvas */}
            <div 
              className="kc-card" 
              style={{ flex: 1, padding: "var(--space-2xl)", overflowY: "auto", cursor: isAnnotating ? "text" : "default", opacity: isAnnotating ? 1 : 0.5, transition: "opacity 0.2s" }}
              onMouseUp={handleMouseUp}
            >
              <div style={{ maxWidth: 800, margin: "0 auto", fontSize: "var(--text-xl)", lineHeight: 2, color: "var(--text)" }}>
                To process a residency application, first verify all identity documents. Ensure the passport is valid for at least 6 months. Then, submit the M-1 form to the local office.
                <br /><br />
                According to the new regulations from the Ministry of Finance, all invoices must be retained for 5 years in digital format. VAT declarations are due on the 25th.
                <br /><br />
                Always maintain a calm tone. Acknowledge their frustration and offer an immediate escalation path to a Tier 2 manager.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
