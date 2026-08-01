import posthog from 'posthog-js';

/** No-ops until a user has consented to analytics cookies and NEXT_PUBLIC_POSTHOG_KEY is set (see components/Analytics.tsx). */
export function trackEvent(name: string, props?: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture(name, props);
    }
  } catch {}
}
