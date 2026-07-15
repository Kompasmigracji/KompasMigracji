"use client";
import React, { useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const STATUS_COLOR = {
  new: "#3b82f6",
  contacted: "#8b5cf6",
  pending: "#f59e0b",
  won: "#10b981",
  lost: "#ef4444",
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({ newLeads: 0, activeOrders: 0, successfulDeals: 0, revenue: 0 });
  const [chartData, setChartData] = useState([{ name: '—', leads: 0, revenue: 0 }]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Delay mounting the charts by one frame so the grid layout has
    // already been painted before recharts' ResponsiveContainer takes
    // its first measurement — otherwise it can measure a 0-size
    // container on the very first pass and log a width(-1)/height(-1)
    // warning even though the chart ends up rendering correctly.
    const raf = requestAnimationFrame(() => setMounted(true));
    async function loadData() {
      try {
        const res = await fetch('/api/admin/crm/dashboard');
        const json = await res.json();
        if (json.data) {
          setMetrics(json.data.metrics);
          setChartData(json.data.chartData);
          setStatusBreakdown(json.data.statusBreakdown || []);
        }
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col gap-8 p-8 bg-transparent text-gray-800 dark:text-gray-300 max-w-6xl mx-auto">

      {/* Welcome Banner */}
      <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 rounded-3xl relative overflow-hidden flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white m-0 tracking-tight">Ласкаво просимо в iPhoenixCRM</h2>
          <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-lg m-0">
            Загальний огляд продажів, лідів та воронки Kompas Migracji.
          </p>
        </div>

        <div className="relative z-10 w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.15)] text-amber-500 shrink-0">
          <Icon name="zap" size={32} />
        </div>
      </SpotlightCard>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Нових лідів", val: metrics.newLeads.toString(), icon: "user-check", bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-500", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]" },
          { label: "Замовлень у роботі", val: metrics.activeOrders.toString(), icon: "briefcase", bg: "bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-500", shadow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]" },
          { label: "Успішних угод", val: metrics.successfulDeals.toString(), icon: "check-circle", bg: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-500", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
          { label: "Виручка", val: `${metrics.revenue.toLocaleString('uk-UA')} zł`, icon: "cash", bg: "bg-indigo-500/20", border: "border-indigo-500/30", text: "text-indigo-500", shadow: "shadow-[0_0_15px_rgba(99,102,241,0.2)]" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${m.bg} border ${m.border} ${m.text} flex items-center justify-center ${m.shadow}`}>
                  <Icon name={m.icon} size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{m.label}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight tabular-nums">{m.val}</div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-white tracking-tight">Динаміка виручки</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 m-0">За останні 6 місяців</p>
            </div>
          </div>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(128,128,128,0.15)', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', background: 'rgba(30,30,30,0.9)', backdropFilter: 'blur(10px)', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="w-full h-full bg-slate-100/50 dark:bg-white/5 rounded-xl animate-pulse" />}
          </div>
        </SpotlightCard>

        <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-white tracking-tight">Нові ліди</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 m-0">Приріст клієнтської бази</p>
            </div>
          </div>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(128,128,128,0.06)' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(128,128,128,0.15)', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', background: 'rgba(30,30,30,0.9)', backdropFilter: 'blur(10px)', color: '#fff' }}
                  />
                  <Bar dataKey="leads" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="w-full h-full bg-slate-100/50 dark:bg-white/5 rounded-xl animate-pulse" />}
          </div>
        </SpotlightCard>
      </div>

      {/* Lead status breakdown — real data */}
      <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-white tracking-tight">Ліди по статусах воронки</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 m-0">Поточний розподіл всіх лідів</p>
          </div>
          <a href="/admin/crm/funnels" className="bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/20 transition-colors">
            До воронки
          </a>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6">Завантаження...</div>
        ) : statusBreakdown.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6">Ще немає лідів</div>
        ) : (
          <div className="flex flex-col gap-3">
            {statusBreakdown.map((s) => (
              <div key={s.status} className="flex items-center gap-4">
                <div className="w-32 shrink-0 text-sm font-semibold text-gray-700 dark:text-gray-300">{s.label}</div>
                <div className="flex-1 h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: STATUS_COLOR[s.status] || "#94a3b8" }}
                  />
                </div>
                <div className="w-20 shrink-0 text-right text-sm font-bold text-gray-900 dark:text-white tabular-nums">{s.count} <span className="text-gray-400 dark:text-gray-500 font-normal">({s.pct}%)</span></div>
              </div>
            ))}
          </div>
        )}
      </SpotlightCard>
    </div>
  );
}
