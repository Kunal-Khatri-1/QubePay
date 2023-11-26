/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [
      "firebase-admin",
    ] /** @notice packages added here will not be included in the client bundle */,
  },
};

module.exports = {
  env: {},
};

module.exports = nextConfig;
