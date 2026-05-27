/* /payment/success — сторiнка пiсля успiшної оплати через Przelewy24.
   P24 перенаправляє клiєнта сюди пiсля завершення платежу.
   IPN-вебхук (/api/payment-notify) вже оновив статус ліда. */
import Link from "next/link";

export const metadata = {
  title: "Оплата прийнята — KompasMigracji",
  description: "Ваш платіж успішно оброблено.",
};

export default function PaymentSuccessPage() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "20px",
    }}>
      <div style={{
        background: "#1c2433",
        border: "1px solid #2d3748",
        borderRadius: 20,
        padding: "48px 40px",
        maxWidth: 480,
        width: "100%",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        {/* Іконка успіху */}
        <div style={{
          width: 80, height: 80,
          background: "rgba(34,197,94,0.15)",
          border: "2px solid rgba(34,197,94,0.3)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: 36,
        }}>
          ✅
        </div>

        <h1 style={{
          color: "#e2e8f0",
          fontSize: 26,
          fontWeight: 700,
          margin: "0 0 12px",
        }}>
          Оплату прийнято!
        </h1>

        <p style={{
          color: "#94a3b8",
          fontSize: 15,
          lineHeight: 1.6,
          margin: "0 0 8px",
        }}>
          Дякуємо за довіру до <strong style={{ color: "#a78bfa" }}>KompasMigracji</strong>.
        </p>
        <p style={{
          color: "#94a3b8",
          fontSize: 15,
          lineHeight: 1.6,
          margin: "0 0 32px",
        }}>
          Ваш менеджер зв'яжеться з вами найближчим часом для підтвердження деталей.
        </p>

        {/* Контакт */}
        <div style={{
          background: "rgba(167,139,250,0.08)",
          border: "1px solid rgba(167,139,250,0.2)",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 28,
        }}>
          <div style={{ color: "#8a96a3", fontSize: 12, marginBottom: 4 }}>
            Питання? Зв'яжіться з нами:
          </div>
          <a href="tel:+48729271848" style={{ color: "#a78bfa", fontSize: 18, fontWeight: 700, textDecoration: "none" }}>
            +48 729 271 848
          </a>
        </div>

        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "rgba(167,139,250,0.2)",
            color: "#a78bfa",
            border: "1px solid rgba(167,139,250,0.3)",
            borderRadius: 10,
            padding: "12px 28px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
            transition: "background 0.15s",
          }}
        >
          На головну →
        </Link>
      </div>
    </main>
  );
}
