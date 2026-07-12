"use client";
/* /admin/members — учасники профспілки: список, живий пошук, додавання. */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Badge, Spinner, EmptyState, Icon } from "@/components/admin/ui";
import ImportWizard from "@/components/admin/ImportWizard";

const CATEGORY_LABEL = {
  standard: "Стандарт",
  premium: "Преміум",
  honorary: "Почесний",
};

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState(null); // null = перше завантаження
  const [isSearching, setIsSearching] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const debounceRef = useRef(null);

  // Живий пошук: список не скидаємо в спінер, лише позначаємо isSearching
  const load = useCallback(async (s) => {
    setIsSearching(true);
    setLoadError(false);
    try {
      const res = await fetch("/api/admin/members?search=" + encodeURIComponent(s || ""));
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMembers(data.members || []);
    } catch {
      setLoadError(true);
      setMembers((prev) => prev || []);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => { load(""); }, [load]);

  const onSearchChange = (value) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(value), 350);
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <div>
      <div className="kc-row" style={{ marginBottom: 14, gap: "var(--space-sm)", flexWrap: "wrap" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 280 }}>
          <span style={{ position: "absolute", left: 11, top: 10, color: "var(--faint)" }}>
            <Icon name="search" size={16} />
          </span>
          <input className="kc-input" style={{ paddingLeft: 34 }}
            placeholder="Пошук за іменем, email, номером квитка…"
            value={search} onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(search)} />
          {isSearching && members !== null && (
            <span style={{ position: "absolute", right: 12, top: 10, color: "var(--faint)", fontSize: 12 }}>…</span>
          )}
        </div>
        
        <a href="/api/admin/export?entity_type=members" download className="kc-btn">
          <Icon name="download" size={16} /> Експорт
        </a>
        <button onClick={() => setIsImportOpen(true)} className="kc-btn">
          <Icon name="upload" size={16} /> Імпорт
        </button>
        
        <button className="kc-btn kc-btn-primary" onClick={() => setModal(true)}>
          <Icon name="plus" size={16} /> Новий учасник
        </button>
      </div>

      {loadError && (
        <div className="kc-error" style={{ marginBottom: 12 }}>
          <Icon name="alert" size={15} />
          <span>Не вдалося завантажити учасників.</span>
          <button className="kc-btn kc-btn-ghost" style={{ marginLeft: "auto", minHeight: 26, padding: "2px 10px" }}
            onClick={() => load(search)}>Повторити</button>
        </div>
      )}

      {members === null ? <Spinner /> : members.length === 0 ? (
        <EmptyState
          title={search ? "Учасників не знайдено" : "Ще немає учасників"}
          description={search ? "Спробуйте змінити запит пошуку" : "Додайте першого учасника кнопкою «Новий учасник»"}
          icon="users" />
      ) : (
        <>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 8 }}>
            Знайдено: <b style={{ color: "var(--text)" }}>{members.length}</b>
            {members.length === 200 ? " (показано перші 200)" : ""}
          </div>
          <div className="kc-table-wrap">
            <table className="kc-table">
              <thead>
                <tr>
                  <th>Квиток</th><th>Учасник</th><th>Місто</th>
                  <th>Категорія</th><th>Внески</th><th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} onClick={() => router.push("/admin/members/" + m.id)}>
                    <td className="kc-mono" style={{ color: "var(--color-primary)" }}>{m.member_no || "—"}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{m.full_name}</div>
                      <div style={{ color: "var(--dim)", fontSize: 12 }}>{m.email}</div>
                    </td>
                    <td style={{ color: "var(--dim)" }}>{m.city || "—"}</td>
                    <td style={{ color: "var(--dim)" }}>{CATEGORY_LABEL[m.category] || CATEGORY_LABEL.standard}</td>
                    <td><Badge status={m.dues_status || "unpaid"} /></td>
                    <td><Badge status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modal && (
        <AddMemberModal onClose={() => setModal(false)}
          onCreated={() => { setModal(false); load(search); }} />
      )}

      <ImportWizard 
        entityType="members"
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={() => load(search)}
      />
    </div>
  );
}

function AddMemberModal({ onClose, onCreated }) {
  const [f, setF] = useState({ full_name: "", email: "", phone: "", city: "", category: "standard" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(null);

  const submit = async () => {
    if (!f.full_name || !f.email) { setError("Ім'я та email обов'язкові"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) { setError("Некоректний формат email"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Помилка"); return; }
      setDone(data);
    } catch {
      setError("Помилка з'єднання з сервером");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="kc-modal-bg" onClick={onClose}>
      <div className="kc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kc-modal-title">Новий учасник профспілки</div>

        {done ? (
          <div>
            <div className="kc-note" style={{ marginBottom: 14 }}>
              Учасника створено. Номер квитка: <b>{done.member_no}</b>
              {done.temp_password && (
                <div style={{ marginTop: 6 }}>
                  Тимчасовий пароль для входу в кабінет:{" "}
                  <b className="kc-mono">{done.temp_password}</b>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    Передайте учаснику — пароль показано один раз.
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
              <Icon name="alert" size={15} color="var(--color-danger)" /><span>{error}</span></div>}
            <Field label="ПІБ" value={f.full_name} onChange={(v) => setF({ ...f, full_name: v })} />
            <Field label="Email" value={f.email} onChange={(v) => setF({ ...f, email: v })} />
            <Field label="Телефон" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
            <Field label="Місто" value={f.city} onChange={(v) => setF({ ...f, city: v })} />
            <div className="kc-field">
              <label className="kc-label">Категорія</label>
              <select className="kc-select" value={f.category}
                onChange={(e) => setF({ ...f, category: e.target.value })}>
                <option value="standard">Стандарт</option>
                <option value="premium">Преміум</option>
                <option value="honorary">Почесний</option>
              </select>
            </div>
            <div className="kc-row" style={{ justifyContent: "flex-end", gap: 8 }}>
              <button className="kc-btn kc-btn-ghost" onClick={onClose}>Скасувати</button>
              <button className="kc-btn kc-btn-primary" onClick={submit} disabled={saving}>
                {saving ? "Створення…" : "Створити"}
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
