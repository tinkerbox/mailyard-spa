require('dotenv').config();
require('sqreen');

const Sentry = require('@sentry/node');
const express = require('express');
const next = require('next');
const helmet = require('helmet');

const { logger } = require('./lib/logger');
const csp = require('./config/csp');

const dev = process.env.NODE_ENV === 'development';

if (!dev) {
  Sentry.init({
    dsn: process.env.SENTRY_BACKEND_DSN,
    release: `${process.env.HEROKU_SLUG_COMMIT}@mailyard-spa`,
  });
}

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet({
  frameguard: {
    action: 'deny',
  },
}));

if (!dev) {
  app.use((req, res, _next) => {
    if (req.headers['x-forwarded-proto'] === 'https') return _next();
    return res.redirect(`https://${req.headers.host}${req.url}`);
  });

  app.use(csp);
}

if (process.env.CANONICAL_HOST) {
  app.use((req, res, _next) => {
    if (req.headers.host === process.env.CANONICAL_HOST) return _next();
    return res.redirect(301, `${req.protocol}://${process.env.CANONICAL_HOST}${req.url}`);
  });
}

const nextApp = next({ dev });
const handler = nextApp.getRequestHandler();

nextApp.prepare()
  .then(() => {
    app.get('*', handler);
    app.listen(port, () => logger.info(`Mailyard SPA listening on port ${port}!`));
  })
  .catch((error) => {
    logger.error(error.stack);
    process.exit(1);
  });
