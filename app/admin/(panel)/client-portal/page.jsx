"use client";
/* KompasCRM — Портал клієнтів: видані доступи.
 *
 * Попередня версія була макетом: `const [portals] = useState([])`,
 * `const [logs] = useState([])`, жодного fetch. Через це PIN не було звідки
 * видати — а навіть якби кнопка існувала, POST /api/portal/case однаково
 * відповідав би 400: він робив Number(leadId) при leads.id типу uuid.
 *
 * Тому портал за весь час існування не отримав жодного рядка в
 * kompas_portal_sessions. Тепер PIN видається автоматично в мить
 * підтвердження оплати, а ця сторінка потрібна для решти випадків:
 * клієнт загубив доступ, або справу ведуть без онлайн-оплати. */
import React, { useEffect, useState, useCallback } from "react";
import { Spinner, EmptyState, Badge, DataTable, StatCard, SearchInput } from "@/components/admin/ui";

function fmt(v) {
  return v ? new Date(v).toLocaleString("uk-UA", { timeZone: "Europe/Warsaw" }) : "—";
}

export default function ClientPortalPage() {
  const [sessions, setSessions] = useState(null);
  const [search, setSearch] = useState("");
  const [leadId, setLeadId] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/portal/case");
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {
      setSessions([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function issue() {
    const id = leadId.trim();
    if (!id) return;
    setBusy(true);
    try {
      const res = await fetch("/api/portal/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast(
          `PIN ${data.pin}${data.existed ? " (вже був виданий раніше)" : ""}` +
          `${data.sent ? " — надіслано клієнту в Telegram" : " — Telegram недоступний, продиктуйте вручну"}`,
        );
        setLeadId("");
        load();
      } else {
        setToast(data.error || "Не вдалося видати доступ");
      }
    } catch {
      setToast("Мережева помилка");
    } finally {
      setBusy(false);
      setTimeout(() => setToast(""), 8000);
    }
  }

  const filtered = (sessions || []).filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(s.pin || "").toLowerCase().includes(q) ||
      String(s.client_name || "").toLowerCase().includes(q) ||
      String(s.service || "").toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      header: "PIN",
      cell: (r) => (
        <span style={{ fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em" }}>{r.pin}</span>
      ),
    },
    { header: "Клієнт", cell: (r) => r.client_name || "—" },
    { header: "Послуга", cell: (r) => r.service || "—" },
    {
      header: "Стан справи",
      cell: (r) => <Badge status={r.lead_status || "new"} />,
    },
    {
      header: "Заходив у портал",
      cell: (r) =>
        r.accessed_at ? (
          <span style={{ fontSize: 12 }}>{fmt(r.accessed_at)}</span>
        ) : (
          <span style={{ fontSize: 12, color: "var(--dim)" }}>жодного разу</span>
        ),
    },
    { header: "PIN надіслано", cell: (r) => <span style={{ fontSize: 12 }}>{fmt(r.pin_sent_at)}</span> },
  ];

  const neverOpened = (sessions || []).filter((s) => !s.accessed_at).length;

  return (
    <div>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <h1 style={{ margin: 0 }}>Портал клієнтів</h1>
        <p style={{ color: "var(--dim)", margin: "6px 0 0" }}>
          Після підтвердження оплати доступ видається автоматично — клієнт отримує
          PIN у листі й у Telegram. Ця сторінка потрібна, коли клієнт загубив доступ
          або справу ведуть без онлайн-оплати.
        </p>
      </div>

      {sessions && (
        <div className="kc-grid kc-grid-4" style={{ marginBottom: "var(--space-lg)" }}>
          <StatCard icon="key" value={sessions.length} label="Виданих доступів" />
          <StatCard icon="clock" value={neverOpened} label="Жодного разу не відкрили" />
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: "var(--space-md)" }}>
        <input
          className="kc-input"
          value={leadId}
          onChange={(e) => setLeadId(e.target.value)}
          placeholder="uuid ліда — напр. 5426a084-13c8-4b12-8c6c-5087bd489f97"
          style={{ minWidth: 380 }}
        />
        <button className="kc-btn kc-btn-primary" onClick={issue} disabled={busy || !leadId.trim()}>
          {busy ? "…" : "Видати доступ"}
        </button>
        <SearchInput value={search} onChange={setSearch} placeholder="PIN, ім'я, послуга…" style={{ marginLeft: "auto", minWidth: 240 }} />
      </div>

      {toast && (
        <div style={{
          padding: "10px 14px", marginBottom: "var(--space-md)", borderRadius: 8,
          background: "var(--panel)", border: "1px solid var(--border)", color: "var(--dim)",
        }}>
          {toast}
        </div>
      )}

      {sessions === null ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Доступів поки немає"
          description="Перший з'явиться автоматично після наступної підтвердженої оплати."
          icon="key"
        />
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
    </div>
  );
}
