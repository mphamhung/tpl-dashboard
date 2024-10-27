/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    leagueId: "764",
    serverUrl: "https://tplapp.onrender.com/",
    DATABASE_URL:
      "sql://michael:MJ47gafJJ9iuAlpMyoVf6A@tpl-dashboard-cluster-14037.7tt.aws-us-east-1.cockroachlabs.cloud:26257/dashboard-db",
  },
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    workerThreads: true,
  },
};
module.exports = nextConfig;
