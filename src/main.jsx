/*! @preserve © 2026 Oleksandr Khrystodul — iPhoenixGSM® | iphoenixgsm@gmail.com */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';
import './lib/watermark';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
