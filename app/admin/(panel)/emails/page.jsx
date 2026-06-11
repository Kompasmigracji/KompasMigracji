"use client";
/* KompasCRM — Emails Module & EspoCRM Inbox */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Spinner, EmptyState, Icon, Badge, Avatar } from "@/components/admin/ui";

export default function EmailsPage() {
  const [emails, setEmails] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [currentFolder, setCurrentFolder] = useState("inbox"); // 'inbox', 'sent', 'drafts', 'archived', 'accounts'
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [toast, setToast] = useState("");

  // Compose states
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeCc, setComposeCc] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [linkedEntityType, setLinkedEntityType] = useState("");
  const [linkedEntityId, setLinkedEntityId] = useState("");

  // Account creation states
  const [accName, setAccName] = useState("");
  const [accEmail, setAccEmail] = useState("");
  const [accImapHost, setAccImapHost] = useState("");
  const [accImapPort, setAccImapPort] = useState("993");
  const [accSmtpHost, setAccSmtpHost] = useState("");
  const [accSmtpPort, setAccSmtpPort] = useState("465");
  const [accUser, setAccUser] = useState("");
  const [accPass, setAccPass] = useState("");

  useEffect(() => {
    loadEmails(currentFolder);
    loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolder]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadEmails = async (folder) => {
    if (folder === "accounts") return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/emails?folder=${folder}`);
      const d = await res.json();
      setEmails(d.emails || []);
    } catch {
      flash("Не вдалося завантажити листи");
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    try {
      const res = await fetch("/api/admin/emails/accounts");
      const d = await res.json();
      setAccounts(d.accounts || []);
    } catch {
      console.error("Failed to load email accounts");
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`/api/admin/emails?sync=true&folder=${currentFolder}`);
      const d = await res.json();
      if (!d.error) {
        setEmails(d.emails || []);
        flash("Синхронізація IMAP завершена!");
      }
    } catch {
      flash("Помилка при синхронізації");
    } finally {
      setSyncing(false);
      loadEmails(currentFolder);
    }
  };

  const handleSelectEmail = async (email) => {
    setSelectedEmail(email);
    // Fetch details (triggers auto read status update)
    try {
      const res = await fetch(`/api/admin/emails/${email.id}`);
      const d = await res.json();
      if (!d.error) {
        setSelectedEmail(d.email);
        // Refresh list to update read indicator
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, is_read: true } : e));
      }
    } catch {
      console.error("Failed to fetch email details");
    }
  };

  const handleMoveFolder = async (emailId, folder) => {
    try {
      const res = await fetch(`/api/admin/emails/${emailId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      const d = await res.json();
      if (!d.error) {
        flash(`Лист переміщено в ${folder}`);
        setSelectedEmail(null);
        loadEmails(currentFolder);
      }
    } catch {
      flash("Помилка переміщення листа");
    }
  };

  const handleDeleteEmail = async (emailId) => {
    if (!confirm("Видалити цей лист назавжди?")) return;
    try {
      const res = await fetch(`/api/admin/emails/${emailId}`, { method: "DELETE" });
      if (res.ok) {
        flash("Лист видалено назавжди");
        setSelectedEmail(null);
        loadEmails(currentFolder);
      }
    } catch {
      flash("Помилка видалення листа");
    }
  };

  const handleSendEmail = async () => {
    if (!composeTo || !composeSubject || !composeBody) {
      flash("Заповніть кому, тему та текст листа");
      return;
    }

    try {
      const res = await fetch("/api/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: composeTo,
          cc: composeCc || null,
          subject: composeSubject,
          body_text: composeBody,
          entity_type: linkedEntityType || null,
          entity_id: linkedEntityId || null,
        }),
      });
      const d = await res.json();
      if (d.success) {
        flash("Лист надіслано успішно!");
        setIsComposeOpen(false);
        setComposeTo("");
        setComposeCc("");
        setComposeSubject("");
        setComposeBody("");
        setLinkedEntityType("");
        setLinkedEntityId("");
        loadEmails(currentFolder);
      } else {
        flash(d.error || "Помилка відправки");
      }
    } catch {
      flash("Помилка при з'єднанні з сервером");
    }
  };

  const handleAddAccount = async () => {
    if (!accName || !accEmail || !accUser || !accPass) {
      flash("Заповніть назву, адресу, логін та пароль");
      return;
    }

    try {
      const res = await fetch("/api/admin/emails/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: accName,
          email_address: accEmail,
          imap_host: accImapHost || null,
          imap_port: accImapPort ? parseInt(accImapPort) : null,
          smtp_host: accSmtpHost || null,
          smtp_port: accSmtpPort ? parseInt(accSmtpPort) : null,
          username: accUser,
          password: accPass,
        }),
      });
      const d = await res.json();
      if (!d.error) {
        flash("Акаунт додано успішно!");
        setAccName("");
        setAccEmail("");
        setAccImapHost("");
        setAccImapPort("993");
        setAccSmtpHost("");
        setAccSmtpPort("465");
        setAccUser("");
        setAccPass("");
        loadAccounts();
      } else {
        flash(d.error);
      }
    } catch {
      flash("Помилка додавання акаунту");
    }
  };

  const handleToggleAccount = async (id, is_active) => {
    try {
      await fetch(`/api/admin/emails/accounts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active }),
      });
      loadAccounts();
    } catch {
      flash("Помилка оновлення акаунту");
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!confirm("Видалити конфігурацію цього акаунту?")) return;
    try {
      await fetch(`/api/admin/emails/accounts/${id}`, { method: "DELETE" });
      loadAccounts();
      flash("Акаунт видалено");
    } catch {
      flash("Помилка видалення");
    }
  };

  return (
    <div className="kc-emails-layout">
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 24, zIndex: 1000 }} className="kc-note">
          {toast}
        </div>
      )}

      {/* Sidebar navigation */}
      <aside className="kc-card kc-emails-sidebar" style={{ padding: "var(--space-md)" }}>
        <button 
          className="kc-btn kc-btn-primary" 
          style={{ width: "100%", justifyContent: "center", marginBottom: "var(--space-md)" }}
          onClick={() => setIsComposeOpen(true)}
        >
          <Icon name="plus" size={16} /> Написати листа
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { id: "inbox", label: "Вхідні", icon: "inbox" },
            { id: "sent", label: "Надіслані", icon: "send" },
            { id: "drafts", label: "Чернетки", icon: "file-text" },
            { id: "archived", label: "Архів", icon: "archive" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => { setCurrentFolder(f.id); setSelectedEmail(null); }}
              style={{
                textAlign: "left", padding: "8px 12px", border: "none", borderRadius: "var(--radius-md)",
                background: currentFolder === f.id ? "var(--brass-bg)" : "transparent",
                color: currentFolder === f.id ? "var(--color-primary)" : "var(--dim)",
                fontWeight: currentFolder === f.id ? 600 : 500, cursor: "pointer", fontSize: "var(--text-sm)",
                display: "flex", alignItems: "center", gap: 8, transition: "all var(--transition-fast)"
              }}
            >
              <Icon name={f.icon} size={14} />
              <span style={{ flex: 1 }}>{f.label}</span>
            </button>
          ))}

          <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />

          <button
            onClick={() => { setCurrentFolder("accounts"); setSelectedEmail(null); }}
            style={{
              textAlign: "left", padding: "8px 12px", border: "none", borderRadius: "var(--radius-md)",
              background: currentFolder === "accounts" ? "var(--brass-bg)" : "transparent",
              color: currentFolder === "accounts" ? "var(--color-primary)" : "var(--dim)",
              fontWeight: currentFolder === "accounts" ? 600 : 500, cursor: "pointer", fontSize: "var(--text-sm)",
              display: "flex", alignItems: "center", gap: 8, transition: "all var(--transition-fast)"
            }}
          >
            <Icon name="settings" size={14} />
            <span style={{ flex: 1 }}>Поштові акаунти</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="kc-card" style={{ minHeight: 600, display: "flex", flexDirection: "column" }}>
        
        {/* Loading Spinner */}
        {loading && currentFolder !== "accounts" && <Spinner />}

        {/* 1. ACCOUNTS VIEW */}
        {currentFolder === "accounts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 600 }}>Підключення поштових скриньок (SMTP/IMAP)</h2>
            
            <div className="kc-grid kc-grid-2" style={{ alignItems: "start" }}>
              
              {/* Active list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <h3 className="kc-card-cap" style={{ margin: 0 }}>Ваші підключені скриньки</h3>
                {accounts.length === 0 ? (
                  <EmptyState title="Скриньок не підключено" description="Додайте SMTP/IMAP налаштування праворуч." icon="inbox" />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                    {accounts.map(acc => (
                      <div key={acc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{acc.name}</div>
                          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{acc.email_address}</div>
                          <div style={{ fontSize: "10px", color: "var(--faint)", marginTop: 4 }}>
                            SMTP: {acc.smtp_host} · IMAP: {acc.imap_host}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            onClick={() => handleToggleAccount(acc.id, !acc.is_active)}
                            className={`kc-btn ${acc.is_active ? 'kc-btn-primary' : 'kc-btn-ghost'}`}
                            style={{ minHeight: 24, fontSize: 10, padding: "2px 8px" }}
                          >
                            {acc.is_active ? "Активний" : "Вимкнено"}
                          </button>
                          <button
                            onClick={() => handleDeleteAccount(acc.id)}
                            className="kc-btn kc-btn-danger"
                            style={{ padding: 4, minHeight: 24 }}
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Account Form */}
              <div className="kc-card" style={{ background: "var(--panel-2)", padding: "var(--space-md)" }}>
                <h3 className="kc-card-cap" style={{ margin: "0 0 var(--space-md)" }}>Додати нову скриньку</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                  <div className="kc-field">
                    <label className="kc-label">Назва акаунту *</label>
                    <input className="kc-input" placeholder="Наприклад: Робоча пошта" value={accName} onChange={e => setAccName(e.target.value)} />
                  </div>
                  
                  <div className="kc-field">
                    <label className="kc-label">Email адреса *</label>
                    <input className="kc-input" placeholder="office@kompasmigracji.com" value={accEmail} onChange={e => setAccEmail(e.target.value)} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 8 }}>
                    <div className="kc-field">
                      <label className="kc-label">Хост IMAP (вхідні)</label>
                      <input className="kc-input" placeholder="imap.gmail.com" value={accImapHost} onChange={e => setAccImapHost(e.target.value)} />
                    </div>
                    <div className="kc-field">
                      <label className="kc-label">Порт IMAP</label>
                      <input className="kc-input" placeholder="993" value={accImapPort} onChange={e => setAccImapPort(e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 8 }}>
                    <div className="kc-field">
                      <label className="kc-label">Хост SMTP (вихідні)</label>
                      <input className="kc-input" placeholder="smtp.gmail.com" value={accSmtpHost} onChange={e => setAccSmtpHost(e.target.value)} />
                    </div>
                    <div className="kc-field">
                      <label className="kc-label">Порт SMTP</label>
                      <input className="kc-input" placeholder="465" value={accSmtpPort} onChange={e => setAccSmtpPort(e.target.value)} />
                    </div>
                  </div>

                  <div className="kc-field">
                    <label className="kc-label">Користувач / Логін *</label>
                    <input className="kc-input" placeholder="Ваша поштова скринька" value={accUser} onChange={e => setAccUser(e.target.value)} />
                  </div>

                  <div className="kc-field">
                    <label className="kc-label">Пароль *</label>
                    <input className="kc-input" type="password" placeholder="••••••••" value={accPass} onChange={e => setAccPass(e.target.value)} />
                  </div>

                  <button className="kc-btn kc-btn-primary" style={{ justifyContent: "center", marginTop: 10 }} onClick={handleAddAccount}>
                    Підключити пошту
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. EMAILS FOLDER VIEW */}
        {!loading && currentFolder !== "accounts" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            
            {/* Folder Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-md)", marginBottom: "var(--space-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 600 }}>
                  {currentFolder === "inbox" ? "Вхідні листи" : currentFolder === "sent" ? "Надіслані листи" : currentFolder === "drafts" ? "Чернетки" : "Архівні листи"}
                </h2>
                <Badge status={emails.filter(e => !e.is_read && e.status === "received").length > 0 ? "blue" : "dim"} text={`${emails.filter(e => !e.is_read && e.status === "received").length} нових`} />
              </div>
              <button className="kc-btn" onClick={handleSync} disabled={syncing} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="refresh" size={14} className={syncing ? "kc-spin" : ""} />
                {syncing ? "Синхронізація..." : "Синхронізувати IMAP"}
              </button>
            </div>

            {/* Email Workspace split: List (left) + detail (right) */}
            <div className={`kc-emails-split ${selectedEmail ? 'kc-split-active' : ''}`} style={{ gridTemplateColumns: selectedEmail ? undefined : "1fr", flex: 1 }}>
              
              {/* 2a. List pane */}
              <div className="kc-emails-list" style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                {emails.length === 0 ? (
                  <EmptyState title="Скринька порожня" description="Листів у цій папці немає." icon="inbox" />
                ) : (
                  emails.map(email => {
                    const isUnread = email.status === "received" && !email.is_read;
                    const dateStr = new Date(email.received_at || email.sent_at || email.created_at).toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
                    return (
                      <div
                        key={email.id}
                        onClick={() => handleSelectEmail(email)}
                        style={{
                          padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
                          background: selectedEmail?.id === email.id ? "var(--brass-bg)" : "var(--panel-2)",
                          cursor: "pointer", display: "flex", flexDirection: "column", gap: 6, position: "relative",
                          transition: "all var(--transition-fast)"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontSize: "var(--text-xs)", fontWeight: isUnread ? 700 : 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                            {email.status === "sent" ? `Кому: ${email.to_addresses?.[0]}` : email.from_address}
                          </span>
                          <span style={{ fontSize: 9, color: "var(--dim)" }} className="kc-mono">{dateStr}</span>
                        </div>
                        <div style={{ fontSize: "var(--text-xs)", fontWeight: isUnread ? 600 : 400, color: isUnread ? "var(--text)" : "var(--dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {email.subject}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {email.body_text || email.body_html?.replace(/<[^>]*>/g, "")}
                        </div>
                        {isUnread && (
                          <div style={{ position: "absolute", right: 12, bottom: 12, width: 6, height: 6, borderRadius: "50%", background: "var(--color-info)" }} />
                        )}
                        {email.entity_type && (
                          <div style={{ marginTop: 4 }}><Badge status="brass" text={`${email.entity_type.toUpperCase()}`} /></div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* 2b. Detail pane */}
              {selectedEmail && (
                <div className="kc-card" style={{ background: "var(--panel-2)", padding: "var(--space-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                  
                  {/* Detail top actions */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
                    <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                      <button className="kc-btn" onClick={() => {
                        setComposeTo(selectedEmail.from_address);
                        setComposeSubject(`Re: ${selectedEmail.subject}`);
                        setComposeBody(`\n\n\n--- Відповідь на лист від ${selectedEmail.from_address} ---\n${selectedEmail.body_text || ""}`);
                        setLinkedEntityType(selectedEmail.entity_type || "");
                        setLinkedEntityId(selectedEmail.entity_id || "");
                        setIsComposeOpen(true);
                      }}>
                        <Icon name="send" size={14} /> Відповісти
                      </button>
                      
                      {selectedEmail.folder !== "archived" && (
                        <button className="kc-btn" onClick={() => handleMoveFolder(selectedEmail.id, "archived")}>
                          <Icon name="archive" size={14} /> В архів
                        </button>
                      )}
                      {selectedEmail.folder !== "inbox" && (
                        <button className="kc-btn" onClick={() => handleMoveFolder(selectedEmail.id, "inbox")}>
                          <Icon name="inbox" size={14} /> У Вхідні
                        </button>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                      <button className="kc-btn kc-btn-danger" onClick={() => handleDeleteEmail(selectedEmail.id)}>
                        <Icon name="trash" size={14} /> Видалити
                      </button>
                      <button className="kc-btn" onClick={() => setSelectedEmail(null)}>
                        <Icon name="x" size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Header info */}
                  <div>
                    <h3 style={{ margin: "0 0 var(--space-sm)", fontSize: "var(--text-md)", fontWeight: 600 }}>{selectedEmail.subject}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                        <strong>Від:</strong> {selectedEmail.from_address} {selectedEmail.sender_name && `(${selectedEmail.sender_name})`}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                        <strong>Кому:</strong> {selectedEmail.to_addresses?.join(", ")}
                      </div>
                      {selectedEmail.cc_addresses?.length > 0 && (
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                          <strong>Копія:</strong> {selectedEmail.cc_addresses.join(", ")}
                        </div>
                      )}
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                        <strong>Дата:</strong> {new Date(selectedEmail.received_at || selectedEmail.sent_at || selectedEmail.created_at).toLocaleString("uk-UA")}
                      </div>
                      
                      {/* Linked Badge */}
                      {selectedEmail.entity_type && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                          <span style={{ fontSize: 10, color: "var(--faint)" }}>Зв'язана сутність:</span>
                          {selectedEmail.entity_type === "lead" ? (
                            <Link href={`/admin/leads`} className="kc-link" style={{ fontSize: 11, fontWeight: 600 }}>Лідогенерація (ID: {selectedEmail.entity_id})</Link>
                          ) : (
                            <Link href={`/admin/members`} className="kc-link" style={{ fontSize: 11, fontWeight: 600 }}>Учасник (ID: {selectedEmail.entity_id})</Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{
                    flex: 1, padding: "var(--space-md)", background: "var(--panel)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)", overflowY: "auto", fontSize: "var(--text-sm)", lineHeight: 1.6,
                    minHeight: 250, whiteSpace: "pre-wrap"
                  }}>
                    {selectedEmail.body_html ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedEmail.body_html }} />
                    ) : (
                      selectedEmail.body_text
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* 3. COMPOSE POPUP MODAL */}
      {isComposeOpen && (
        <div className="kc-modal-bg" onClick={() => setIsComposeOpen(false)}>
          <div className="kc-modal" onClick={e => e.stopPropagation()} style={{ width: 620, maxWidth: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
              <h2 className="kc-modal-title" style={{ margin: 0 }}>Новий електронний лист</h2>
              <button className="kc-btn" style={{ padding: 4, minHeight: 24 }} onClick={() => setIsComposeOpen(false)}>
                <Icon name="x" size={14} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <div className="kc-field">
                <label className="kc-label">Кому (Email) *</label>
                <input className="kc-input" placeholder="client@example.com" value={composeTo} onChange={e => setComposeTo(e.target.value)} />
              </div>

              <div className="kc-field">
                <label className="kc-label">Копія (CC)</label>
                <input className="kc-input" placeholder="manager@example.com" value={composeCc} onChange={e => setComposeCc(e.target.value)} />
              </div>

              <div className="kc-field">
                <label className="kc-label">Тема листа *</label>
                <input className="kc-input" placeholder="Вкажіть тему листа..." value={composeSubject} onChange={e => setComposeSubject(e.target.value)} />
              </div>

              {/* Link metadata */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div className="kc-field">
                  <label className="kc-label">Пов'язати з (тип)</label>
                  <select className="kc-select" value={linkedEntityType} onChange={e => setLinkedEntityType(e.target.value)}>
                    <option value="">-- Без зв'язку --</option>
                    <option value="lead">Лід</option>
                    <option value="member">Учасник</option>
                    <option value="deal">Угода</option>
                    <option value="case">Справа</option>
                  </select>
                </div>
                <div className="kc-field">
                  <label className="kc-label">ID сутності</label>
                  <input className="kc-input" placeholder="Вкажіть ID запису" value={linkedEntityId} onChange={e => setLinkedEntityId(e.target.value)} />
                </div>
              </div>

              <div className="kc-field">
                <label className="kc-label">Вміст листа</label>
                <textarea 
                  className="kc-input" 
                  rows={8} 
                  placeholder="Напишіть текст листа тут..." 
                  value={composeBody} 
                  onChange={e => setComposeBody(e.target.value)}
                  style={{ fontFamily: "var(--font-body)", lineHeight: 1.5, resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)", marginTop: "var(--space-md)" }}>
                <button className="kc-btn kc-btn-ghost" onClick={() => setIsComposeOpen(false)}>Скасувати</button>
                <button className="kc-btn kc-btn-primary" onClick={handleSendEmail} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="send" size={14} /> Надіслати
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
