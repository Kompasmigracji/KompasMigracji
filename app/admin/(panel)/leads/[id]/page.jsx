"use client";
/* KompasCRM — Lead Detail View */
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner, EmptyState, Icon, Badge, Avatar } from "@/components/admin/ui";

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLead() {
      try {
        // Normally we'd have a specific GET /api/admin/leads/:id
        // For now, fetch all and find, or call a newly created API route
        const res = await fetch(`/api/admin/leads/${id}`);
        if (res.ok) {
          const data = await res.json();
          setLead(data.lead);
        } else {
          // fallback to list if endpoint doesn't exist yet
          const listRes = await fetch("/api/admin/leads");
          const listData = await listRes.json();
          setLead(listData.leads?.find(l => String(l.id) === String(id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLead();
  }, [id]);

  if (isLoading) return <Spinner />;
  if (!lead) return <EmptyState title="Лід не знайдено" icon="alert" />;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <button 
          className="kc-btn kc-btn-ghost" 
          onClick={() => router.push("/admin/leads")}
          style={{ padding: "8px" }}
        >
          <Icon name="back" size={20} />
        </button>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <h1 className="kc-h2" style={{ margin: 0 }}>{lead.name || "Без імені"}</h1>
            <Badge status={lead.status} />
          </div>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", marginTop: 4 }}>
            Створено: {new Date(lead.created_at).toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--space-lg)", alignItems: "start" }}>
        
        {/* Left Column: Lead Info & Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <div className="kc-card">
            <h3 className="kc-card-cap">Контактна інформація</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                <div style={{ color: "var(--color-primary)" }}><Icon name="user" size={18} /></div>
                <div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Ім&apos;я</div>
                  <div style={{ fontWeight: 500 }}>{lead.name || "Не вказано"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                <div style={{ color: "var(--color-primary)" }}><Icon name="target" size={18} /></div>
                <div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Контакт</div>
                  <div style={{ fontWeight: 500 }}>{lead.contact || "Не вказано"}</div>
                </div>
              </div>
              {lead.username && (
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                  <div style={{ color: "var(--color-info)" }}><Icon name="send" size={18} /></div>
                  <div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Telegram</div>
                    <a href={`https://t.me/${lead.username}`} target="_blank" className="kc-link">@{lead.username}</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="kc-card">
            <h3 className="kc-card-cap">Деталі запиту</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 4 }}>Джерело</div>
                <Badge status="dim" text={lead.source} />
              </div>
              <div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 4 }}>Послуга</div>
                <div style={{ fontWeight: 500 }}>{lead.service || "Не вибрано"}</div>
              </div>
              {lead.message && (
                <div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 4 }}>Повідомлення</div>
                  <div style={{ padding: "var(--space-md)", background: "var(--panel-2)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)" }}>
                    {lead.message}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="kc-card">
            <h3 className="kc-card-cap">Швидкі дії</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <button className="kc-btn kc-btn-primary" style={{ justifyContent: "flex-start" }}>
                <Icon name="send" size={16} /> Написати в Telegram
              </button>
              <button className="kc-btn" style={{ justifyContent: "flex-start" }}>
                <Icon name="cash" size={16} /> Виставити рахунок (Przelewy24)
              </button>
              <button className="kc-btn" style={{ justifyContent: "flex-start" }}>
                <Icon name="users" size={16} /> Призначити агента
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline / Activity */}
        <div className="kc-card" style={{ minHeight: 600 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0 }}>Історія взаємодій (Timeline)</h3>
            <button className="kc-btn kc-btn-ghost" style={{ padding: "4px 8px" }}>
              <Icon name="plus" size={16} /> Нова нотатка
            </button>
          </div>

          {/* Simple Timeline Mockup (until we build the backend) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            <div style={{ display: "flex", gap: "var(--space-md)" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-primary)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="zap" size={16} />
              </div>
              <div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", marginBottom: 4 }}>
                  <strong style={{ color: "var(--text)" }}>Система</strong> створила лід з джерела {lead.source}
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--faint)" }}>
                  {new Date(lead.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            
            {lead.status !== "new" && (
              <div style={{ display: "flex", gap: "var(--space-md)" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-info)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="target" size={16} />
                </div>
                <div>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", marginBottom: 4 }}>
                    Статус змінено на <Badge status={lead.status} />
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--faint)" }}>
                    Нещодавно
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
