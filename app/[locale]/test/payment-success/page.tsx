'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/lib/navigation';

function Content() {
  const params = useSearchParams();
  const desc = params?.get('desc') || '';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-soft px-6">
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200 max-w-md w-full text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #2563eb, #059669)' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="font-serif font-light text-navy mb-3" style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}>
          Оплату отримано
        </h1>

        {desc && (
          <p className="text-sm font-semibold text-primary mb-4">{decodeURIComponent(desc)}</p>
        )}

        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Дякуємо! Наш спеціаліст зв&apos;яжеться з вами найближчим часом через WhatsApp для підтвердження та уточнення деталей.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="gradient-btn text-white font-semibold px-6 py-3 rounded-lg text-sm no-underline inline-block"
          >
            На головну
          </Link>
          <a
            href="https://wa.me/48729271848"
            target="_blank"
            rel="noreferrer"
            className="bg-white border-2 border-gray-200 text-navy font-semibold px-6 py-3 rounded-lg text-sm no-underline inline-block hover:border-primary hover:text-primary transition-colors"
          >
            WhatsApp →
          </a>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-soft">
        <div className="text-gray-400 text-sm">Завантаження...</div>
      </main>
    }>
      <Content />
    </Suspense>
  );
}
