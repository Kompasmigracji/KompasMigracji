import React, { useState } from 'react';

export default function CookieBanner() {
  const [consent, setConsent] = useState(
    localStorage.getItem('km_cookie') === '1'
  );

  if (consent) return null;

  const accept = () => {
    localStorage.setItem('km_cookie', '1');
    setConsent(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm bg-white border border-gray-200 text-navy p-5 rounded-xl shadow-lg z-50">
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Ми використовуємо cookie для покращення сервісу. Натискаючи «Прийняти», ви погоджуєтесь з RODO.
      </p>
      <div className="flex gap-3">
        <button
          onClick={accept}
          className="gradient-btn text-white text-sm font-semibold px-4 py-2 rounded-lg flex-1"
        >
          Прийняти
        </button>
        <button
          onClick={accept}
          className="text-sm text-gray-400 hover:text-gray-600 px-3 py-2 transition-colors"
        >
          Закрити
        </button>
      </div>
    </div>
  );
}
