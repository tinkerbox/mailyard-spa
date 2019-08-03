require('dotenv').config();

const Sentry = require('@sentry/node');

const express = require('express');
const next = require('next');
const helmet = require('helmet');

Sentry.init({
  dsn: process.env.SENTRY_BACKEND_DSN,
  release: `${process.env.HEROKU_SLUG_COMMIT}@mailyard-spa`,
});

const app = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'development') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] === 'https') return next();
    return res.redirect(`https://${req.headers.host}${req.url}`);
  });
}

if (process.env.CANONICAL_HOST) {
  app.use((req, res, next) => {
    if (req.headers.host === process.env.CANONICAL_HOST) return next();
    return res.redirect(301, `${req.protocol}://${process.env.CANONICAL_HOST}${req.url}`);
  });
}

app.use(helmet());

const nextApp = next({
  dev: (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging'),
});
const handler = nextApp.getRequestHandler();

nextApp.prepare()
  .then(() => {
    app.get('*', handler);
    app.listen(port, () => console.log(`Mailyard SPA listening on port ${port}!`));
  })
  .catch((error) => {
    console.error(error.stack);
    process.exit(1);
  });

