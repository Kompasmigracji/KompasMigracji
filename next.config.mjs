import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Include .jsx/.js for KompasCRM admin pages alongside .tsx/.ts
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default withNextIntl(nextConfig);
