import React from 'react';
import App, { Container } from 'next/app';

import { ApolloProvider } from 'react-apollo';
import * as Sentry from '@sentry/browser';

import apollo from '../config/apollo';
import config from '../config/runtime';

Sentry.init({
  dsn: config.SENTRY_FRONTEND_DSN,
  release: `${config.HEROKU_SLUG_COMMIT}@mailyard-spa`,
});

class MailyardSPA extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default MailyardSPA;
