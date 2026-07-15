"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Spinner } from "@/components/admin/ui";
import KanbanBoard from "@/components/admin/KanbanBoard";

const STAGES = [
  { id: "prospecting", title: "Пошук", color: "var(--color-info)" },
  { id: "qualification", title: "Кваліфікація", color: "var(--color-warning)" },
  { id: "proposal", title: "Пропозиція", color: "var(--color-primary)" },
  { id: "negotiation", title: "Переговори", color: "var(--color-warning)" },
  { id: "closed_won", title: "Закрито успішно", color: "var(--color-success)" },
  { id: "closed_lost", title: "Втрачено", color: "var(--color-danger)" },
];

const EMPTY_FORM = {
  title: "", amount: "", currency: "PLN", probability: "50", expected_close: "", notes: "",
};

const zl = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const loadDeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/deals");
      const json = await res.json();
      setDeals(json.deals || []);
    } catch (e) {
      console.error(e);
      flash("Помилка завантаження угод");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadDeals(); }, [loadDeals]);

  const handleStageChange = async (dealId, newStage) => {
    setDeals(prev => prev.map(d => String(d.id) === String(dealId) ? { ...d, stage: newStage } : d));
    try {
      const res = await fetch(`/api/admin/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      const d = await res.json();
      if (d.error) { flash(d.error); loadDeals(); } else { flash("Стадію угоди оновлено"); }
    } catch (e) {
      console.error(e);
      flash("Помилка при перетягуванні угоди");
      loadDeals();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        await loadDeals();
        setIsCreateOpen(false);
        setForm(EMPTY_FORM);
        flash("Угоду створено");
      }
    } catch (e) {
      console.error(e);
      flash("Помилка при створенні угоди");
    } finally {
      setSaving(false);
    }
  };

  const handleDetailSave = async () => {
    if (!selectedDeal) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/deals/${selectedDeal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedDeal.title,
          amount: selectedDeal.amount,
          currency: selectedDeal.currency,
          probability: selectedDeal.probability,
          expected_close: selectedDeal.expected_close,
          notes: selectedDeal.notes,
        }),
      });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        await loadDeals();
        setSelectedDeal(null);
        flash("Угоду оновлено");
      }
    } catch (e) {
      console.error(e);
      flash("Помилка при збереженні угоди");
    } finally {
      setSaving(false);
    }
  };

  const totalPipeline = deals
    .filter(d => d.stage !== "closed_lost")
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const cards = deals.map(d => ({
    id: String(d.id),
    title: d.title,
    subtitle: d.lead_name ? `Лід: ${d.lead_name}` : undefined,
    timeAgo: d.expected_close ? `до ${new Date(d.expected_close).toLocaleDateString("uk-UA")}` : undefined,
    columnId: d.stage || "prospecting",
    amount: d.amount,
    tags: [d.currency, d.probability ? `${d.probability}%` : null].filter(Boolean),
    assignee: { name: d.assigned_to_name || "Не призначено" },
    isUrgent: d.expected_close && new Date(d.expected_close) < new Date() && !["closed_won", "closed_lost"].includes(d.stage),
    originalDeal: d,
  }));

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Воронка угод</h2>
          <p className="m-0 mt-1 text-sm text-gray-500 dark:text-gray-400">
            У роботі: <span className="font-semibold text-gray-900 dark:text-white">{zl.format(totalPipeline)} zł</span>
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg> Нова угода
        </button>
      </div>

      <div className="flex-1 p-8 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center"><Spinner /></div>
        ) : (
          <KanbanBoard
            columns={STAGES}
            cards={cards}
            onCardMove={handleStageChange}
            onCardClick={(card) => setSelectedDeal({ ...card.originalDeal })}
          />
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl">
          {toast}
        </div>
      )}

      {/* New Deal Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-black/10 dark:border-white/10">
              <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-white tracking-tight">Нова угода</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Назва угоди</label>
                <input
                  type="text" required autoFocus
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                  placeholder="Легалізація — Karta Pobytu"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Сума</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                    placeholder="1500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Валюта</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                  >
                    <option value="PLN">PLN</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Ймовірність, %</label>
                  <input
                    type="number" min="0" max="100"
                    value={form.probability}
                    onChange={(e) => setForm({ ...form, probability: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Очікуване закриття</label>
                  <input
                    type="date"
                    value={form.expected_close}
                    onChange={(e) => setForm({ ...form, expected_close: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Нотатки</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  Скасувати
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50">
                  {saving ? "Створення..." : "Створити угоду"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-black/10 dark:border-white/10">
              <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-white tracking-tight">{selectedDeal.title}</h3>
              <button onClick={() => setSelectedDeal(null)} className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {selectedDeal.lead_name && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Лід: <span className="text-gray-900 dark:text-white font-medium">{selectedDeal.lead_name}</span>
                  {selectedDeal.lead_contact && <span> · {selectedDeal.lead_contact}</span>}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Сума</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={selectedDeal.amount ?? ""}
                    onChange={(e) => setSelectedDeal({ ...selectedDeal, amount: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Ймовірність, %</label>
                  <input
                    type="number" min="0" max="100"
                    value={selectedDeal.probability ?? ""}
                    onChange={(e) => setSelectedDeal({ ...selectedDeal, probability: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all dark:text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Очікуване закриття</label>
                <input
                  type="date"
                  value={selectedDeal.expected_close ? String(selectedDeal.expected_close).slice(0, 10) : ""}
                  onChange={(e) => setSelectedDeal({ ...selectedDeal, expected_close: e.target.value })}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Нотатки</label>
                <textarea
                  rows={3}
                  value={selectedDeal.notes ?? ""}
                  onChange={(e) => setSelectedDeal({ ...selectedDeal, notes: e.target.value })}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all dark:text-white resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button onClick={() => setSelectedDeal(null)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  Закрити
                </button>
                <button onClick={handleDetailSave} disabled={saving} className="px-5 py-2.5 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50">
                  {saving ? "Збереження..." : "Зберегти"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
