/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enables readable stack traces even in production
  productionBrowserSourceMaps: true,

  // Required to avoid Turbopack warning
  turbopack: {},
};

export default nextConfig;
