"use client";
/* /admin/content — управление блоками контента сайта kompasmigracji.com.
   Юридический чек-лист: оферта, цены, регламент, политика приватности. */
import React, { useEffect, useState } from "react";
import { Icon, Spinner, Badge } from "@/components/admin/ui";

const DESC = {
  offer: "Описание услуг портала",
  pricing: "Прайс юридических консультаций",
  regulamin: "Правила — ссылка из чекбокса в оплате",
  privacy: "Политика приватности — обязательна по закону",
};

export default function ContentPage() {
  const [blocks, setBlocks] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");

  const load = () => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setBlocks(d.blocks)))
      .catch(() => setError("Не удалось загрузить контент"));
  };
  useEffect(load, []);

  const patch = (slug, fields) =>
    setBlocks((bs) => bs.map((b) => (b.slug === slug ? { ...b, ...fields } : b)));

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const save = async (block, publishedOverride) => {
    setBusy(block.slug);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: block.slug,
          title: block.title,
          body: block.body,
          published: publishedOverride !== undefined ? publishedOverride : block.published,
        }),
      });
      const d = await res.json();
      if (d.error) { flash("⚠ " + d.error); return; }
      patch(block.slug, d.block);
      flash(
        publishedOverride === true ? "Опубликовано: " + d.block.title
        : publishedOverride === false ? "Снято с публикации: " + d.block.title
        : "Сохранено: " + d.block.title
      );
    } catch {
      flash("⚠ Сеть недоступна");
    } finally {
      setBusy("");
    }
  };

  if (error) {
    return (
      <div className="kc-error">
        <Icon name="settings" size={15} color="#d96c6c" />
        <span>{error}</span>
      </div>
    );
  }
  if (!blocks) return <Spinner />;

  const publishedCount = blocks.filter((b) => b.published).length;

  return (
    <div>
      <div className="kc-note" style={{ marginBottom: 14 }}>
        Юридический чек-лист kompasmigracji.com: опубликовать четыре блока ниже,
        исправить данные фирмы в футере сайта (NIP, REGON, KRS) и добавить
        чекбокс согласия с регламентом в процесс оплаты. Опубликовано:{" "}
        {publishedCount} из {blocks.length}.
      </div>

      {toast && (
        <div className="kc-note" style={{ marginBottom: 14 }}>{toast}</div>
      )}

      <div className="kc-grid kc-grid-2">
        {blocks.map((b) => (
          <div key={b.slug} className="kc-card">
            <div className="kc-row" style={{ justifyContent: "space-between" }}>
              <div className="kc-row" style={{ gap: 9 }}>
                <div className="kc-stat-ico">
                  <Icon name="file" size={16} color="#d99e54" />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{DESC[b.slug] ? b.title : b.slug}</div>
                  <div style={{ color: "#5a6470", fontSize: 12 }}>
                    {DESC[b.slug] || "Блок контента"}
                  </div>
                </div>
              </div>
              <Badge status={b.published ? "paid" : "unpaid"}
                text={b.published ? "Опубликовано" : "Черновик"} />
            </div>

            <div className="kc-field" style={{ marginTop: 12, marginBottom: 10 }}>
              <label className="kc-label">Заголовок</label>
              <input className="kc-input" value={b.title || ""}
                onChange={(e) => patch(b.slug, { title: e.target.value })} />
            </div>

            <textarea className="kc-textarea" value={b.body || ""}
              onChange={(e) => patch(b.slug, { body: e.target.value })}
              placeholder={"Содержимое блока «" + b.title + "»…"} />

            <div className="kc-row"
              style={{ justifyContent: "space-between", marginTop: 10 }}>
              <span className="kc-stat-sub">
                {b.updated_at
                  ? "изменён " + new Date(b.updated_at).toLocaleDateString("ru-RU")
                  : "не сохранён"}
              </span>
              <div className="kc-row" style={{ gap: 8 }}>
                <button className="kc-btn kc-btn-ghost" disabled={busy === b.slug}
                  onClick={() => save(b)}>
                  Сохранить
                </button>
                {b.published ? (
                  <button className="kc-btn kc-btn-danger" disabled={busy === b.slug}
                    onClick={() => save(b, false)}>
                    Снять с публикации
                  </button>
                ) : (
                  <button className="kc-btn kc-btn-primary" disabled={busy === b.slug}
                    onClick={() => save(b, true)}>
                    <Icon name="check" size={14} /> Опубликовать
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
