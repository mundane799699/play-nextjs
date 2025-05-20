/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'https://readecho.cn/prod-api',
  },
};

module.exports = nextConfig;
