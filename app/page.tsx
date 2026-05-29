import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';

  const supported = ['uk', 'pl', 'en', 'ru'];
  const browserLangs = acceptLanguage
    .split(',')
    .map(l => l.split(';')[0].trim().toLowerCase().slice(0, 2));

  const matched = browserLangs.find(lang => supported.includes(lang));
  redirect(`/${matched ?? 'uk'}`);
  return null;
}
