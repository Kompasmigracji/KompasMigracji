"use client";
/* PayU-branded payment steps section — used on pricing, plans, karta pages */

interface Step {
  n: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const PAYU_BLUE = "#00AEEF";
const GREEN = "#44A649";
const NAVY  = "#1B2547";
const GRAY  = "#6C757D";
const LIGHT = "#F8F9FA";
const BORD  = "#DEE2E6";

/* ── Official PayU logo ─────────────────────────────────── */
export function P24Logo({ width = 140 }: { width?: number }) {
  const h = Math.round(width * 0.27);
  return (
    <svg width={width} height={h} viewBox="0 0 140 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PayU">
      <rect width="140" height="38" rx="6" fill={PAYU_BLUE} />
      <text x="70" y="26" textAnchor="middle" fill="#fff" fontFamily="'Arial Black', 'Arial', sans-serif"
        fontSize="18" fontWeight="900" letterSpacing="1">PayU</text>
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
      {/* PayU */}
      <svg width="46" height="24" viewBox="0 0 46 24" fill="none">
        <rect width="46" height="24" rx="4" fill={PAYU_BLUE}/>
        <text x="23" y="16.5" textAnchor="middle" fill="#fff"
          fontFamily="'Arial Black',Arial,sans-serif" fontSize="10" fontWeight="900">PayU</text>
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
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={PAYU_BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}
export function UserIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
export function CardIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
}
export function CheckCircleIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
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
    title: "Płatność PayU",
    desc: "Bezpieczna płatność przez PayU — karta, BLIK, przelew. Szyfrowanie SSL 256-bit.",
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
            <div style={{ height: 2, width: 40, background: RED, borderRadius: 2 }} />
            <P24Logo width={120} />
            <div style={{ height: 2, width: 40, background: RED, borderRadius: 2 }} />
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
                  "PayU S.A. — licencjonowany operator płatności w Polsce · Dane karty nie są przechowywane na naszym serwerze · Szyfrowanie SSL 256-bit"}
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
          Operator płatności PayU jest nadzorowany przez KNF · Certyfikat PCI DSS Level 1
        </p>
      </div>
    </section>
  );
}
