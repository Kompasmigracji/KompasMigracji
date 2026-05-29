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

const ICONS = [
  <svg key="users" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>,
  <svg key="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>,
  <svg key="target" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>,
  <svg key="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>,
  <svg key="award" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>,
];

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

function StatCard({
  value, suffix = "", label, icon,
}: { value: number; suffix?: string; label: string; icon: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useCountUp(value, 1600, active);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="card-hover flex flex-col items-center text-center py-8 px-5 rounded-2xl border border-white/10 bg-white/5 group"
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 text-primary bg-primary/10 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <div
        className="gradient-text font-display font-extrabold leading-none"
        style={{ fontSize: "clamp(22px, 2.6vw, 36px)" }}
      >
        {animated.toLocaleString("pl-PL")}{suffix}
      </div>
      <div className="text-sm text-muted mt-3 font-medium leading-snug">{label}</div>
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

  const items = [
    { value: stats.members,     suffix: "+", label: t("sp_clients"),   icon: ICONS[0] },
    { value: stats.casesSolved, suffix: "+", label: t("sp_cases"),     icon: ICONS[1] },
    { value: stats.successRate, suffix: "%", label: t("sp_success"),   icon: ICONS[2] },
    { value: stats.countries,   suffix: "",  label: t("sp_countries"), icon: ICONS[3] },
    { value: stats.yearsActive, suffix: "",  label: t("sp_years"),     icon: ICONS[4] },
  ];

  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(37,99,235,0.13) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {t("sp_tag")}
          </div>
          <h2
            className="font-serif font-light text-white"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            {t("sp_title")}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {items.map((item, i) => (
            <StatCard key={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
