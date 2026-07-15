"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsDemoPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", price: "", qty_in_stock: "" });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/crm/products');
      const json = await res.json();
      setProducts(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/crm/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setForm({ name: "", category: "", price: "", qty_in_stock: "" });
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Помилка');
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const visibleProducts = products.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.name || "").toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      
      {/* Top Header */}
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Icon name="package" size={16} />
          </div>
          <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Товары</h2>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 gap-3 max-w-[400px] transition-colors focus-within:border-blue-500/50">
          <Icon name="search" size={16} className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Быстрый поиск"
            className="bg-transparent border-none outline-none text-gray-800 dark:text-white w-full text-sm placeholder:text-gray-600 dark:placeholder:text-gray-500"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-auto bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <Icon name="plus" size={16} />
          Добавить товар
        </button>
      </div>

      <div className="p-8">
        {/* Data Table */}
        <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto p-0">
          <table className="w-full min-w-[1000px] text-sm text-left">
            <thead className="bg-white/80 dark:bg-white/5 backdrop-blur-md text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold border-b border-black/10 dark:border-white/10 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 w-10"><input type="checkbox" className="accent-blue-500 cursor-pointer" /></th>
                <th className="px-4 py-4 w-10 text-center">-</th>
                <th className="px-4 py-4 font-semibold tracking-wider flex items-center gap-2">
                  Название <Icon name="arrow-up" size={12} className="text-blue-500" />
                </th>
                <th className="px-4 py-4 font-semibold tracking-wider">Категория</th>
                <th className="px-4 py-4 font-semibold tracking-wider flex items-center gap-2">
                  Стоимость <Icon name="arrow-up" size={12} className="text-blue-500" />
                </th>
                <th className="px-4 py-4 font-semibold tracking-wider flex items-center gap-2">
                  Количество <Icon name="arrow-up" size={12} className="text-blue-500" />
                </th>
                <th className="px-4 py-4 font-semibold tracking-wider">Наличие</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-500 dark:text-gray-400">Загрузка товаров из базы...</td></tr>
              ) : visibleProducts.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-500 dark:text-gray-400">Нет товаров</td></tr>
              ) : visibleProducts.map((product, index) => (
                <tr key={product.id} className={`transition-colors hover:bg-black/5 dark:hover:bg-white/5 border-black/5 dark:border-white/5 ${index !== visibleProducts.length - 1 ? 'border-b' : ''}`}>
                  <td className="px-6 py-4"><input type="checkbox" className="accent-blue-500 cursor-pointer" /></td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex p-1.5 border border-black/10 dark:border-white/10 rounded-md bg-white/60 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                      <Icon name="camera" size={16} />
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-blue-400 flex items-center gap-2">
                    <Icon name="folder" size={14} className="text-blue-500" />
                    {product.name}
                  </td>
                  <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{product.category || "-"}</td>
                  <td className="px-4 py-4 font-bold text-gray-800 dark:text-white">{Number(product.price).toFixed(2)} PLN</td>
                  <td className="px-4 py-4 font-medium text-gray-700 dark:text-gray-300">{product.qty_in_stock} шт</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border
                      ${product.qty_in_stock > 0 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {product.qty_in_stock > 0 ? "В наличии" : "Нет"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-500 dark:text-gray-400">
                      <Icon name="edit-2" size={16} className="cursor-pointer hover:text-blue-400 transition-colors" />
                      <Icon name="copy" size={16} className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors" />
                      <Icon name="trash-2" size={16} className="cursor-pointer hover:text-red-400 transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Footer */}
          <div className="p-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1.5 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-black/10 dark:border-white/10 rounded-md cursor-pointer transition-colors">&lt;</button>
              <button className="px-3 py-1.5 bg-blue-500 text-white border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] rounded-md cursor-pointer font-bold">1</button>
              <button className="px-3 py-1.5 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-black/10 dark:border-white/10 rounded-md cursor-pointer transition-colors">&gt;</button>
            </div>
            <div className="flex items-center gap-6">
              <span>Показано 1 - {visibleProducts.length} из {visibleProducts.length} записей</span>
              <div className="flex items-center gap-2">
                <select className="bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md outline-none">
                  <option>15</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span>на странице</span>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-8 rounded-2xl w-[420px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />

              <h3 className="m-0 mb-6 text-gray-900 dark:text-white font-bold text-xl relative z-10">Новий товар / послуга</h3>

              <form onSubmit={handleAddProduct} className="flex flex-col gap-4 relative z-10">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Назва *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="напр. Карта побуту" className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Категорія</label>
                  <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="напр. Легалізація" className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Ціна (PLN)</label>
                    <input required type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Кількість</label>
                    <input type="number" value={form.qty_in_stock} onChange={e => setForm({ ...form, qty_in_stock: e.target.value })} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold cursor-pointer transition-colors">
                    Відмінити
                  </button>
                  <button type="submit" disabled={saving} className={`px-5 py-2.5 rounded-xl border-none bg-blue-500 text-white font-bold cursor-pointer transition-all ${saving ? 'opacity-70' : 'hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}>
                    {saving ? 'Збереження...' : 'Зберегти'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
