import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';


export const locales = ['uk', 'pl', 'en', 'ru', 'rom'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pl';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  if (!locales.includes(locale as Locale)) notFound();
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
