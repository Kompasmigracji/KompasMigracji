import React, { useEffect, useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import { getSupabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export function ActionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    if (!supabase) return;

    const fetchHistory = async () => {
      // We will join kompas_users to get the user's name
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
        fetchHistory(); // Refresh on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="premium-glass" style={{ width: "100%", maxWidth: 500, padding: "20px", borderRadius: 16 }}>
      {/* Filter Button */}
      <button className="premium-card transition-premium hover-lift" style={{ 
        width: "100%", padding: "10px", borderRadius: 8, 
        display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, 
        color: "var(--text)", marginBottom: 24, cursor: "pointer" 
      }}>
        <Icon name="filter" size={14} /> Фильтр
      </button>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 16 }}>
        {/* Vertical Line */}
        <div style={{ position: "absolute", top: 8, bottom: 0, left: 3, width: 2, background: "#86efac", zIndex: 1 }}></div>

        {loading ? (
          <div style={{ color: "#64748b", fontSize: 13, textAlign: "center", padding: "20px" }}>Загрузка истории...</div>
        ) : history.length === 0 ? (
          <div style={{ color: "#64748b", fontSize: 13, textAlign: "center", padding: "20px" }}>История пуста</div>
        ) : history.map((item) => {
          const userName = item.kompas_users?.full_name || "Система";
          const timeFormatted = new Date(item.created_at).toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
          });
          const changes = Array.isArray(item.meta) ? item.meta : [];

          return (
            <div key={item.id} style={{ position: "relative", marginBottom: 24, zIndex: 2, perspective: "1000px" }}>
              {/* Timeline Dot */}
              <div style={{ position: "absolute", top: 4, left: -18, width: 10, height: 10, background: "var(--color-primary)", borderRadius: "50%", border: "2px solid var(--panel)" }}></div>

              <div style={{ fontSize: 12, color: "var(--dim)", marginBottom: 8, fontWeight: 500 }}>{timeFormatted}</div>

              <motion.div 
                className="premium-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateX: 4, rotateY: -4, y: -4 }}
                style={{ padding: "16px", transformStyle: "preserve-3d" }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Avatar name={userName} size={24} />
                  <div style={{ fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: "var(--text)" }}>{userName}</span> <span style={{ color: "var(--dim)" }}>{item.action}</span>
                  </div>
                </div>

                {/* Changes */}
                {changes.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {changes.map((change, i) => (
                      <div key={i} style={{ display: "flex", fontSize: 12 }}>
                        <div style={{ width: "40%", color: "var(--dim)" }}>{change.label}</div>
                        <div style={{ width: "60%", display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: "var(--dim)", flexShrink: 0 }}>{change.from}</span>
                          <Icon name="arrow-right" size={12} color="var(--faint)" style={{ marginTop: 2, flexShrink: 0 }} />
                          
                          {change.isPill ? (
                            <span style={{ background: change.pillColor || "var(--color-secondary)", color: "#fff", padding: "2px 8px", borderRadius: 4, fontWeight: 600, fontSize: 11 }}>
                              {change.to}
                            </span>
                          ) : (
                            <span style={{ color: "var(--text)" }}>{change.to}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
