const path = require('path');
const withOffline = require('next-offline');
const withWorkers = require('@zeit/next-workers');
const withCSS = require('@zeit/next-css');

module.exports = withOffline(withWorkers(withCSS({
  distDir: './dist',
  poweredByHeader: false,

  webpack: (config) => {
    // eslint-disable-next-line no-param-reassign
    config.output.globalObject = 'this';
    return config;
  },

  publicRuntimeConfig: {
    MAILYARD_WEB_URL: process.env.MAILYARD_WEB_URL,
    MAILYARD_API_URL: process.env.MAILYARD_API_URL,
    SENTRY_FRONTEND_DSN: process.env.SENTRY_FRONTEND_DSN,
    HEROKU_SLUG_COMMIT: process.env.HEROKU_SLUG_COMMIT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_SCOPE: process.env.GOOGLE_SCOPE,
  },

  devSwSrc: path.join(__dirname, 'service-worker.js'),
  dontAutoRegisterSw: true,
})));
