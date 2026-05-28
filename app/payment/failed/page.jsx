/* /payment/failed — P24 redirects here after failed/cancelled payment */
import Link from "next/link";

export const metadata = {
  title: "Płatność nieudana — Kompas Migracji",
};

const P24_RED   = "#D8232A";
const P24_GREEN = "#44A649";
const P24_BORDER = "#DEE2E6";
const P24_BG    = "#F8F9FA";
const P24_TEXT  = "#212529";
const P24_MUTED = "#6C757D";

function P24Logo() {
  return (
    <svg width="110" height="26" viewBox="0 0 126 30" fill="none" aria-label="Przelewy24">
      <rect width="126" height="30" rx="5" fill={P24_RED}/>
      <text x="63" y="21" textAnchor="middle" fill="#fff" fontFamily="'Arial Black',Arial,sans-serif" fontSize="13" fontWeight="900" letterSpacing="0.4">przelewy24</text>
    </svg>
  );
}

export default function PaymentFailedPage() {
  return (
    <main style={{ minHeight:"100vh", background:"#EBEEF2", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',Arial,sans-serif", padding:"20px 16px" }}>
      <div style={{ width:"100%", maxWidth:460, background:"#fff", borderRadius:12, boxShadow:"0 8px 40px rgba(0,0,0,0.12)", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:"#fff", borderBottom:`1px solid ${P24_BORDER}`, padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <P24Logo />
          <div style={{ fontSize:11, color:P24_MUTED, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={P24_GREEN} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Bezpieczna płatność
          </div>
        </div>

        <div style={{ padding:"32px 28px" }}>
          {/* Big red X */}
          <div style={{ width:76, height:76, borderRadius:"50%", background:"rgba(216,35,42,0.1)", border:`2px solid ${P24_RED}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={P24_RED} strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>

          <h1 style={{ fontSize:22, fontWeight:800, color:P24_TEXT, textAlign:"center", margin:"0 0 8px" }}>
            Płatność nieudana
          </h1>
          <p style={{ fontSize:14, color:P24_MUTED, textAlign:"center", lineHeight:1.7, margin:"0 0 24px" }}>
            На жаль, оплату не було завершено. Жодних коштів не списано.
            <br/>Спробуйте ще раз або зв&apos;яжіться з нами.
          </p>

          {/* Possible reasons */}
          <div style={{ background:"rgba(216,35,42,0.05)", border:`1px solid rgba(216,35,42,0.2)`, borderRadius:8, padding:"14px 16px", marginBottom:24 }}>
            <div style={{ fontSize:11, fontWeight:700, color:P24_RED, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Możliwe przyczyny</div>
            {[
              "Niepoprawny kod BLIK lub wygasł",
              "Niewystarczające środki na koncie",
              "Płatność anulowana przez użytkownika",
              "Przekroczony limit czasowy transakcji",
            ].map((item, i) => (
              <div key={i} style={{ fontSize:12, color:P24_MUTED, marginBottom: i < 3 ? 5 : 0, display:"flex", alignItems:"flex-start", gap:6 }}>
                <span style={{ color:P24_RED, flexShrink:0, marginTop:1 }}>·</span> {item}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
            <Link href="/pricing" style={{ display:"block", textAlign:"center", padding:"12px 0", borderRadius:8, background:P24_GREEN, color:"#fff", fontWeight:700, fontSize:14, textDecoration:"none" }}>
              Spróbuj ponownie →
            </Link>
            <a href="https://wa.me/48729271848" target="_blank" rel="noreferrer" style={{ display:"block", textAlign:"center", padding:"11px 0", borderRadius:8, background:"rgba(37,211,102,0.1)", border:"1.5px solid rgba(37,211,102,0.3)", color:"#16a34a", fontWeight:700, fontSize:14, textDecoration:"none" }}>
              💬 Зв&apos;язатися з менеджером
            </a>
            <Link href="/" style={{ display:"block", textAlign:"center", padding:"10px 0", borderRadius:8, border:`1.5px solid ${P24_BORDER}`, color:P24_MUTED, fontWeight:600, fontSize:13, textDecoration:"none" }}>
              На головну
            </Link>
          </div>

          {/* Contact */}
          <div style={{ textAlign:"center" }}>
            <span style={{ fontSize:12, color:P24_MUTED }}>Телефон: </span>
            <a href="tel:+48729271848" style={{ fontSize:13, fontWeight:700, color:P24_TEXT, textDecoration:"none" }}>+48 729 271 848</a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background:P24_BG, borderTop:`1px solid ${P24_BORDER}`, padding:"10px 20px", textAlign:"center" }}>
          <span style={{ fontSize:10, color:"#9CA3AF", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={P24_GREEN} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            SSL 256-bit · Przelewy24 sp. z o.o. · Nadzór KNF
          </span>
        </div>
      </div>
    </main>
  );
}
