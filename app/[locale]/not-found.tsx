export default function NotFound() {
  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8f9fb',
        color: '#1a1a2e',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 72, fontWeight: 300, margin: 0 }}>404</h1>
        <p style={{ color: '#7a7a9a', marginTop: 8 }}>Сторінку не знайдено</p>
        <a
          href="/uk"
          style={{
            display: 'inline-block',
            marginTop: 24,
            padding: '10px 24px',
            background: 'linear-gradient(135deg,#2563eb,#059669)',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          На головну
        </a>
      </div>
    </div>
  );
}
