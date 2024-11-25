import type { NextConfig } from "next";

const GIT_HASH = process.env.GIT_HASH;

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.AWS_CLOUDFRONT_DOMAIN || "",
      },
    ],
  },
  webpack(config, { buildId }) {
    console.log(`현재 GIT HASH : ${GIT_HASH || "찾을 수 없음"}`);

    console.log(`현재 Build ID : ${buildId}`);

    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  output: "standalone",
  ...(process.env.NODE_ENV === "production"
    ? {
        compiler: {
          removeConsole: {
            exclude: ["error", "warn"],
          },
        },
      }
    : {
        experimental: {
          turbo: {
            rules: {
              "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js",
              },
            },
          },
        },
      }),

  ...(GIT_HASH
    ? {
        generateBuildId: async () => GIT_HASH,
      }
    : {}),
  cacheHandler: require.resolve("./cache-handler.js"),
  cacheMaxMemorySize: 0,
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "taegeuk-hong",
    project: "exammaster",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);
