"use client";
/* /admin/settings — налаштування CRM: команда, змiна пароля, безпека. */
import React, { useEffect, useState } from "react";
import { Icon, Spinner, Badge, Empty } from "@/components/admin/ui";
import { ROLE_LABEL } from "@/lib/rbac";

export default function SettingsPage() {
  const [me, setMe] = useState(null);
  const [team, setTeam] = useState(null);
  const [error, setError] = useState("");

  /* запрошення */
  const [invite, setInvite] = useState(null); // {full_name,email,role} | null
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteErr, setInviteErr] = useState("");
  const [created, setCreated] = useState(null); // {email,temp_password,role}

  /* змiна пароля */
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdBusy, setPwdBusy] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");

  const loadTeam = () => {
    fetch("/api/admin/team")
      .then((r) => r.json())
      .then((d) => (d.error ? null : setTeam(d.team)))
      .catch(() => setError("Не вдалося завантажити команду"));
  };

  useEffect(() => {
    fetch("/api/admin/auth/me").then((r) => r.json()).then((d) => setMe(d.user));
    loadTeam();
  }, []);

  const sendInvite = async () => {
    if (!invite.full_name.trim() || !invite.email.trim()) {
      setInviteErr("Iм'я та email обов'язковi");
      return;
    }
    setInviteBusy(true); setInviteErr("");
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invite),
      });
      const d = await res.json();
      if (d.error) { setInviteErr(d.error); return; }
      setCreated({ email: invite.email, temp_password: d.temp_password, role: d.role });
      setInvite(null);
      loadTeam();
    } catch {
      setInviteErr("Мережа недоступна");
    } finally {
      setInviteBusy(false);
    }
  };

  const changePwd = async () => {
    if (pwd.next.length < 6) { setPwdMsg("⚠ Новий пароль — мiнiмум 6 символiв"); return; }
    if (pwd.next !== pwd.confirm) { setPwdMsg("⚠ Паролi не збiгаються"); return; }
    setPwdBusy(true); setPwdMsg("");
    try {
      const res = await fetch("/api/admin/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: pwd.current, next: pwd.next }),
      });
      const d = await res.json();
      if (d.error) { setPwdMsg("⚠ " + d.error); return; }
      setPwd({ current: "", next: "", confirm: "" });
      setPwdMsg("Пароль змiнено");
    } catch {
      setPwdMsg("⚠ Мережа недоступна");
    } finally {
      setPwdBusy(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="kc-error" style={{ marginBottom: 14 }}>
          <Icon name="settings" size={15} color="#d96c6c" />
          <span>{error}</span>
        </div>
      )}

      <div className="kc-grid kc-grid-2">
        {/* команда CRM */}
        <div className="kc-card">
          <div className="kc-row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
            <div className="kc-card-cap" style={{ margin: 0 }}>Команда CRM</div>
            <button className="kc-btn kc-btn-primary"
              onClick={() => { setInvite({ full_name: "", email: "", role: "moderator" }); setInviteErr(""); }}>
              <Icon name="plus" size={14} /> Запросити
            </button>
          </div>
          {!team ? <Spinner /> : team.length === 0 ? <Empty text="Команда порожня" /> : (
            <div>
              {team.map((u) => (
                <div key={u.id} className="kc-row"
                  style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div className="kc-avatar" style={{ width: 30, height: 30 }}>
                    {(u.full_name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{u.full_name}</div>
                    <div style={{ color: "#5a6470", fontSize: 12 }}>{u.email}</div>
                  </div>
                  <Badge status={u.role === "admin" ? "brass" : "blue"}
                    text={ROLE_LABEL[u.role] || u.role} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* змiна пароля */}
        <div className="kc-card">
          <div className="kc-card-cap">Змiна пароля</div>
          {me && (
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{me.name}</span>
              <span style={{ color: "#828c9b", fontSize: 13 }}> · {me.email}</span>
            </div>
          )}
          <div className="kc-field">
            <label className="kc-label">Поточний пароль</label>
            <input className="kc-input" type="password" value={pwd.current}
              onChange={(e) => setPwd({ ...pwd, current: e.target.value })} />
          </div>
          <div className="kc-field">
            <label className="kc-label">Новий пароль</label>
            <input className="kc-input" type="password" value={pwd.next}
              onChange={(e) => setPwd({ ...pwd, next: e.target.value })} />
          </div>
          <div className="kc-field">
            <label className="kc-label">Повторiть новий пароль</label>
            <input className="kc-input" type="password" value={pwd.confirm}
              onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
          </div>
          {pwdMsg && (
            <div className={pwdMsg.startsWith("⚠") ? "kc-error" : "kc-note"}
              style={{ marginBottom: 10 }}>
              {pwdMsg}
            </div>
          )}
          <button className="kc-btn kc-btn-primary" disabled={pwdBusy}
            onClick={changePwd} style={{ width: "100%", justifyContent: "center" }}>
            {pwdBusy ? "Збереження…" : "Змiнити пароль"}
          </button>
        </div>

        {/* безпека */}
        <div className="kc-card">
          <div className="kc-card-cap">Безпека</div>
          <ul style={{ color: "#828c9b", fontSize: 13, lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
            <li>JWT в httpOnly-cookie, термiн 7 днiв</li>
            <li>Паролi — bcrypt, 10 раундiв</li>
            <li>Захист маршрутiв — middleware.js + requireAuth</li>
            <li>Журнал дiй — таблиця kompas_audit_log</li>
            <li>Iзоляцiя: префiкси kompas_ / /api/admin / kc-</li>
          </ul>
        </div>

        {/* дорожня карта */}
        <div className="kc-card">
          <div className="kc-card-cap">Дорожня карта</div>
          <ul style={{ color: "#828c9b", fontSize: 13, lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
            <li>Refresh-токени та вiдкликання сесiй</li>
            <li>Модуль юридичних справ /admin/cases</li>
            <li>Експорт реєстру учасникiв у CSV</li>
            <li>Оплата внескiв через Przelewy24</li>
            <li>Двофакторна автентифiкацiя</li>
          </ul>
        </div>
      </div>

      {/* модалка запрошення */}
      {invite && (
        <div className="kc-modal-bg" onClick={() => setInvite(null)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="kc-modal-title">Запросити в команду</div>
            {inviteErr && (
              <div className="kc-error" style={{ marginBottom: 12 }}>
                <Icon name="settings" size={15} color="#d96c6c" />
                <span>{inviteErr}</span>
              </div>
            )}
            <div className="kc-field">
              <label className="kc-label">Iм&apos;я та прiзвище</label>
              <input className="kc-input" value={invite.full_name}
                onChange={(e) => setInvite({ ...invite, full_name: e.target.value })}
                placeholder="Юлiя Онищак" />
            </div>
            <div className="kc-field">
              <label className="kc-label">Email</label>
              <input className="kc-input" type="email" autoCapitalize="none"
                value={invite.email}
                onChange={(e) => setInvite({ ...invite, email: e.target.value })}
                placeholder="kolega@kompasmigracji.com" />
            </div>
            <div className="kc-field">
              <label className="kc-label">Роль</label>
              <select className="kc-select" value={invite.role}
                onChange={(e) => setInvite({ ...invite, role: e.target.value })}>
                <option value="moderator">Модератор — учасники та лiди</option>
                <option value="admin">Адмiнiстратор — повний доступ</option>
              </select>
            </div>
            <div className="kc-row" style={{ justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setInvite(null)}>
                Скасувати
              </button>
              <button className="kc-btn kc-btn-primary" disabled={inviteBusy}
                onClick={sendInvite}>
                {inviteBusy ? "Створення…" : "Створити доступ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* тимчасовий пароль нового члена команди */}
      {created && (
        <div className="kc-modal-bg" onClick={() => setCreated(null)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="kc-modal-title">Доступ створено</div>
            <p style={{ color: "#828c9b", fontSize: 13, lineHeight: 1.6 }}>
              Передайте цi данi колезi особисто. Тимчасовий пароль показується
              один раз — вiн змiнить його в роздiлi «Налаштування».
            </p>
            <div className="kc-card" style={{ background: "var(--bg)", marginTop: 6 }}>
              <div style={{ fontSize: 12, color: "#828c9b" }}>Email</div>
              <div className="kc-mono" style={{ marginBottom: 8 }}>{created.email}</div>
              <div style={{ fontSize: 12, color: "#828c9b" }}>Тимчасовий пароль</div>
              <div className="kc-mono" style={{ color: "#d99e54", fontSize: 16 }}>
                {created.temp_password}
              </div>
            </div>
            <button className="kc-btn kc-btn-primary" onClick={() => setCreated(null)}
              style={{ width: "100%", justifyContent: "center", marginTop: 14 }}>
              Готово
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
