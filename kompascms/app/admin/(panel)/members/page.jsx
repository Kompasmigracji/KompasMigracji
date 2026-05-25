"use client";
/* /admin/members — участники профсоюза: список, поиск, добавление. */
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge, Spinner, Empty, Icon } from "@/components/admin/ui";

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);

  const load = useCallback(async (s) => {
    setMembers(null);
    const res = await fetch("/api/admin/members?search=" + encodeURIComponent(s || ""));
    const data = await res.json();
    setMembers(data.members || []);
  }, []);

  useEffect(() => { load(""); }, [load]);

  return (
    <div>
      <div className="kc-row" style={{ marginBottom: 14 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: 11, top: 10, color: "#5a6470" }}>
            <Icon name="search" size={16} />
          </span>
          <input className="kc-input" style={{ paddingLeft: 34 }}
            placeholder="Поиск по имени, email, номеру билета…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(search)} />
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => setModal(true)}>
          <Icon name="plus" size={16} /> Новый участник
        </button>
      </div>

      {members === null ? <Spinner /> : members.length === 0 ? (
        <Empty text="Участники не найдены" />
      ) : (
        <div className="kc-table-wrap">
          <table className="kc-table">
            <thead>
              <tr>
                <th>Билет</th><th>Участник</th><th>Город</th>
                <th>Категория</th><th>Взносы</th><th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} onClick={() => router.push("/admin/members/" + m.id)}>
                  <td className="kc-mono" style={{ color: "#d99e54" }}>{m.member_no || "—"}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{m.full_name}</div>
                    <div style={{ color: "#5a6470", fontSize: 12 }}>{m.email}</div>
                  </td>
                  <td style={{ color: "#828c9b" }}>{m.city || "—"}</td>
                  <td style={{ color: "#828c9b" }}>{m.category || "standard"}</td>
                  <td><Badge status={m.dues_status || "unpaid"} /></td>
                  <td><Badge status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <AddMemberModal onClose={() => setModal(false)}
          onCreated={() => { setModal(false); load(search); }} />
      )}
    </div>
  );
}

function AddMemberModal({ onClose, onCreated }) {
  const [f, setF] = useState({ full_name: "", email: "", phone: "", city: "", category: "standard" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(null);

  const submit = async () => {
    if (!f.full_name || !f.email) { setError("Имя и email обязательны"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Ошибка"); return; }
    setDone(data);
  };

  return (
    <div className="kc-modal-bg" onClick={onClose}>
      <div className="kc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kc-modal-title">Новый участник профсоюза</div>

        {done ? (
          <div>
            <div className="kc-note" style={{ marginBottom: 14 }}>
              Участник создан. Номер билета: <b>{done.member_no}</b>
              {done.temp_password && (
                <div style={{ marginTop: 6 }}>
                  Временный пароль для входа в кабинет:{" "}
                  <b className="kc-mono">{done.temp_password}</b>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    Передай участнику — пароль показан один раз.
                  </div>
                </div>
              )}
            </div>
            <button className="kc-btn kc-btn-primary" style={{ width: "100%", justifyContent: "center" }}
              onClick={onCreated}>Готово</button>
          </div>
        ) : (
          <div>
            {error && <div className="kc-error" style={{ marginBottom: 12 }}>
              <Icon name="settings" size={15} color="#d96c6c" /><span>{error}</span></div>}
            <Field label="ФИО" value={f.full_name} onChange={(v) => setF({ ...f, full_name: v })} />
            <Field label="Email" value={f.email} onChange={(v) => setF({ ...f, email: v })} />
            <Field label="Телефон" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
            <Field label="Город" value={f.city} onChange={(v) => setF({ ...f, city: v })} />
            <div className="kc-field">
              <label className="kc-label">Категория</label>
              <select className="kc-select" value={f.category}
                onChange={(e) => setF({ ...f, category: e.target.value })}>
                <option value="standard">Стандарт</option>
                <option value="premium">Премиум</option>
                <option value="honorary">Почётный</option>
              </select>
            </div>
            <div className="kc-row" style={{ justifyContent: "flex-end", gap: 8 }}>
              <button className="kc-btn kc-btn-ghost" onClick={onClose}>Отмена</button>
              <button className="kc-btn kc-btn-primary" onClick={submit} disabled={saving}>
                {saving ? "Создание…" : "Создать"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div className="kc-field">
      <label className="kc-label">{label}</label>
      <input className="kc-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
