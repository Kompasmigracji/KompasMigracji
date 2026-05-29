"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface Stats {
  members: number;
  casesSolved: number;
  successRate: number;
  countries: number;
  yearsActive: number;
}

function useCountUp(target: number, duration = 1800, active = false): number {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active || target === 0) return;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, active]);

  return val;
}

function Counter({ value, suffix = "", label, icon }: { value: number; suffix?: string; label: string; icon: string }) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useCountUp(value, 1600, active);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.4 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ textAlign: "center", padding: "20px 16px" }}>
      <div style={{ fontSize: 32, marginBottom: 6 }}>{icon}</div>
      <div style={{
        fontSize: 40, fontWeight: 800, color: "#D8232A",
        fontFamily: "'Syne', sans-serif", lineHeight: 1,
      }}>
        {animated.toLocaleString("pl-PL")}{suffix}
      </div>
      <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

export default function SocialProof() {
  const t = useTranslations();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats/public")
      .then(r => r.json())
      .then(setStats)
      .catch(() => setStats({
        members: 1247, casesSolved: 389, successRate: 93, countries: 18, yearsActive: 6,
      }));
  }, []);

  if (!stats) return null;

  return (
    <section style={{
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      padding: "56px 16px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#D8232A", textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: 8 }}>
            {t("sp_tag")}
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: 0 }}>
            {t("sp_title")}
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 4,
        }}>
          {[
            { value: stats.members,     suffix: "+", label: t("sp_clients"),  icon: "👥" },
            { value: stats.casesSolved, suffix: "+", label: t("sp_cases"),    icon: "✅" },
            { value: stats.successRate, suffix: "%", label: t("sp_success"),  icon: "🎯" },
            { value: stats.countries,   suffix: "",  label: t("sp_countries"),icon: "🌍" },
            { value: stats.yearsActive, suffix: "",  label: t("sp_years"),    icon: "🏆" },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <Counter
                value={item.value}
                suffix={item.suffix}
                label={item.label}
                icon={item.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
