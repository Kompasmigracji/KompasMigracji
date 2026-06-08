"use client";
/* iPhoenixCRM — Email Inbox */
import React, { useState, useEffect } from "react";
import { Icon, Spinner, EmptyState, Badge, Avatar } from "@/components/admin/ui";

export default function EmailsPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);

  // Mock emails
  useEffect(() => {
    setTimeout(() => {
      setEmails([
        { id: 1, subject: "Re: Your residency application", from: "mariia.k@example.com", preview: "Hello! Thank you for the update. Could you please clarify what documents...", folder: "inbox", date: "10:30 AM", read: false },
        { id: 2, subject: "Invoice #INV-2026-05", from: "billing@company.com", preview: "Attached is the invoice for the last period.", folder: "inbox", date: "Yesterday", read: true },
        { id: 3, subject: "New inquiry from website", from: "system@iphoenixcrm.com", preview: "You have a new lead. Name: John Doe...", folder: "inbox", date: "May 12", read: true },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const visibleEmails = emails.filter(e => e.folder === activeFolder);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 120px)", gap: "var(--space-md)" }}>
      {/* Sidebar Folders */}
      <div className="kc-card" style={{ width: 220, flexShrink: 0, padding: "var(--space-sm)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
        <button 
          className="kc-btn kc-btn-primary" 
          style={{ marginBottom: "var(--space-md)", width: "100%", justifyContent: "center" }}
          onClick={() => setComposeOpen(true)}
        >
          <Icon name="plus" size={16} /> Compose
        </button>

        {[
          { id: "inbox", label: "Inbox", icon: "inbox", count: 1 },
          { id: "sent", label: "Sent", icon: "send" },
          { id: "drafts", label: "Drafts", icon: "file" },
          { id: "archived", label: "Archived", icon: "briefcase" }
        ].map(folder => (
          <button 
            key={folder.id}
            onClick={() => { setActiveFolder(folder.id); setSelectedEmail(null); }}
            style={{ 
              display: "flex", alignItems: "center", justifyContent: "space-between", 
              padding: "8px 12px", borderRadius: "var(--radius-md)", 
              background: activeFolder === folder.id ? "var(--panel-2)" : "transparent",
              color: activeFolder === folder.id ? "var(--text)" : "var(--dim)",
              border: "none", cursor: "pointer", fontSize: "var(--text-sm)", textAlign: "left",
              fontWeight: activeFolder === folder.id ? 600 : 400
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name={folder.icon} size={16} /> {folder.label}
            </div>
            {folder.count && <Badge status="info" text={folder.count} />}
          </button>
        ))}
      </div>

      {/* Email List */}
      <div className="kc-card" style={{ width: 350, flexShrink: 0, padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="kc-card-cap" style={{ margin: 0, textTransform: "capitalize" }}>{activeFolder}</h3>
          <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="search" size={16} /></button>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? <Spinner /> : visibleEmails.length === 0 ? (
            <div style={{ padding: "var(--space-lg)", textAlign: "center", color: "var(--dim)" }}>Empty folder</div>
          ) : visibleEmails.map(email => (
            <div 
              key={email.id} 
              onClick={() => { setSelectedEmail(email); email.read = true; }}
              style={{ 
                padding: "12px 16px", borderBottom: "1px solid var(--border)", 
                background: selectedEmail?.id === email.id ? "var(--panel-2)" : (email.read ? "transparent" : "color-mix(in srgb, var(--color-primary) 5%, transparent)"),
                cursor: "pointer", transition: "background 0.15s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontWeight: email.read ? 500 : 600, fontSize: "var(--text-sm)", color: "var(--text)" }}>{email.from}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{email.date}</div>
              </div>
              <div style={{ fontWeight: email.read ? 400 : 600, fontSize: "var(--text-sm)", color: "var(--text)", marginBottom: 4 }}>{email.subject}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {email.preview}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Reader */}
      <div className="kc-card" style={{ flex: 1, padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {selectedEmail ? (
          <>
            <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <button className="kc-btn kc-btn-ghost"><Icon name="trash" size={16} /> Delete</button>
                <button className="kc-btn kc-btn-ghost"><Icon name="briefcase" size={16} /> Archive</button>
              </div>
              <button className="kc-btn kc-btn-ghost"><Icon name="reply" size={16} /> Reply</button>
            </div>
            <div style={{ padding: "var(--space-lg)", flex: 1, overflowY: "auto" }}>
              <h2 className="kc-h2" style={{ marginTop: 0, marginBottom: "var(--space-lg)" }}>{selectedEmail.subject}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
                <Avatar name={selectedEmail.from} size={40} />
                <div>
                  <div style={{ fontWeight: 500 }}>{selectedEmail.from}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>to me · {selectedEmail.date}</div>
                </div>
              </div>
              <div style={{ fontSize: "var(--text-md)", lineHeight: 1.6, color: "var(--text)" }}>
                {selectedEmail.preview}
                <br /><br />
                Best regards,<br />
                Sender
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <EmptyState title="Select an email to read" description="Nothing selected" icon="inbox" />
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {composeOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="kc-card" style={{ width: 600, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--panel-2)" }}>
              <div style={{ fontWeight: 600 }}>New Message</div>
              <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }} onClick={() => setComposeOpen(false)}><Icon name="trash" size={16} /></button>
            </div>
            <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex" }}>
              <div style={{ color: "var(--dim)", width: 40, paddingTop: 4 }}>To:</div>
              <input type="text" className="kc-input" style={{ flex: 1, border: "none", background: "transparent", padding: 0 }} />
            </div>
            <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex" }}>
              <div style={{ color: "var(--dim)", width: 40, paddingTop: 4 }}>Subj:</div>
              <input type="text" className="kc-input" style={{ flex: 1, border: "none", background: "transparent", padding: 0 }} />
            </div>
            <div style={{ padding: "var(--space-md)", flex: 1 }}>
              <textarea className="kc-textarea" style={{ width: "100%", height: 200, border: "none", background: "transparent", padding: 0, resize: "none" }} placeholder="Write your message here... (Try using / for templates)"></textarea>
            </div>
            <div style={{ padding: "var(--space-md)", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
              <button className="kc-btn kc-btn-ghost"><Icon name="file" size={16} /> Templates</button>
              <button className="kc-btn kc-btn-primary" onClick={() => setComposeOpen(false)}><Icon name="send" size={16} /> Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
