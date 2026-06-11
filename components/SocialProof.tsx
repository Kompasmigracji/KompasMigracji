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
  // Users
  <svg key="users" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>,
  // Check circle
  <svg key="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>,
  // Target
  <svg key="target" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>,
  // Globe
  <svg key="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>,
  // Award
  <svg key="award" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
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
  const [hovered, setHovered] = useState(false);
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '32px 20px',
        borderRadius: 16,
        background: hovered ? 'rgba(37,99,235,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered
          ? '0 0 32px rgba(37,99,235,0.15), inset 0 1px 0 rgba(255,255,255,0.06)'
          : 'inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
    >
      {/* Icon */}
      <div style={{
        color: hovered ? '#60a5fa' : '#4d7fc4',
        marginBottom: 20,
        transition: 'color 0.3s ease',
        lineHeight: 1,
      }}>
        {icon}
      </div>

      {/* Animated number */}
      <div style={{
        background: 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: 'clamp(28px, 3vw, 44px)',
        fontWeight: 900,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        fontFamily: 'var(--font-display)',
      }}>
        {animated.toLocaleString('pl-PL')}{suffix}
      </div>

      {/* Label */}
      <div style={{
        fontSize: 12,
        color: 'var(--text-muted)',
        marginTop: 10,
        fontWeight: 500,
        letterSpacing: '0.01em',
        lineHeight: 1.4,
      }}>
        {label}
      </div>
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
    <section style={{ background: 'var(--bg-main)', position: 'relative', overflow: 'hidden', padding: '96px 0' }}>
      {/* Radial top glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,0.08) 0%, transparent 65%)',
      }} />
      {/* Bottom fade */}
      <div aria-hidden style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, pointerEvents: 'none',
        background: 'linear-gradient(to top, var(--bg-main) 0%, transparent 100%)',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#4d7fc4', marginBottom: 12,
          }}>
            {t("sp_tag")}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            color: 'var(--text-main)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            margin: 0,
            lineHeight: 1.2,
          }}>
            {t("sp_title")}
          </h2>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
        }}
          className="sp-grid"
        >
          {items.map((item, i) => (
            <StatCard key={i} {...item} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sp-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .sp-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
