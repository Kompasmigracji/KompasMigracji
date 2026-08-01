'use client';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { useCookieConsent } from '@/lib/useCookieConsent';

/** PostHog only starts after the visitor has explicitly consented to analytics cookies (RODO). */
export default function Analytics() {
  const { decided, analytics } = useCookieConsent();

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || !decided || !analytics || posthog.__loaded) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, [decided, analytics]);

  return null;
}
