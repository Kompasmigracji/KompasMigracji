import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import KartaLanding from './pages/KartaLanding';
import Regulamin from './pages/Regulamin';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/karta" element={<KartaLanding />} />
        <Route path="/regulamin" element={<Regulamin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
