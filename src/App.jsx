import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Home from './pages/Home';

const KartaLanding = lazy(() => import('./pages/KartaLanding'));
const Regulamin = lazy(() => import('./pages/Regulamin'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Admin = lazy(() => import('./pages/Admin'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/karta" element={<KartaLanding />} />
          <Route path="/regulamin" element={<Regulamin />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
}
