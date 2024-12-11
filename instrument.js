const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://d235c8e94d182881422f156331eaa98e@o4508236961415168.ingest.de.sentry.io/4508450024128592",

  tracesSampleRate: 1.0,
});
