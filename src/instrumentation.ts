import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: "https://6f228b3ef81ec4685a448b9bb07255e2@o4506315586011136.ingest.sentry.io/4506315638439941",
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
      enabled: process.env.NODE_ENV === "production",
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
    });
  }
  if (process.env.NEXT_RUNTIME === "edge") {
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
  }
}
