import React, { useEffect, useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import { getSupabase } from "@/lib/supabase";

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
    <div style={{ width: "100%", maxWidth: 500, background: "#f8fafc", padding: "20px", borderRadius: 8, fontFamily: "sans-serif" }}>
      {/* Filter Button */}
      <button style={{ 
        width: "100%", background: "#fff", border: "1px solid #e2e8f0", padding: "10px", borderRadius: 4, 
        display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, 
        color: "#475569", marginBottom: 24, cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" 
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
            <div key={item.id} style={{ position: "relative", marginBottom: 24, zIndex: 2 }}>
              {/* Timeline Dot */}
              <div style={{ position: "absolute", top: 4, left: -18, width: 10, height: 10, background: "#22c55e", borderRadius: "50%", border: "2px solid #f8fafc" }}></div>

              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 500 }}>{timeFormatted}</div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Avatar name={userName} size={24} />
                  <div style={{ fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>{userName}</span> <span style={{ color: "#64748b" }}>{item.action}</span>
                  </div>
                </div>

                {/* Changes */}
                {changes.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {changes.map((change, i) => (
                      <div key={i} style={{ display: "flex", fontSize: 12 }}>
                        <div style={{ width: "40%", color: "#64748b" }}>{change.label}</div>
                        <div style={{ width: "60%", display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: "#64748b", flexShrink: 0 }}>{change.from}</span>
                          <Icon name="arrow-right" size={12} color="#cbd5e1" style={{ marginTop: 2, flexShrink: 0 }} />
                          
                          {change.isPill ? (
                            <span style={{ background: change.pillColor || "#10b981", color: "#fff", padding: "2px 8px", borderRadius: 4, fontWeight: 600, fontSize: 11 }}>
                              {change.to}
                            </span>
                          ) : (
                            <span style={{ color: "#0f172a" }}>{change.to}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
