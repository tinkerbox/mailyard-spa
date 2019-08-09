const helmet = require('helmet');

module.exports = helmet.contentSecurityPolicy({
  directives: {
    baseUri: ["'self'"],
    defaultSrc: ["'none'"],
    formAction: ["'self'"],
    scriptSrc: ["'self'", 'apis.google.com'],
    frameSrc: ['accounts.google.com', 'content.googleapis.com'],
    connectSrc: ["'self'", process.env.MAILYARD_API_HOST],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'lh5.googleusercontent.com'],
    frameAncestors: ["'none'"],
    reportUri: process.env.REPORT_URI,
  },
  reportOnly: process.env.REPORT_URI.endsWith('reportOnly'),
});
