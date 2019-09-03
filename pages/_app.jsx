/* globals localStorage */
/* eslint-disable no-console */

import { find } from 'lodash';
import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import { ApolloProvider } from 'react-apollo';
import * as Sentry from '@sentry/browser';

import 'antd/dist/antd.min.css';

import Connect from '../config/apollo';
import config from '../config/runtime';
import { AuthProvider } from '../hooks/auth-context';
import { GoogleProvider } from '../hooks/google-context';

const RELEASE_NAME = `${config.HEROKU_SLUG_COMMIT}@mailyard-spa`;
if (process.env.NODE_ENV !== 'production') whyDidYouRender(React);

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: config.SENTRY_FRONTEND_DSN,
    release: RELEASE_NAME,
  });
}

const errorHandler = (error) => {
  const { graphQLErrors, networkError } = error;

  if (graphQLErrors) {
    const forbidden = find(graphQLErrors, (e) => { return e.extensions.exception.name === 'ForbiddenError'; });
    if (forbidden) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('account');
    } else {
      graphQLErrors.map(({ message, locations, path }) => {
        // TODO: filter out errors that can be ignored, track the rest
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      });
      Sentry.captureException(error);
    }
  }

  if (networkError) {
    // TODO: track authentication failures, and remove JWT
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
          <GoogleProvider clientId={config.GOOGLE_CLIENT_ID} scope={config.GOOGLE_SCOPE}>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </GoogleProvider>
        </ApolloProvider>

      </React.Fragment>
    );
  }
}

export default MailyardSPA;
