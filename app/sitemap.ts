import type { MetadataRoute } from 'next';
import { locales } from '@/i18n';

const SITE = 'https://kompasmigracji.com';

// Mirrors the real page tree under app/[locale]/* — excludes app/[locale]/test/*
// (internal/scratch pages, e.g. payment-success redirect targets, not meant to be indexed).
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/orakul', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/karta', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/plans', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/doctrine', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/book', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/manual', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/regulamin', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
];

// localePrefix is "always" (middleware.ts) — every locale, including the
// default, requires a URL prefix. No unprefixed entries.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return locales.flatMap((locale) =>
    ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }))
  );
}
