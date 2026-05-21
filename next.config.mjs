import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Routes are file-system based under app/. Old Vite api/* migrate to app/api/.
};

export default withNextIntl(nextConfig);
