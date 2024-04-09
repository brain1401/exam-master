// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6f228b3ef81ec4685a448b9bb07255e2@o4506315586011136.ingest.sentry.io/4506315638439941",
  enabled: process.env.NODE_ENV === "production",
  beforeSend(event, hint) {
    const error = hint.originalException as Error & { digest?: string };

    if (error?.digest) {
      event.tags = {
        ...event.tags,
        digest: error.digest,
      };
    }

    return event;
  },
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
