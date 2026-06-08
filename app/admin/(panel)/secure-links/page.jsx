"use client";
/* iPhoenixCRM — Secure Encrypted Links (Hawkpost style) */
import React, { useState } from "react";
import { Icon, Badge, EmptyState } from "@/components/admin/ui";

export default function SecureLinksPage() {
  const [links, setLinks] = useState([
    { id: "sl_1", name: "Passport Upload - John Doe", url: "https://iphoenixcrm.com/secure/abc123xyz", expires: "2026-05-15", status: "active", views: 0 },
    { id: "sl_2", name: "Contract Signature Request", url: "https://iphoenixcrm.com/secure/def456uvw", expires: "2026-05-10", status: "expired", views: 1 }
  ]);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Secure Links</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Generate encrypted, expiring links to request sensitive documents or passwords from clients.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => setIsCreating(!isCreating)}>
          <Icon name="plus" size={16} /> Generate Link
        </button>
      </div>

      {isCreating && (
        <div className="kc-card" style={{ marginBottom: "var(--space-lg)", border: "1px solid var(--color-primary)" }}>
          <h3 className="kc-h3" style={{ marginBottom: "var(--space-md)" }}>Create New Secure Link</h3>
          <div className="kc-grid kc-grid-2">
            <div>
              <label className="kc-label">Purpose / Name</label>
              <input type="text" className="kc-input" placeholder="e.g. Passport copy request" />
            </div>
            <div>
              <label className="kc-label">Expiration Date</label>
              <input type="date" className="kc-input" />
            </div>
            <div>
              <label className="kc-label">Max Views (0 for unlimited)</label>
              <input type="number" className="kc-input" placeholder="1" defaultValue={1} />
            </div>
            <div>
              <label className="kc-label">Require PIN?</label>
              <select className="kc-input">
                <option>No</option>
                <option>Yes, generate random PIN</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-md)" }}>
            <button className="kc-btn kc-btn-primary"><Icon name="check" size={16} /> Generate & Copy Link</button>
            <button className="kc-btn kc-btn-ghost" onClick={() => setIsCreating(false)}>Cancel</button>
          </div>
        </div>
      )}

      {links.length === 0 ? (
        <EmptyState title="No secure links" description="Create a link to securely request files from clients." icon="link" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          {links.map(link => (
            <div key={link.id} className="kc-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  {link.status === "active" ? <Icon name="link" size={16} color="var(--color-primary)" /> : <Icon name="lock" size={16} color="var(--dim)" />}
                  {link.name}
                  <Badge status={link.status === "active" ? "success" : "dim"} text={link.status} />
                </div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", fontFamily: "monospace", userSelect: "all" }}>
                  {link.url}
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 8 }}>
                  Expires: {link.expires} • Views: {link.views}
                </div>
              </div>
              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <button className="kc-btn kc-btn-ghost" disabled={link.status !== "active"}><Icon name="copy" size={16} /> Copy</button>
                <button className="kc-btn kc-btn-ghost" style={{ color: "var(--color-danger)" }}><Icon name="trash" size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
