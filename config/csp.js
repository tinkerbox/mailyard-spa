const helmet = require('helmet');

module.exports = helmet.contentSecurityPolicy({
  directives: {
    baseUri: ["'self'"],
    defaultSrc: ["'none'"],
    formAction: ["'self'"],
    scriptSrc: ["'self'"],
    connectSrc: ["'self'", "apis.google.com", process.env.MAILYARD_API_HOST],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'"],
    frameAncestors: ["'none'"],
    reportUri: process.env.REPORT_URI,
  },
  reportOnly: process.env.REPORT_URI.endsWith('reportOnly'),
});
