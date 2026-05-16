import { useState } from 'react';

const KEY = 'km_consent_v2';

function load() {
  try {
    // migrate old single-accept format
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

  const save = (data) => {
    const full = { ...data, decided: true };
    try { localStorage.setItem(KEY, JSON.stringify(full)); } catch {}
    setConsent(full);
  };

  return {
    decided:      consent?.decided ?? false,
    analytics:    consent?.analytics ?? false,
    acceptAll:    () => save({ necessary: true, analytics: true }),
    rejectAll:    () => save({ necessary: true, analytics: false }),
    saveCustom:   (analytics) => save({ necessary: true, analytics }),
  };
}
