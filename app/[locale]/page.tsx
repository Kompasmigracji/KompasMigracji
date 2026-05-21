import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        <span className="inline-block px-4 py-2 mb-6 text-sm rounded-full bg-gray-50 border border-gray-200">
          {t('hero_badge')}
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-6">
          {t('hero_title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          {t('hero_sub')}
        </p>
        <div className="text-xs text-gray-400 pt-12 border-t border-gray-100">
          Next.js 14 · TypeScript · next-intl · Tailwind 4 — scaffold OK ✓
        </div>
      </div>
    </main>
  );
}
