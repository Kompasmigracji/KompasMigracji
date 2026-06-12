"use client";
/* KompasCRM — E-Signatures & Contracts */
import React, { useState, useEffect } from "react";
import { Icon, Badge, Avatar, ProgressBar, SearchInput } from "@/components/admin/ui";

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState("all_docs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Mock Contracts/Documents Database
  const [documents, setDocuments] = useState([]);

  // AI Document Verification Engine Logs (175 agents, 15 coordinators, 1 president)
  const [docLogs, setDocLogs] = useState([]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-059 dispatched SMS verification pin code to client Ivan Ivanov." },
      { type: "agent", text: "Agent-121 registered contract view event from IP 194.29.50.12 (TechCorp Ltd)." },
      { type: "coordinator", text: "Coordinator [Agent-C12] flagged document DOC-26-004 as declined by signer." },
      { type: "system", text: "President digital key verified and stored securely in Vault HSM." },
      { type: "agent", text: "Agent-007 matched passport OCR scanning data with signed client name Elena Rostova." },
      { type: "agent", text: "Agent-145 pushed webhook e-sign event notification to Slack channel #contracts." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setDocLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleRequestSignature = (e) => {
    e.preventDefault();
    alert("AI Диспетчер успішно згенерував PDF та надіслав посилання для підпису на Email та СМС клієнта.");
    setShowRequestModal(false);
  };

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Шаблони & Е-Підписи (Contracts & Vault)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Цифровий підпис документів, шаблони контрактів та безпечний криптографічний архів.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary" onClick={() => setShowRequestModal(true)}>
            <Icon name="edit" size={16} /> Надіслати на підпис
          </button>
          <button className="kc-btn kc-btn-primary">
            <Icon name="plus" size={16} /> Створити Шаблон
          </button>
        </div>
      </div>

      {/* KPI Stats block */}
      <div className="kc-grid kc-grid-4">
        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,184,122,0.1)" }}>
              <Icon name="check" size={18} color="var(--color-success)" />
            </div>
            <Badge status="green" text="Success" />
          </div>
          <div className="kc-stat-val">412</div>
          <div className="kc-stat-lbl">Підписано контрактів</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(225,168,75,0.1)" }}>
              <Icon name="clock" size={18} color="var(--color-warning)" />
            </div>
            <Badge status="brass" text="Pending" />
          </div>
          <div className="kc-stat-val">45</div>
          <div className="kc-stat-lbl">Очікують підпису</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,155,213,0.1)" }}>
              <Icon name="eye" size={18} color="var(--color-info)" />
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Views</span>
          </div>
          <div className="kc-stat-val">87%</div>
          <div className="kc-stat-lbl">Коефіцієнт відкриття</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "var(--brass-bg)" }}>
              <Icon name="file-text" size={18} color="var(--color-primary)" />
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)" }}>SHA-256</span>
          </div>
          <div className="kc-stat-val">Vault Ok</div>
          <div className="kc-stat-lbl">Захищений архів</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)", overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
        <button 
          onClick={() => setActiveTab("all_docs")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "all_docs" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "all_docs" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="file-text" size={16} /> Усі документи
        </button>
        <button 
          onClick={() => setActiveTab("templates")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "templates" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "templates" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="copy" size={16} /> Бланки & Шаблони
        </button>
        <button 
          onClick={() => setActiveTab("ai_sign")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "ai_sign" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "ai_sign" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="cpu" size={16} /> AI Валідація підписів (175+ Agents)
        </button>
      </div>

      {/* Tab content area */}
      <div style={{ flex: 1, minHeight: 400 }}>
        {activeTab === "all_docs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Пошук документів за назвою, клієнтом чи ID..." 
            />

            <div className="kc-table-wrap">
              <table className="kc-table">
                <thead>
                  <tr>
                    <th>ID Документа</th>
                    <th>Назва бланку</th>
                    <th>Клієнт</th>
                    <th>Сума контракту</th>
                    <th>Статус підпису</th>
                    <th>Надіслано</th>
                    <th style={{ textAlign: "right" }}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600 }}>{row.id}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon name="file-text" size={14} color="var(--dim)" />
                          <span style={{ fontWeight: 500 }}>{row.title}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Avatar name={row.client} size={20} />
                          <span>{row.client}</span>
                        </div>
                      </td>
                      <td>{row.value}</td>
                      <td>
                        {row.status === "signed" && <Badge status="green" text="Підписано" />}
                        {row.status === "viewed" && <Badge status="brass" text="Переглянуто" />}
                        {row.status === "sent" && <Badge status="blue" text="Надіслано" />}
                        {row.status === "declined" && <Badge status="red" text="Відхилено" />}
                      </td>
                      <td>{row.sent}</td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          <button 
                            className="kc-btn kc-btn-ghost" 
                            style={{ padding: 6, minHeight: "auto" }}
                            title="Переглянути печатку та деталі підпису"
                            onClick={() => setSelectedDoc(row)}
                          >
                            <Icon name="eye" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="kc-grid kc-grid-3">
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Icon name="file-text" size={24} color="var(--color-primary)" />
                <h4 style={{ margin: 0 }}>Pełnomocnictwo (PoA)</h4>
              </div>
              <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)", margin: 0 }}>
                Бланк доручення на представлення інтересів клієнта в ужендах Польщі.
              </p>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)", marginTop: "auto", display: "flex", justifyContent: "space-between" }}>
                <Badge status="green" text="v2.4 (Active)" />
                <button className="kc-btn kc-btn-ghost" style={{ padding: "4px 8px", minHeight: "auto" }}>Вибрати</button>
              </div>
            </div>

            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Icon name="file-text" size={24} color="var(--color-primary)" />
                <h4 style={{ margin: 0 }}>Umowa o pracę (UoP)</h4>
              </div>
              <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)", margin: 0 }}>
                Стандартний трудовий договір польською та українською мовами.
              </p>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)", marginTop: "auto", display: "flex", justifyContent: "space-between" }}>
                <Badge status="green" text="v1.9 (Active)" />
                <button className="kc-btn kc-btn-ghost" style={{ padding: "4px 8px", minHeight: "auto" }}>Вибрати</button>
              </div>
            </div>

            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Icon name="file-text" size={24} color="var(--color-primary)" />
                <h4 style={{ margin: 0 }}>Umowa Zlecenia</h4>
              </div>
              <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)", margin: 0 }}>
                Договір доручення для студентів та тимчасових працівників.
              </p>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)", marginTop: "auto", display: "flex", justifyContent: "space-between" }}>
                <Badge status="green" text="v3.1 (Active)" />
                <button className="kc-btn kc-btn-ghost" style={{ padding: "4px 8px", minHeight: "auto" }}>Вибрати</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai_sign" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", gap: "var(--space-lg)" }}>
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <h3 className="kc-card-cap" style={{ margin: 0 }}>AI Cryptographic Vault</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Hashing Verification Agents</span>
                  <strong style={{ color: "var(--color-primary)" }}>175</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Security Coordinators</span>
                  <strong style={{ color: "var(--color-info)" }}>15</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>HSM Key Custodian</span>
                  <strong style={{ color: "var(--color-success)" }}>1 President</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)", marginTop: 4 }}>
                  <span>Vault Integrity</span>
                  <Badge status="green" text="Secured (SHA)" />
                </div>
              </div>

              <div className="kc-note" style={{ fontSize: "var(--text-xs)" }}>
                <strong>Опис системи:</strong> Агенти в реальному часі прораховують хеші підписаних PDF-документів, звіряють IP-адреси та телефони підписантів, створюючи юридично стійкий доказ підпису.
              </div>
            </div>

            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", background: "#06090e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Консоль криптографічної перевірки (Live Vault logs)</h3>
                <span className="kc-mono" style={{ fontSize: 10, color: "var(--dim)" }}>Auto-updating logs...</span>
              </div>

              <div style={{ 
                flex: 1, maxHeight: 280, overflowY: "auto", fontFamily: "var(--font-mono)", 
                fontSize: "var(--text-xs)", lineHeight: "1.6", color: "#c9d1d9",
                display: "flex", flexDirection: "column", gap: 8
              }}>
                {docLogs.map((log, index) => {
                  let color = "#8b949e";
                  if (log.type === "coordinator") color = "#58a6ff";
                  if (log.type === "system") color = "#56d364";
                  return (
                    <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                      <span style={{ color: "var(--dim)" }}>[{log.time}]</span>{" "}
                      <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Signature Vault Modal Viewer */}
      {selectedDoc && (
        <div className="kc-modal-bg" onClick={() => setSelectedDoc(null)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <div>
                <h3 className="kc-modal-title" style={{ margin: 0 }}>Сертифікат цифрового підпису</h3>
                <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)", margin: "4px 0 0" }}>{selectedDoc.title} · ID: {selectedDoc.id}</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}>
                <Icon name="x" size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", fontSize: "var(--text-sm)" }}>
              <div style={{ background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 600, color: "var(--color-primary)", marginBottom: 8 }}>Криптографічні реквізити:</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--dim)" }}>Підписант (Signer):</span>
                    <strong>{selectedDoc.client}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--dim)" }}>IP-адреса підпису:</span>
                    <span className="kc-mono">{selectedDoc.details.signerIP}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--dim)" }}>СМС-верифікація:</span>
                    <span>{selectedDoc.details.phoneVerified}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--dim)" }}>Час підписання:</span>
                    <span>{selectedDoc.details.signedAt}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", marginTop: 4 }}>
                    <span style={{ color: "var(--dim)" }}>Контрольний хеш PDF (SHA-256):</span>
                    <span className="kc-mono" style={{ fontSize: 11, background: "var(--bg)", padding: 6, borderRadius: 4, marginTop: 4, wordBreak: "break-all" }}>{selectedDoc.details.pdfHash}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "flex-end", marginTop: "var(--space-sm)" }}>
                <button className="kc-btn" onClick={() => setSelectedDoc(null)}>Закрити</button>
                {selectedDoc.status === "signed" && (
                  <button className="kc-btn kc-btn-primary" onClick={() => alert("Договір завантажується...")}>
                    <Icon name="download" size={14} /> Скачати підписаний PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Signature Modal Dialog */}
      {showRequestModal && (
        <div className="kc-modal-bg" onClick={() => setShowRequestModal(false)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <h3 className="kc-modal-title" style={{ margin: 0 }}>Запит на електронний підпис</h3>
              <button onClick={() => setShowRequestModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}>
                <Icon name="x" size={20} />
              </button>
            </div>

            <form onSubmit={handleRequestSignature} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div>
                <label className="kc-label">Виберіть отримувача (Клієнта)</label>
                <select className="kc-select" required>
                  <option value="">-- Оберіть клієнта --</option>
                  <option value="1">Elena Rostova</option>
                  <option value="2">Ivan Ivanov</option>
                  <option value="3">Oksana Koval</option>
                </select>
              </div>

              <div>
                <label className="kc-label">Виберіть шаблон документа</label>
                <select className="kc-select" required>
                  <option value="">-- Оберіть шаблон --</option>
                  <option value="poa">Pełnomocnictwo (PoA) v2.4</option>
                  <option value="uop">Umowa o pracę v1.9</option>
                  <option value="uz">Umowa Zlecenia v3.1</option>
                </select>
              </div>

              <div>
                <label className="kc-label">Сума контракту (опціонально)</label>
                <input type="text" placeholder="Напр. 15,000 PLN" className="kc-input" />
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "flex-end", marginTop: "var(--space-sm)" }}>
                <button type="button" className="kc-btn" onClick={() => setShowRequestModal(false)}>Скасувати</button>
                <button type="submit" className="kc-btn kc-btn-primary">Надіслати клієнту</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
