"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";

export default function OrdersDemoPage() {
  const [activeFilter, setActiveFilter] = useState("новый");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/crm/orders');
        const json = await res.json();
        setOrders(json.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filters = [
    { id: "all", label: "ФИЛЬТР СТАТУСОВ", color: "text-gray-400 border-gray-600", outline: true },
    { id: "новый", label: "НОВЫЙ - 3", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { id: "согласование", label: "СОГЛАСОВАНИЕ - 0", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { id: "производство", label: "ПРОИЗВОДСТВО - 0", color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
    { id: "доставка", label: "ДОСТАВКА - 0", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
    { id: "выполнено", label: "ВЫПОЛНЕНО", color: "text-emerald-400 border-emerald-500/30 bg-transparent", outline: true },
    { id: "отменено", label: "ОТМЕНЕНО", color: "text-red-400 border-red-500/30 bg-transparent", outline: true },
  ];

  return (
    <div className="flex flex-col h-full bg-[#050505] text-gray-200">
      
      {/* Top Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-white tracking-tight">Заказы</h2>
        
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 gap-3 max-w-[400px] transition-colors focus-within:border-blue-500/50">
          <Icon name="search" size={16} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Быстрый поиск" 
            className="bg-transparent border-none outline-none text-gray-200 w-full text-sm placeholder:text-gray-600"
          />
        </div>

        <button className="ml-auto bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all">
          <Icon name="plus" size={16} />
          Добавить заказ
        </button>
      </div>

      <div className="p-8 flex flex-col gap-6">
        
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar border-b border-white/5">
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
        <SpotlightCard className="bg-white/5 border border-white/10 rounded-2xl overflow-x-auto p-0">
          <table className="w-full min-w-[1200px] text-sm text-left">
            <thead className="bg-black/20 text-xs text-gray-500 uppercase font-semibold border-b border-white/10">
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
                <tr><td colSpan="13" className="p-8 text-center text-gray-500">Загрузка данных из базы...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="13" className="p-8 text-center text-gray-500">Нет заказов</td></tr>
              ) : orders.map((order, index) => (
                <tr key={order.id} className={`transition-colors hover:bg-white/5 border-white/5 ${index !== orders.length - 1 ? 'border-b' : ''}`}>
                  <td className="px-6 py-4"><input type="checkbox" className="accent-blue-500 cursor-pointer" /></td>
                  <td className="px-4 py-4 font-medium text-gray-200">{order.order_number}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Icon name="phone" size={14} /> Приватний вайбер
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-300">{new Date(order.created_at).toLocaleString('ru-RU')}</td>
                  <td className="px-4 py-4">
                    <button className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold hover:text-blue-300 transition-colors">
                      <Icon name="plus" size={12} /> Добавить
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-500">-</td>
                  <td className="px-4 py-4 text-blue-400 font-medium">{order.buyers?.full_name || "Без имени"}</td>
                  <td className="px-4 py-4">
                    <button className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold hover:text-blue-300 transition-colors">
                      <Icon name="plus" size={12} /> Добавить
                    </button>
                  </td>
                  <td className="px-4 py-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <Icon name="plus" size={12} className="cursor-pointer hover:text-gray-300" />
                      <Icon name="file-text" size={12} className="cursor-pointer hover:text-gray-300" />
                      <Icon name="edit-2" size={12} className="cursor-pointer hover:text-gray-300" />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500">-</td>
                  <td className="px-4 py-4 text-gray-500">-</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-500">
                      <Icon name="edit-2" size={16} className="cursor-pointer hover:text-blue-400 transition-colors" />
                      <Icon name="copy" size={16} className="cursor-pointer hover:text-gray-300 transition-colors" />
                      <Icon name="printer" size={16} className="cursor-pointer hover:text-gray-300 transition-colors" />
                      <Icon name="minus" size={16} className="cursor-pointer hover:text-red-400 transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Footer */}
          <div className="p-4 flex justify-end items-center text-xs text-gray-500 border-t border-white/10 bg-black/20">
            <div className="flex items-center gap-6">
              <span>Показано 1 - {orders.length} из {orders.length} записей</span>
              <div className="flex items-center gap-2">
                <select className="bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded-md outline-none focus:border-blue-500/50">
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
    </div>
  );
}
