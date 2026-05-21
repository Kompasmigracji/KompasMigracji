import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['uk', 'pl', 'en', 'ru'],
  defaultLocale: 'uk',
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|favicon\\.ico|.*\\..*).*)'],
};
