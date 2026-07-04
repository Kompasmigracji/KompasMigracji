"use client";
import React, { useEffect, useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

export default function BuyersDemoPage() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBuyer, setNewBuyer] = useState({ full_name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBuyer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/crm/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBuyer)
      });
      if (res.ok) {
        const json = await res.json();
        setBuyers([json.data, ...buyers]);
        setIsModalOpen(false);
        setNewBuyer({ full_name: '', email: '', phone: '' });
      } else {
        const err = await res.json();
        alert(err.error || 'Ошибка');
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка');
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/crm/buyers');
        const json = await res.json();
        setBuyers(json.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] text-gray-800">
      
      {/* Top Header */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-black/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-gray-900 tracking-tight">Покупатели</h2>
        
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-black/40 border border-black/10 rounded-xl px-4 py-2.5 gap-3 max-w-[400px] transition-colors focus-within:border-blue-500/50">
          <Icon name="search" size={16} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Быстрый поиск" 
            className="bg-transparent border-none outline-none text-gray-800 w-full text-sm placeholder:text-gray-600"
          />
        </div>

        <button className="bg-white/60 border border-black/10 p-2.5 rounded-xl hover:bg-white/80 transition-colors">
          <Icon name="sliders" size={16} className="text-gray-500" />
        </button>

        <button 
          onClick={() => setIsModalOpen(true)} 
          className="ml-auto bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all"
        >
          <Icon name="plus" size={16} />
          Добавить покупателя
        </button>
      </div>

      <div className="p-8">
        {/* Data Table */}
        <SpotlightCard className="bg-white/60 border border-black/10 rounded-2xl overflow-x-auto p-0">
          <table className="w-full min-w-[1000px] text-sm text-left">
            <thead className="bg-black/20 text-xs text-gray-500 uppercase font-semibold border-b border-black/10">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="accent-blue-500 cursor-pointer" />
                </th>
                <th className="px-4 py-4 font-semibold tracking-wider">Покупатель</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Email</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Телефон</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Кол-во заказов</th>
                <th className="px-4 py-4 font-semibold tracking-wider text-center">Последний заказ</th>
                <th className="px-4 py-4 font-semibold tracking-wider flex items-center gap-2">
                  Дата создания <Icon name="arrow-down" size={12} className="text-blue-500" />
                </th>
                <th className="px-4 py-4 font-semibold tracking-wider">Менеджер</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="p-8 text-center text-gray-500">Загрузка данных из базы...</td></tr>
              ) : buyers.length === 0 ? (
                <tr><td colSpan="9" className="p-8 text-center text-gray-500">Нет покупателей</td></tr>
              ) : buyers.map((buyer, index) => (
                <tr key={buyer.id} className={`transition-colors hover:bg-white/60 border-black/5 ${index !== buyers.length - 1 ? 'border-b' : ''}`}>
                  <td className="px-6 py-4">
                    <input type="checkbox" className="accent-blue-500 cursor-pointer" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center border border-black/10 shadow-inner">
                        <Icon name="user" size={14} className="text-gray-500" />
                      </div>
                      <span className="text-blue-400 font-medium">{buyer.full_name || "Без имени"}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-4 ${buyer.email ? 'text-gray-700 font-medium' : 'text-blue-400/50'}`}>
                    {buyer.email || "[пусто]"}
                  </td>
                  <td className={`px-4 py-4 whitespace-pre-line ${buyer.phone ? 'text-gray-700' : 'text-blue-400/50'}`}>
                    {buyer.phone || "[пусто]"}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-500">-</td>
                  <td className="px-4 py-4 text-center text-gray-500">-</td>
                  <td className="px-4 py-4 text-gray-700">
                    {new Date(buyer.created_at).toLocaleString('ru-RU')}
                  </td>
                  <td className="px-4 py-4 text-gray-500">-</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-500">
                      <Icon name="edit-2" size={16} className="cursor-pointer hover:text-blue-400 transition-colors" />
                      <Icon name="trash-2" size={16} className="cursor-pointer hover:text-red-400 transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Footer */}
          <div className="p-4 flex justify-between items-center text-xs text-gray-500 border-t border-black/10 bg-black/20">
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1.5 bg-white/60 hover:bg-white/80 border border-black/10 rounded-md cursor-pointer transition-colors">&lt;</button>
              <button className="px-3 py-1.5 bg-blue-500 text-white border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] rounded-md cursor-pointer font-bold">1</button>
              <button className="px-3 py-1.5 bg-white/60 hover:bg-white/80 border border-black/10 rounded-md cursor-pointer text-gray-700 transition-colors">2</button>
              <button className="px-3 py-1.5 bg-white/60 hover:bg-white/80 border border-black/10 rounded-md cursor-pointer transition-colors">&gt;</button>
            </div>
            <div className="flex items-center gap-6">
              <span>Показано 1 - 10 из 25 записей</span>
              <div className="flex items-center gap-2">
                <select className="bg-white/60 border border-black/10 text-gray-700 px-2 py-1 rounded-md outline-none">
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
      
      {/* Add Buyer Modal */}
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
              className="bg-white border border-black/10 p-8 rounded-2xl w-[400px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />
              
              <h3 className="m-0 mb-6 text-gray-900 font-bold text-xl relative z-10">Новый покупатель</h3>
              
              <form onSubmit={handleAddBuyer} className="flex flex-col gap-4 relative z-10">
                <div>
                  <label className="text-xs text-gray-500 font-bold mb-1 block uppercase tracking-wider">ФИО *</label>
                  <input 
                    required 
                    placeholder="Иван Иванов" 
                    value={newBuyer.full_name} 
                    onChange={e => setNewBuyer({...newBuyer, full_name: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/60 text-gray-900 outline-none focus:border-blue-500/50 transition-colors" 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold mb-1 block uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    placeholder="email@example.com" 
                    value={newBuyer.email} 
                    onChange={e => setNewBuyer({...newBuyer, email: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/60 text-gray-900 outline-none focus:border-blue-500/50 transition-colors" 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold mb-1 block uppercase tracking-wider">Телефон</label>
                  <input 
                    type="tel" 
                    placeholder="+48 000 000 000" 
                    value={newBuyer.phone} 
                    onChange={e => setNewBuyer({...newBuyer, phone: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/60 text-gray-900 outline-none focus:border-blue-500/50 transition-colors" 
                  />
                </div>
                
                <div className="flex justify-end gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-5 py-2.5 rounded-xl border border-black/10 bg-transparent hover:bg-white/60 text-gray-700 font-semibold cursor-pointer transition-colors"
                  >
                    Отмена
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={`px-5 py-2.5 rounded-xl border-none bg-blue-500 text-white font-bold cursor-pointer transition-all ${isSubmitting ? 'opacity-70' : 'hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
                  >
                    {isSubmitting ? 'Сохранение...' : 'Сохранить'}
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
