"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";

export default function ProductsDemoPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/crm/products');
        const json = await res.json();
        setProducts(json.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] text-gray-800">
      
      {/* Top Header */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-black/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Icon name="package" size={16} />
          </div>
          <h2 className="m-0 text-xl font-bold text-gray-900 tracking-tight">Товары</h2>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-black/40 border border-black/10 rounded-xl px-4 py-2.5 gap-3 max-w-[400px] transition-colors focus-within:border-blue-500/50">
          <Icon name="search" size={16} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Быстрый поиск" 
            className="bg-transparent border-none outline-none text-gray-800 w-full text-sm placeholder:text-gray-600"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center bg-black/40 border border-black/10 rounded-xl px-4 py-2.5 gap-3 min-w-[200px] cursor-pointer hover:border-black/20 transition-colors">
          <span className="text-gray-500 text-sm flex-1">Выберите категорию...</span>
          <Icon name="chevron-down" size={16} className="text-gray-500" />
        </div>

        <button className="ml-auto bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all">
          <Icon name="plus" size={16} />
          Добавить товар
        </button>
      </div>

      <div className="p-8">
        {/* Data Table */}
        <SpotlightCard className="bg-white/60 border border-black/10 rounded-2xl overflow-x-auto p-0">
          <table className="w-full min-w-[1000px] text-sm text-left">
            <thead className="bg-black/20 text-xs text-gray-500 uppercase font-semibold border-b border-black/10">
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
                <tr><td colSpan="8" className="p-8 text-center text-gray-500">Загрузка товаров из базы...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-500">Нет товаров</td></tr>
              ) : products.map((product, index) => (
                <tr key={product.id} className={`transition-colors hover:bg-white/60 border-black/5 ${index !== products.length - 1 ? 'border-b' : ''}`}>
                  <td className="px-6 py-4"><input type="checkbox" className="accent-blue-500 cursor-pointer" /></td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex p-1.5 border border-black/10 rounded-md bg-white/60 text-gray-500">
                      <Icon name="camera" size={16} />
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-blue-400 flex items-center gap-2">
                    <Icon name="folder" size={14} className="text-blue-500" />
                    {product.name}
                  </td>
                  <td className="px-4 py-4 text-gray-500">{product.category || "-"}</td>
                  <td className="px-4 py-4 font-bold text-gray-800">{Number(product.price).toFixed(2)} PLN</td>
                  <td className="px-4 py-4 font-medium text-gray-700">{product.qty_in_stock} шт</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border
                      ${product.qty_in_stock > 0 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {product.qty_in_stock > 0 ? "В наличии" : "Нет"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-500">
                      <Icon name="edit-2" size={16} className="cursor-pointer hover:text-blue-400 transition-colors" />
                      <Icon name="copy" size={16} className="cursor-pointer hover:text-gray-700 transition-colors" />
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
              <button className="px-3 py-1.5 bg-white/60 hover:bg-white/80 border border-black/10 rounded-md cursor-pointer transition-colors">&gt;</button>
            </div>
            <div className="flex items-center gap-6">
              <span>Показано 1 - {products.length} из {products.length} записей</span>
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
    </div>
  );
}
