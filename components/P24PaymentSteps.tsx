"use client";
/* Przelewy24-branded payment steps section — used on pricing, plans, karta pages */
import { ShoppingCart, User, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Step {
  n: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const P24_BRAND = "#ff5a00";
const GREEN = "#44A649";
const NAVY  = "#1B2547";
const GRAY  = "#6C757D";
const LIGHT = "#F8F9FA";
const BORD  = "#DEE2E6";

/* ── Official PayU logo ─────────────────────────────────── */
export function P24Logo({ width = 140 }: { width?: number }) { // Note: Renamed from PayULogo to P24Logo to match filename, but it was PayU. Now it's Przelewy24.
  const h = Math.round(width * 0.27);
  return (
    <svg width={width} height={h} viewBox="0 0 140 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Przelewy24">
      <rect width="140" height="38" rx="6" fill="#fff" stroke={BORD} />
      <text x="70" y="26" textAnchor="middle" fill="#fff" fontFamily="'Arial Black', 'Arial', sans-serif"
        fontSize="16" fontWeight="900" letterSpacing="0"><tspan fill={P24_BRAND}>Przelewy</tspan><tspan fill={NAVY}>24</tspan></text>
    </svg>
  );
}

/* ── Payment method icons ─────────────────────────────────────────────── */
function PayIcons() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      {/* BLIK */}
      <svg width="46" height="24" viewBox="0 0 46 24" fill="none">
        <rect width="46" height="24" rx="4" fill="#E30613"/>
        <text x="23" y="16.5" textAnchor="middle" fill="#fff"
          fontFamily="'Arial Black',Arial,sans-serif" fontSize="10" fontWeight="900" letterSpacing="1">BLIK</text>
      </svg>
      {/* Visa */}
      <svg width="46" height="24" viewBox="0 0 46 24" fill="none">
        <rect width="46" height="24" rx="4" fill="#fff" stroke={BORD}/>
        <text x="23" y="16.5" textAnchor="middle" fill="#1A1F71"
          fontFamily="'Arial Black',Arial,sans-serif" fontSize="12" fontWeight="900" letterSpacing="0.5">VISA</text>
      </svg>
      {/* Mastercard */}
      <svg width="46" height="24" viewBox="0 0 46 24" fill="none">
        <rect width="46" height="24" rx="4" fill="#fff" stroke={BORD}/>
        <circle cx="17" cy="12" r="7.5" fill="#EB001B"/>
        <circle cx="29" cy="12" r="7.5" fill="#F79E1B"/>
        <ellipse cx="23" cy="12" rx="3.5" ry="7.5" fill="#FF5F00"/>
      </svg>
      {/* Przelewy24 */}
      <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
        <rect width="70" height="24" rx="4" fill="#fff" stroke={BORD}/>
        <text x="35" y="16.5" textAnchor="middle" fill={P24_BRAND} fontFamily="'Arial Black',Arial,sans-serif" fontSize="9" fontWeight="900">Przelewy24</text>
      </svg>
      {/* Google Pay */}
      <svg width="46" height="24" viewBox="0 0 46 24" fill="none">
        <rect width="46" height="24" rx="4" fill="#fff" stroke={BORD}/>
        <text x="8" y="16" fill="#4285F4" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="700">G</text>
        <text x="15" y="16" fill="#111" fontFamily="Arial,sans-serif" fontSize="8" fontWeight="500">Pay</text>
      </svg>
    </div>
  );
}

/* ── Step card icons (SVG) — exported for use with translated steps ───── */
export function CartIcon() {
  return <ShoppingCart color={P24_BRAND} size={32} strokeWidth={1.8} />;
}
export function UserIcon() {
  return <User color={NAVY} size={32} strokeWidth={1.8} />;
}
export function CardIcon() {
  return <CreditCard color={GREEN} size={32} strokeWidth={1.8} />;
}
export function CheckCircleIcon() {
  return <CheckCircle2 color={GREEN} size={32} strokeWidth={1.8} />;
}
function ShieldIcon() {
  return <ShieldCheck color={GREEN} size={20} strokeWidth={2} />;
}

/* ── Props ──────────────────────────────────────────────────────────────── */
interface P24PaymentStepsProps {
  title?: string;
  steps?: Step[];
  securityNote?: string;
}

const DEFAULT_STEPS: Step[] = [
  {
    n: "01",
    icon: <CartIcon />,
    title: "Wybór usługi",
    desc: "Znajdź usługę w tabeli i kliknij «Kup». Zobaczysz dokładną cenę przed płatnością.",
  },
  {
    n: "02",
    icon: <UserIcon />,
    title: "Dane klienta",
    desc: "Wypełnij imię, nazwisko, telefon i email — potrzebne do faktury i kontaktu.",
  },
  {
    n: "03",
    icon: <CardIcon />,
    title: "Płatność Przelewy24",
    desc: "Bezpieczna płatność przez Przelewy24 — karta, BLIK, przelew. Szyfrowanie SSL 256-bit.",
  },
  {
    n: "04",
    icon: <CheckCircleIcon />,
    title: "Potwierdzenie",
    desc: "Otrzymujesz paragon email, a specjalista skontaktuje się w ciągu 2 godzin.",
  },
];

export default function P24PaymentSteps({
  title = "Jak działa proces płatności",
  steps = DEFAULT_STEPS,
  securityNote,
}: P24PaymentStepsProps) {
  const accentFn = (idx: number) => idx % 2 === 0
    ? `linear-gradient(90deg, ${P24_BRAND}, #ff9a80)`
    : `linear-gradient(90deg, ${GREEN}, #86efac)`;

  return (
    <section style={{
      background: LIGHT,
      borderTop: `1px solid ${BORD}`,
      padding: "clamp(48px, 7vw, 80px) 24px",
      fontFamily: "'Syne', 'Inter', system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ height: 2, width: 40, background: P24_BRAND, borderRadius: 2 }} />
            <P24Logo width={120} />
            <div style={{ height: 2, width: 40, background: P24_BRAND, borderRadius: 2 }} />
          </div>
          <h2 style={{
            fontSize: "clamp(22px, 4vw, 34px)",
            fontWeight: 900,
            color: NAVY,
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}>
            {title}
          </h2>
        </div>

        {/* Steps grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}>
          {steps.map((step, idx) => (
            <div
              key={step.n}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px 20px 22px",
                border: `1px solid ${BORD}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top accent bar */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, height: 3,
                background: accentFn(idx),
              }} />

              {/* Step number */}
              <div style={{
                position: "absolute",
                top: 14, right: 16,
                fontSize: 11,
                fontWeight: 800,
                color: BORD,
                letterSpacing: "0.1em",
              }}>
                {step.n}
              </div>

              {/* Icon */}
              <div style={{ marginBottom: 14, marginTop: 4 }}>
                {step.icon}
              </div>

              {/* Title */}
              <p style={{
                fontSize: 14,
                fontWeight: 800,
                color: NAVY,
                margin: "0 0 8px",
                lineHeight: 1.3,
              }}>
                {step.title}
              </p>

              {/* Description */}
              <p style={{
                fontSize: 12.5,
                color: GRAY,
                margin: 0,
                lineHeight: 1.6,
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Security badge bar */}
        <div style={{
          background: "#fff",
          border: `1px solid ${BORD}`,
          borderRadius: 12,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShieldIcon />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>
                Bezpieczna płatność
              </div>
              <div style={{ fontSize: 11, color: GRAY, lineHeight: 1.4 }}>
          <div style={{ fontSize: 11, color: GRAY, lineHeight: 1.4 }}>
                {securityNote ||
                  "PayPro S.A. (Przelewy24) — licencjonowany operator płatności w Polsce · Dane karty nie są przechowywane na naszym serwerze · Szyfrowanie SSL 256-bit"}
              </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <PayIcons />
          </div>
        </div>

        {/* KIR / NBP certification note */}
        <p style={{
          textAlign: "center",
          fontSize: 11,
          color: GRAY,
          marginTop: 14,
          marginBottom: 0,
        }}>
          Operator płatności Przelewy24 jest nadzorowany przez KNF · Certyfikat PCI DSS Level 1
        </p>
      </div>
    </section>
  );
}
