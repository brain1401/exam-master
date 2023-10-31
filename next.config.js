/** @type {import('next').NextConfig} */
const nextConfig = {
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
