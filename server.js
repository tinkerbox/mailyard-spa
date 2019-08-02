const express = require('express');
const next = require('next');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

const nextApp = next({
  dev: (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging'),
});
const handler = nextApp.getRequestHandler();

nextApp.prepare()
  .then(() => {
    app.use(helmet());
    // app.use(express.static('dist'));
    app.get('*', handler);
    app.listen(port, () => console.log(`Mailyard SPA listening on port ${port}!`));
  })
  .catch((error) => {
    console.error(error.stack);
    process.exit(1);
  });

