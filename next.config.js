/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    leagueId: "764",
    serverUrl: "https://tplapp.onrender.com/",
  },
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig;
