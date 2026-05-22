'use client';
import { useState, useEffect } from 'react';

const KEY = 'km_consent_v2';

type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  decided: boolean;
};

function isCookieConsent(value: unknown): value is CookieConsent {
  if (!value || typeof value !== 'object') return false;
  const consent = value as Record<string, unknown>;
  return (
    typeof consent.necessary === 'boolean' &&
    typeof consent.analytics === 'boolean' &&
    typeof consent.decided === 'boolean'
  );
}

function load(): CookieConsent | null {
  try {
    if (localStorage.getItem('km_cookie') === '1' && !localStorage.getItem(KEY)) {
      const migrated: CookieConsent = { necessary: true, analytics: true, decided: true };
      localStorage.setItem(KEY, JSON.stringify(migrated));
      return migrated;
    }
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isCookieConsent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    setConsent(load());
  }, []);

  const save = (data: Pick<CookieConsent, 'necessary' | 'analytics'>) => {
    const full: CookieConsent = { ...data, decided: true };
    try {
      localStorage.setItem(KEY, JSON.stringify(full));
    } catch {}
    setConsent(full);
  };

  return {
    decided: consent?.decided ?? false,
    analytics: consent?.analytics ?? false,
    acceptAll: () => save({ necessary: true, analytics: true }),
    rejectAll: () => save({ necessary: true, analytics: false }),
    saveCustom: (data: { analytics: boolean }) => save({ necessary: true, ...data }),
  };
}
