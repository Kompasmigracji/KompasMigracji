import React, { useEffect, useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import { getSupabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/SpotlightCard";

export function ActionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    if (!supabase) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('kompas_audit_log')
        .select('*, kompas_users(full_name)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setHistory(data);
      }
      setLoading(false);
    };

    fetchHistory();

    const channel = supabase.channel('audit_log_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kompas_audit_log' }, (payload) => {
        fetchHistory();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
      {/* Filter Button */}
      <SpotlightCard className="w-full p-4 rounded-xl flex justify-center items-center gap-2 text-sm font-bold text-gray-900 bg-white/60 border border-black/10 hover:border-black/20 transition-colors cursor-pointer shadow-sm">
        <Icon name="filter" size={16} className="text-gray-500" /> Фильтр
      </SpotlightCard>

      {/* Timeline */}
      <div className="relative pl-6">
        {/* Vertical Line */}
        <div className="absolute top-3 bottom-0 left-[7px] w-0.5 bg-blue-500/20 z-0 shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>

        {loading ? (
          <div className="text-gray-500 text-sm text-center p-8 font-medium">Загрузка истории...</div>
        ) : history.length === 0 ? (
          <div className="text-gray-500 text-sm text-center p-8 font-medium">История пуста</div>
        ) : history.map((item, index) => {
          const userName = item.kompas_users?.full_name || "Система";
          const timeFormatted = new Date(item.created_at).toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
          });
          const changes = Array.isArray(item.meta) ? item.meta : [];

          return (
            <div key={item.id} className="relative mb-8 z-10">
              {/* Timeline Dot */}
              <div className="absolute top-1.5 -left-[23px] w-3 h-3 bg-blue-500 rounded-full border-[3px] border-[#050505] shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>

              <div className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-wider">{timeFormatted}</div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SpotlightCard className="p-5 bg-white/60 border border-black/10 rounded-2xl">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <Avatar name={userName} size={32} className="border border-black/10 shadow-inner" />
                    <div className="text-sm">
                      <span className="font-bold text-gray-900 mr-1.5">{userName}</span> 
                      <span className="text-gray-500 font-medium">{item.action}</span>
                    </div>
                  </div>

                  {/* Changes */}
                  {changes.length > 0 && (
                    <div className="flex flex-col gap-4 bg-black/40 rounded-xl p-4 border border-black/5">
                      {changes.map((change, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-start text-xs gap-2 sm:gap-4">
                          <div className="w-full sm:w-2/5 text-gray-500 font-bold uppercase tracking-wider mt-0.5">{change.label}</div>
                          <div className="w-full sm:w-3/5 flex flex-wrap items-center gap-2">
                            <span className="text-gray-500 bg-white/60 px-2 py-1 rounded-md border border-black/5 line-through">{change.from}</span>
                            <Icon name="arrow-right" size={14} className="text-blue-500" />
                            
                            {change.isPill ? (
                              <span style={{ backgroundColor: change.pillColor ? `${change.pillColor}30` : "rgba(255,255,255,0.1)", color: change.pillColor || "#fff", borderColor: change.pillColor ? `${change.pillColor}50` : "rgba(255,255,255,0.2)" }} 
                                    className="px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider border shadow-sm">
                                {change.to}
                              </span>
                            ) : (
                              <span className="text-gray-900 font-bold bg-white/80 px-2.5 py-1 rounded-md border border-black/10 shadow-sm">{change.to}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SpotlightCard>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
