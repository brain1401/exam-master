/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "strapi-exam.brain1401.duckdns.org",
      },
    ],
  },
};

module.exports = nextConfig
