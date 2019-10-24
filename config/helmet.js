const helmet = require('helmet');

const sixMonths = 15768000;
const useNonce = (req, res) => `'nonce-${res.locals.nonce}'`;

const frameguard = { action: 'deny' };

const hsts = {
  maxAge: sixMonths,
  includeSubDomains: true,
  preload: true,
};

const contentSecurityPolicy = (() => {
  if (process.env.NODE_ENV === 'development') return null;
  return {
    directives: {
      baseUri: ["'self'"],
      defaultSrc: ["'none'"],
      formAction: ["'self'"],
      scriptSrc: ["'self'", useNonce],
      styleSrc: ["'self'", "'unsafe-inline'", useNonce],
      connectSrc: ["'self'", process.env.MAILYARD_API_HOST, 'sentry.io'],
      imgSrc: ["'self'", 'lh5.googleusercontent.com'],
      frameAncestors: ["'none'"],
      reportUri: process.env.REPORT_URI,
    },
    reportOnly: process.env.REPORT_URI.endsWith('reportOnly'),
  };
})();

const featurePolicy = (() => {
  if (process.env.NODE_ENV === 'development') return null;
  return {
    features: {
      notifications: ["'self'"],
      push: ["'self'"],
    },
  };
})();

const referrerPolicy = { policy: ['same-origin', 'strict-origin-when-cross-origin'] };

module.exports = helmet({
  frameguard,
  hsts,
  contentSecurityPolicy,
  featurePolicy,
  referrerPolicy,
});
