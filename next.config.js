module.exports = {
  distDir: './dist',
  poweredByHeader: false,
  publicRuntimeConfig: {
    MAILYARD_API_URL: process.env.MAILYARD_API_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
};
