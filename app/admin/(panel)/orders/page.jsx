"use client";
/* KompasCRM — Замовлення та оплати (kompas_payments).
 *
 * Робоче місце менеджера замість спільної пошти. До цієї сторінки єдиним
 * місцем, де було видно оплату, був лист від Przelewy24 на
 * kompas.migracji@gmail.com — тобто лист банку, а не запис у системі.
 *
 * Попередня версія цього файлу була макетом: `const [orders] = useState([])`,
 * жодного fetch, підписи англійською. Вона показувала порожню таблицю
 * незалежно від того, скільки реальних оплат пройшло.
 *
 * Непідтверджені платежі свідомо стоять першими й підсвічені червоним:
 * verify_failed означає «гроші з клієнта списані, а провайдер нам цього не
 * підтвердив». Це найдорожчий рядок у таблиці, і його не можна ховати
 * під фільтром за замовчуванням. */
import React, { useEffect, useState, useCallback } from "react";
import { Spinner, EmptyState, Badge, DataTable, StatCard, SearchInput } from "@/components/admin/ui";

const STATUS_META = {
  paid:          { badge: "green", label: "Оплачено" },
  pending:       { badge: "blue",  label: "Очікує підтвердження" },
  verify_failed: { badge: "red",   label: "НЕ ПІДТВЕРДЖЕНО" },
  failed:        { badge: "red",   label: "Помилка" },
  refunded:      { badge: "dim",   label: "Повернено" },
  cancelled:     { badge: "dim",   label: "Скасовано" },
};

const STATUS_FILTERS = [
  { id: "",              label: "Всі" },
  { id: "paid",          label: "Оплачені" },
  { id: "verify_failed", label: "Непідтверджені" },
  { id: "pending",       label: "В очікуванні" },
];

function money(grosz, currency) {
  return `${((grosz || 0) / 100).toFixed(2)} ${currency || "PLN"}`;
}

function fmtDateTime(v) {
  if (!v) return "—";
  return new Date(v).toLocaleString("uk-UA", { timeZone: "Europe/Warsaw" });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [totals, setTotals] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("q", search);
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotals(data.totals || null);
    } catch {
      setOrders([]);
    }
  }, [statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  async function claim(sessionId) {
    setBusy(sessionId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, action: "claim" }),
      });
      const data = await res.json();
      setToast(res.ok ? `Взято в роботу: ${data.order_number}` : data.error || "Не вдалося");
      if (res.ok) load();
    } catch {
      setToast("Мережева помилка");
    } finally {
      setBusy("");
      setTimeout(() => setToast(""), 4000);
    }
  }

  const columns = [
    {
      header: "Замовлення",
      cell: (r) => (
        <div>
          <strong>{r.order_number}</strong>
          <div style={{ fontSize: 12, color: "var(--dim)" }}>
            {fmtDateTime(r.paid_at || r.created_at)}
          </div>
        </div>
      ),
    },
    {
      header: "Статус",
      cell: (r) => {
        const meta = STATUS_META[r.status] || { badge: "dim", label: r.status };
        return (
          <div>
            <Badge status={meta.badge} text={meta.label} />
            {r.status === "verify_failed" && (
              <div style={{ fontSize: 11, color: "#991B1B", marginTop: 4, maxWidth: 260 }}>
                Гроші, найімовірніше, списані. Звір транзакцію в панелі P24 —
                не проси клієнта платити вдруге.
              </div>
            )}
          </div>
        );
      },
    },
    { header: "Сума", cell: (r) => <strong>{money(r.amount_grosz, r.currency)}</strong> },
    {
      header: "Клієнт",
      cell: (r) => (
        <div>
          <div>{r.customer_name || "—"}</div>
          <div style={{ fontSize: 12, color: "var(--dim)" }}>
            {r.customer_phone || ""}{r.customer_email ? ` · ${r.customer_email}` : ""}
          </div>
        </div>
      ),
    },
    { header: "Послуга", cell: (r) => r.description || r.service_slug || "—" },
    { header: "Спосіб", cell: (r) => r.method || r.provider || "—" },
    {
      header: "Робота",
      cell: (r) =>
        r.claimed_at ? (
          <div style={{ fontSize: 12 }}>
            <Badge status="dim" text="В роботі" />
            <div style={{ color: "var(--dim)", marginTop: 4 }}>{r.claimed_by_name || "—"}</div>
          </div>
        ) : (
          <button
            className="kc-btn kc-btn-primary"
            disabled={busy === r.session_id}
            onClick={() => claim(r.session_id)}
          >
            {busy === r.session_id ? "…" : "Взяти в роботу"}
          </button>
        ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <h1 style={{ margin: 0 }}>Замовлення та оплати</h1>
        <p style={{ color: "var(--dim)", margin: "6px 0 0" }}>
          Кожна оплата з сайту, бота й месенджерів потрапляє сюди автоматично.
          Пошта лишається лише резервним сповіщенням.
        </p>
      </div>

      {totals && (
        <div className="kc-grid kc-grid-4" style={{ marginBottom: "var(--space-lg)" }}>
          <StatCard icon="check"  value={totals.paid_count} label="Оплачених замовлень" />
          <StatCard icon="cash" value={money(totals.paid_grosz, "PLN")} label="Отримано всього" />
          <StatCard icon="alert"  value={totals.failed_count} label="Не підтверджено провайдером" />
          <StatCard icon="clock"  value={totals.unclaimed_count} label="Ще ніхто не взяв у роботу" />
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", margin: "16px 0" }}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            className={`kc-btn ${statusFilter === f.id ? "kc-btn-primary" : "kc-btn-ghost"}`}
            onClick={() => setStatusFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Номер, ім'я, телефон, email…"
          style={{ marginLeft: "auto", minWidth: 260 }}
        />
      </div>

      {toast && (
        <div style={{
          padding: "10px 14px", marginBottom: "var(--space-md)", borderRadius: 8,
          background: "var(--panel)", border: "1px solid var(--border)", color: "var(--dim)",
        }}>
          {toast}
        </div>
      )}

      {orders === null ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Замовлень поки немає"
          description="Щойно клієнт оплатить — замовлення з'явиться тут без ручного втручання."
          icon="cash"
        />
      ) : (
        <DataTable columns={columns} data={orders} />
      )}
    </div>
  );
}
