"use client";
/* /admin/members/[id] — карточка участника профсоюза. */
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge, Spinner, Empty, Icon } from "@/components/admin/ui";

export default function MemberCard() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/members/" + id)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return; }
        setData(d);
        setDraft({
          full_name: d.member.full_name, phone: d.member.phone || "",
          city: d.member.city || "", category: d.member.category || "standard",
          status: d.member.status, dues_status: d.member.dues_status || "unpaid",
          notes: d.member.notes || "",
        });
      })
      .catch(() => setError("Ошибка загрузки"));
  };
  useEffect(load, [id]);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/members/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false); setEdit(false); load();
  };

  const remove = async () => {
    if (!confirm("Удалить участника безвозвратно?")) return;
    await fetch("/api/admin/members/" + id, { method: "DELETE" });
    router.push("/admin/members");
  };

  if (error) return <div className="kc-error"><Icon name="settings" size={15} color="#d96c6c" /><span>{error}</span></div>;
  if (!data) return <Spinner />;
  const m = data.member;

  return (
    <div>
      <button className="kc-btn kc-btn-ghost" onClick={() => router.push("/admin/members")}
        style={{ marginBottom: 14 }}>
        <Icon name="back" size={15} /> К списку
      </button>

      <div className="kc-grid kc-grid-2">
        {/* профиль */}
        <div className="kc-card">
          <div className="kc-row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
            <div className="kc-card-cap" style={{ margin: 0 }}>Профиль участника</div>
            {!edit && (
              <button className="kc-btn kc-btn-ghost" onClick={() => setEdit(true)}
                style={{ padding: "5px 10px", fontSize: 12 }}>Изменить</button>
            )}
          </div>

          {!edit ? (
            <div>
              <div style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 600 }}>
                {m.full_name}
              </div>
              <div className="kc-mono" style={{ color: "#d99e54", fontSize: 13, marginTop: 2 }}>
                {m.member_no}
              </div>
              <div className="kc-row" style={{ gap: 8, margin: "10px 0" }}>
                <Badge status={m.status} />
                <Badge status={m.dues_status || "unpaid"} />
                <Badge status="open" text={m.category || "standard"} />
              </div>
              <InfoRow k="Email" v={m.email} />
              <InfoRow k="Телефон" v={m.phone || "—"} />
              <InfoRow k="Город" v={m.city || "—"} />
              <InfoRow k="Вступил" v={m.join_date || "—"} />
              {m.notes ? <InfoRow k="Заметки" v={m.notes} /> : null}
            </div>
          ) : (
            <div>
              <EditField label="ФИО" value={draft.full_name}
                onChange={(v) => setDraft({ ...draft, full_name: v })} />
              <EditField label="Телефон" value={draft.phone}
                onChange={(v) => setDraft({ ...draft, phone: v })} />
              <EditField label="Город" value={draft.city}
                onChange={(v) => setDraft({ ...draft, city: v })} />
              <Select label="Статус" value={draft.status}
                onChange={(v) => setDraft({ ...draft, status: v })}
                opts={[["active", "Активен"], ["pending", "Ожидает"], ["suspended", "Заблокирован"]]} />
              <Select label="Взносы" value={draft.dues_status}
                onChange={(v) => setDraft({ ...draft, dues_status: v })}
                opts={[["paid", "Оплачено"], ["unpaid", "Не оплачено"], ["exempt", "Освобождён"]]} />
              <Select label="Категория" value={draft.category}
                onChange={(v) => setDraft({ ...draft, category: v })}
                opts={[["standard", "Стандарт"], ["premium", "Премиум"], ["honorary", "Почётный"]]} />
              <div className="kc-field">
                <label className="kc-label">Заметки</label>
                <textarea className="kc-textarea" value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
              </div>
              <div className="kc-row" style={{ justifyContent: "space-between" }}>
                <button className="kc-btn kc-btn-danger" onClick={remove}>Удалить</button>
                <div className="kc-row" style={{ gap: 8 }}>
                  <button className="kc-btn kc-btn-ghost" onClick={() => setEdit(false)}>Отмена</button>
                  <button className="kc-btn kc-btn-primary" onClick={save} disabled={saving}>
                    {saving ? "…" : "Сохранить"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* взносы и дела */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="kc-card">
            <div className="kc-card-cap">Членские взносы</div>
            {data.dues.length ? data.dues.map((d) => (
              <div key={d.id} className="kc-row"
                style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span className="kc-mono" style={{ flex: 1 }}>{d.period}</span>
                <span style={{ color: "#828c9b" }}>{Number(d.amount).toFixed(2)} zł</span>
                <Badge status={d.paid ? "paid" : "unpaid"} />
              </div>
            )) : <Empty text="Взносов нет" />}
          </div>
          <div className="kc-card">
            <div className="kc-card-cap">Юридические дела</div>
            {data.cases.length ? data.cases.map((c) => (
              <div key={c.id} className="kc-row"
                style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ flex: 1, fontSize: 13.5 }}>{c.title}</span>
                <Badge status={c.status} />
              </div>
            )) : <Empty text="Дел нет" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ k, v }) {
  return (
    <div className="kc-row" style={{ padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ color: "#5a6470", fontSize: 12, width: 90 }}>{k}</span>
      <span style={{ fontSize: 13.5 }}>{v}</span>
    </div>
  );
}
function EditField({ label, value, onChange }) {
  return (
    <div className="kc-field">
      <label className="kc-label">{label}</label>
      <input className="kc-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
function Select({ label, value, onChange, opts }) {
  return (
    <div className="kc-field">
      <label className="kc-label">{label}</label>
      <select className="kc-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}
