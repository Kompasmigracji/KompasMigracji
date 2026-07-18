import type { Metadata } from 'next';

// Only exists in uk/pl (see the page's own defaultLangFor comment) — other
// site locales are mapped to the closer of the two, matching page content.
const SEO: Record<'uk' | 'pl', { title: string; description: string }> = {
  uk: {
    title: 'Як це працює — покроковий посібник | Kompas Migracji',
    description: 'Покроковий посібник: як обрати послугу, заповнити заявку та отримати консультацію в Kompas Migracji.',
  },
  pl: {
    title: 'Jak to działa — instrukcja krok po kroku | Kompas Migracji',
    description: 'Instrukcja krok po kroku: jak wybrać usługę, wypełnić formularz i uzyskać konsultację w Kompas Migracji.',
  },
};

function defaultLangFor(locale: string): 'uk' | 'pl' {
  return locale === 'pl' || locale === 'en' || locale === 'rom' ? 'pl' : 'uk';
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const lang = defaultLangFor(locale);
  const s = SEO[lang];
  const url = `https://kompasmigracji.com/${locale}/manual`;
  return {
    title: s.title,
    description: s.description,
    openGraph: { title: s.title, description: s.description, url, siteName: 'KompasMigracji', locale, type: 'website' },
  };
}

export default function ManualLayout({ children }: { children: React.ReactNode }) {
  return children;
}
