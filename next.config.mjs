import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Only .tsx/.ts files are Next.js pages — excludes legacy src/pages/*.jsx from Pages Router detection
  pageExtensions: ['tsx', 'ts'],
};

export default withNextIntl(nextConfig);
