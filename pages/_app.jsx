import React from 'react';
import App from 'next/app';
import Head from 'next/head';

import { ApolloProvider } from 'react-apollo';
import * as Sentry from '@sentry/browser';

import 'antd/dist/antd.min.css';

import Connect from '../config/apollo';
import config from '../config/runtime';

import { AuthProvider } from '../hooks/auth-context';

const RELEASE_NAME = `${config.HEROKU_SLUG_COMMIT}@mailyard-spa`;

Sentry.init({
  dsn: config.SENTRY_FRONTEND_DSN,
  release: RELEASE_NAME,
});

const errorHandler = (error) => {
  const { graphQLErrors, networkError } = error;

  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      // TODO: filter out errors that can be ignored, track the rest
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) {
    // TODO: track authentication failures, and remove JWT
    console.log(error);
    console.error(`[Network error]: ${networkError}`);
  }
};

const apollo = Connect(RELEASE_NAME, errorHandler);

class MailyardSPA extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>

        <Head>
          <title>Mailyard SPA</title>
        </Head>

        <ApolloProvider client={apollo}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </ApolloProvider>

      </React.Fragment>
    );
  }
}

export default MailyardSPA;
