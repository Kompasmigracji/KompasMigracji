'use client';
import { useState } from 'react';

const KEY = 'km_consent_v2';

function load() {
  try {
    if (localStorage.getItem('km_cookie') === '1' && !localStorage.getItem(KEY)) {
      const migrated = { necessary: true, analytics: true, decided: true };
      localStorage.setItem(KEY, JSON.stringify(migrated));
      return migrated;
    }
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function useCookieConsent() {
  const [consent, setConsent] = useState(load);

  const save = (data: object) => {
    const full = { ...data, decided: true };
    try { localStorage.setItem(KEY, JSON.stringify(full)); } catch {}
    setConsent(full as typeof consent);
  };

  return {
    decided:    (consent as any)?.decided ?? false,
    analytics:  (consent as any)?.analytics ?? false,
    acceptAll:  () => save({ necessary: true, analytics: true }),
    rejectAll:  () => save({ necessary: true, analytics: false }),
    saveCustom: (data: { analytics: boolean }) => save({ necessary: true, ...data }),
  };
}
