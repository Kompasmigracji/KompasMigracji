"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";

export default function OrdersDemoPage() {
  const [activeFilter, setActiveFilter] = useState("новый");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({ buyer_name: '', total_amount: '', notes: '' });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/crm/orders');
      const json = await res.json();
      setOrders(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/crm/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: `ORD-${Math.floor(Math.random() * 100000)}`,
          status: 'новый',
          total_amount: Number(newOrderForm.total_amount) || 0,
          notes: newOrderForm.notes
          // Would typically create buyer first, but for demo we just pass basic fields
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewOrderForm({ buyer_name: '', total_amount: '', notes: '' });
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };


  const filters = [
    { id: "all", label: "ФИЛЬТР СТАТУСОВ", color: "text-gray-500 border-gray-600", outline: true },
    { id: "новый", label: "НОВЫЙ - 3", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { id: "согласование", label: "СОГЛАСОВАНИЕ - 0", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { id: "производство", label: "ПРОИЗВОДСТВО - 0", color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
    { id: "доставка", label: "ДОСТАВКА - 0", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
    { id: "выполнено", label: "ВЫПОЛНЕНО", color: "text-emerald-400 border-emerald-500/30 bg-transparent", outline: true },
    { id: "отменено", label: "ОТМЕНЕНО", color: "text-red-400 border-red-500/30 bg-transparent", outline: true },
  ];

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      
      {/* Top Header */}
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Заказы</h2>
        
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 gap-3 max-w-[400px] transition-colors focus-within:border-blue-500/50">
          <Icon name="search" size={16} className="text-gray-500 dark:text-gray-400" />
          <input 
            type="text" 
            placeholder="Быстрый поиск" 
            className="bg-transparent border-none outline-none text-gray-800 dark:text-white w-full text-sm placeholder:text-gray-500"
          />
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="ml-auto bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <Icon name="plus" size={16} />
          Додати замовлення
        </button>
      </div>

      <div className="p-8 flex flex-col gap-6">
        
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar border-b border-black/5 dark:border-white/5">
          {filters.map(f => (
            <button 
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0
                ${f.color}
                ${activeFilter === f.id ? 'opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'opacity-60 hover:opacity-100'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto p-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <table className="w-full min-w-[1200px] text-sm text-left">
            <thead className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold border-b border-black/10 dark:border-white/10 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 w-10"><input type="checkbox" className="accent-blue-500 cursor-pointer" /></th>
                <th className="px-4 py-4 font-semibold tracking-wider">№ заказа</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Источник</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Время создания</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Дата доставки/отправки</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Статус</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Менеджер</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Покупатель</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Служба доставки</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Трекинг код</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Статус доставки</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Товары</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="13" className="p-8 text-center text-gray-500 dark:text-gray-400">Загрузка данных из базы...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="13" className="p-8 text-center text-gray-500 dark:text-gray-400">Нет заказов</td></tr>
              ) : orders.map((order, index) => (
                <tr key={order.id} className={`transition-colors hover:bg-black/5 dark:hover:bg-white/10 border-black/5 dark:border-white/5 ${index !== orders.length - 1 ? 'border-b' : ''}`}>
                  <td className="px-6 py-4"><input type="checkbox" className="accent-blue-500 cursor-pointer" /></td>
                  <td className="px-4 py-4 font-medium text-gray-800 dark:text-gray-200">{order.order_number}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-purple-400 dark:text-purple-300">
                      <Icon name="phone" size={14} /> Приватний вайбер
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-400">{new Date(order.created_at).toLocaleString('ru-RU')}</td>
                  <td className="px-4 py-4">
                    <button className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400 text-xs font-semibold hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                      <Icon name="plus" size={12} /> Добавить
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-500 dark:text-gray-400">-</td>
                  <td className="px-4 py-4 text-blue-500 dark:text-blue-400 font-medium">{order.buyers?.full_name || "Без имени"}</td>
                  <td className="px-4 py-4">
                    <button className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400 text-xs font-semibold hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                      <Icon name="plus" size={12} /> Добавить
                    </button>
                  </td>
                  <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Icon name="plus" size={12} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />
                      <Icon name="file-text" size={12} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />
                      <Icon name="edit-2" size={12} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500 dark:text-gray-400">-</td>
                  <td className="px-4 py-4 text-gray-500 dark:text-gray-400">-</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-500 dark:text-gray-400">
                      <Icon name="edit-2" size={16} className="cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
                      <Icon name="copy" size={16} className="cursor-pointer hover:text-gray-700 dark:hover:text-white transition-colors" />
                      <Icon name="printer" size={16} className="cursor-pointer hover:text-gray-700 dark:hover:text-white transition-colors" />
                      <Icon name="minus" size={16} className="cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Footer */}
          <div className="p-4 flex justify-end items-center text-xs text-gray-500 dark:text-gray-400 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-6">
              <span>Показано 1 - {orders.length} из {orders.length} записей</span>
              <div className="flex items-center gap-2">
                <select className="bg-white/60 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md outline-none focus:border-blue-500/50">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
                <span>на странице</span>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* New Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-down">
            <div className="flex justify-between items-center p-5 border-b border-black/10 dark:border-white/10">
              <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-white tracking-tight">Нове замовлення</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                <Icon name="x" size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Ім'я клієнта</label>
                <input 
                  type="text" 
                  required
                  value={newOrderForm.buyer_name}
                  onChange={(e) => setNewOrderForm({...newOrderForm, buyer_name: e.target.value})}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                  placeholder="Іван Іванов"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Сума (zł)</label>
                <input 
                  type="number" 
                  required
                  value={newOrderForm.total_amount}
                  onChange={(e) => setNewOrderForm({...newOrderForm, total_amount: e.target.value})}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                  placeholder="150"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Коментар</label>
                <textarea 
                  value={newOrderForm.notes}
                  onChange={(e) => setNewOrderForm({...newOrderForm, notes: e.target.value})}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all min-h-[80px] dark:text-white"
                  placeholder="Особливі побажання..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  Скасувати
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all">
                  Створити
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
