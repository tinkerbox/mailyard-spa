module.exports = {
  distDir: './dist',
  poweredByHeader: false,
  publicRuntimeConfig: {
    REPORT_URI: process.env.REPORT_URI,
    MAILYARD_WEB_URL: process.env.MAILYARD_WEB_URL,
    MAILYARD_API_URL: process.env.MAILYARD_API_URL,
    SENTRY_FRONTEND_DSN: process.env.SENTRY_FRONTEND_DSN,
    HEROKU_SLUG_COMMIT: process.env.HEROKU_SLUG_COMMIT,
  },
};
