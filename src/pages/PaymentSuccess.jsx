import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const desc = params.get('desc') || '';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif", padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '48px 40px', maxWidth: 480, width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)', textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 32,
        }}>✓</div>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e293b', margin: '0 0 12px' }}>
          Оплату прийнято!
        </h1>

        {desc && (
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 8px' }}>
            Послуга: <strong style={{ color: '#1e293b' }}>{desc}</strong>
          </p>
        )}

        <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 32px', lineHeight: 1.7 }}>
          Ми отримали оплату та звʼяжемося з вами найближчим часом.
          Якщо виникнуть питання — пишіть у WhatsApp.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href="https://wa.me/48729271848"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block', padding: '13px 24px', borderRadius: 10,
              background: '#25d366', color: '#fff',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
            }}
          >
            Написати у WhatsApp
          </a>
          <Link
            to="/karta"
            style={{
              display: 'block', padding: '13px 24px', borderRadius: 10,
              border: '1.5px solid #e2e8f0', color: '#64748b',
              fontWeight: 600, fontSize: 14, textDecoration: 'none',
            }}
          >
            Повернутися
          </Link>
        </div>

        <p style={{ fontSize: 11, color: '#94a3b8', margin: '24px 0 0' }}>
          Kompas Migracji · DOMUS V Sp. z o.o.
        </p>
      </div>
    </div>
  );
}
