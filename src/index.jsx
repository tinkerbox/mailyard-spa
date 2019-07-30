
import React from 'react';
import ReactDOM from 'react-dom';

import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: process.env.SENTRY_DSN });

const title = 'React with Webpack and Babel';

const App = () => <div>{title}</div>;

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

if (module.hot) module.hot.accept();
