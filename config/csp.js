const helmet = require('helmet');

module.exports = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'none'"],
    scriptSrc: ["'self'"],
    connectSrc: ["'self'", process.env.MAILYARD_API_HOST],
    styleSrc: ["'self'"],
    reportUri: process.env.REPORT_URI,
  },
  reportOnly: process.env.REPORT_URI.endsWith('reportOnly'),
});
