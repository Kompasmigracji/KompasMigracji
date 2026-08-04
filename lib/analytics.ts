import posthog from 'posthog-js';

/** No-ops until a user has consented to analytics cookies and NEXT_PUBLIC_POSTHOG_KEY is set (see components/Analytics.tsx). */
export function trackEvent(name: string, props?: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture(name, props);
    }
  } catch {}
}

/** Fires before a direct wa.me redirect so these clicks show up in the funnel — most
 * WhatsApp CTAs skip /api/lead entirely, so this is otherwise invisible in PostHog. */
export function trackWhatsAppClick(location: string) {
  trackEvent('whatsapp_cta_click', { location });
}
