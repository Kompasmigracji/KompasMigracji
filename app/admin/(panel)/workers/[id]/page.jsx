"use client";
/* /admin/workers/[id] — особистий кабiнет спiвробiтника (admin/moderator).
   Показує профiль, статистику та поточнi справи у канбан-форматi. */
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon, Spinner, StatCard } from "@/components/admin/ui";

const STAGES = [
  { key: "analysis",   label: "Аналiз документiв",  color: "#6fa3d4" },
  { key: "ponaglenie", label: "Понаглення подано",   color: "#d99e54" },
  { key: "court",      label: "Пiдготовка до суду",  color: "#d96c6c" },
];

const ROLE_LABEL = {
  admin:     "Адмiнiстратор",
  moderator: "Модератор",
};

const WORKER_COLORS = ["#6fa3d4","#d99e54","#5fb87a","#d96c6c","#9b7fd4","#54c4d9","#d4a76f","#7fd4c4"];

function workerColor(id) {
  return WORKER_COLORS[Number(id) % WORKER_COLORS.length];
}

function initials(name) {
  return (name || "?").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

function fmtDate(d) {
  if (!d) return "Нiколи";
  return new Date(d).toLocaleDateString("uk-UA", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function WorkerCabinet() {
  const { id } = useParams();
  const [data, setData]   = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/workers/${id}`);
    const d = await r.json();
    if (d.error) { setError(d.error); return; }
    setData(d);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (error) {
    return (
      <div>
        <Link href="/admin/workers" className="kc-btn kc-btn-ghost" style={{ fontSize: 12, marginBottom: 16, display: "inline-flex" }}>
          <Icon name="back" size={14} /> Команда
        </Link>
        <div className="kc-error" style={{ marginTop: 12 }}>{error}</div>
      </div>
    );
  }
  if (!data) return <Spinner />;

  const { worker, cases, stats } = data;
  const color = workerColor(worker.id);
  const byStage = (stage) => cases.filter(c => c.stage === stage);

  return (
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      {/* Навiгацiя */}
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/workers" className="kc-btn kc-btn-ghost" style={{ fontSize: 12 }}>
          <Icon name="back" size={14} /> Команда
        </Link>
      </div>

      {/* Профiль */}
      <div className="kc-card" style={{ marginBottom: 14 }}>
        <div className="kc-row" style={{ gap: 18, flexWrap: "wrap" }}>
          {/* Аватар */}
          <div style={{
            width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
            background: color + "22", border: `2.5px solid ${color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, color,
          }}>
            {initials(worker.full_name)}
          </div>

          {/* Iнфо */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 600 }}>
              {worker.full_name}
            </div>
            <div style={{ color: "var(--dim)", fontSize: 13, marginTop: 3 }}>
              {ROLE_LABEL[worker.role] || worker.role}
              <span style={{ color: "var(--faint)", marginLeft: 8 }}>·</span>
              <span style={{ marginLeft: 8 }}>{worker.email}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 4 }}>
              Останнiй вхiд: {fmtDate(worker.last_login)}
            </div>
          </div>

          {/* Статус */}
          <div style={{
            padding: "5px 14px", borderRadius: 20, alignSelf: "flex-start",
            background: worker.status === "active" ? "#5fb87a22" : "#d96c6c22",
            color: worker.status === "active" ? "#5fb87a" : "#d96c6c",
            fontSize: 12, fontWeight: 600,
          }}>
            {worker.status === "active" ? "Активний" : "Заблокований"}
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="kc-grid kc-grid-4" style={{ marginBottom: 18 }}>
        <StatCard icon="briefcase"  value={Number(stats.active)  || 0} label="Активних справ" />
        <StatCard icon="check"      value={Number(stats.closed)  || 0} label="Закрито справ"  />
        <StatCard icon="alert"      value={Number(stats.overdue) || 0} label="Прострочено"     />
        <StatCard icon="layers"     value={Number(stats.total)   || 0} label="Всього справ"    />
      </div>

      {/* Канбан */}
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "var(--text)" }}>
        Поточнi справи
      </div>

      {cases.length === 0 ? (
        <div className="kc-card" style={{ textAlign: "center", padding: "32px 0", color: "var(--faint)" }}>
          <Icon name="briefcase" size={28} color="var(--border)" />
          <div style={{ marginTop: 10, fontSize: 14 }}>Нема активних справ</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, alignItems: "start" }}>
          {STAGES.map(stage => {
            const stageCases = byStage(stage.key);
            return (
              <div key={stage.key} style={{
                background: "var(--panel-2)", borderRadius: 10, padding: 12,
                border: `1.5px solid ${stage.color}33`,
              }}>
                <div className="kc-row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: stage.color }}>
                    {stage.label}
                  </div>
                  <div style={{
                    background: stage.color, color: "#fff",
                    borderRadius: "50%", width: 20, height: 20,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                  }}>
                    {stageCases.length}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {stageCases.length === 0 ? (
                    <div style={{ color: "var(--faint)", fontSize: 11, padding: "10px 0", textAlign: "center" }}>
                      Немає
                    </div>
                  ) : stageCases.map(c => (
                    <div key={c.id} className="kc-card" style={{ padding: "10px 12px" }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{c.full_name}</div>
                      {c.case_number && (
                        <div style={{ fontSize: 11, color: "var(--dim)" }}>№ {c.case_number}</div>
                      )}
                      {c.urzad && (
                        <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 2 }}>{c.urzad}</div>
                      )}
                      {c.days_left !== null && (
                        <div style={{
                          marginTop: 7, fontSize: 11, fontWeight: 600,
                          color: c.days_left < 0 ? "#d96c6c" : c.days_left < 14 ? "#d99e54" : "#5fb87a",
                        }}>
                          {c.days_left < 0
                            ? `Прострочено на ${Math.abs(c.days_left)} дн.`
                            : c.days_left === 0
                            ? "Дедлайн сьогоднi!"
                            : `${c.days_left} днiв до дедлайну`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Дата реєстрацiї */}
      <div style={{ marginTop: 20, fontSize: 12, color: "var(--faint)", textAlign: "center" }}>
        Акаунт створено: {fmtDate(worker.created_at)}
      </div>
    </div>
  );
}
