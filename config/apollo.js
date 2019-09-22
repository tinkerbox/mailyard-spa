import 'cross-fetch/polyfill';

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';

import { RetryLink } from 'apollo-link-retry';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { onError } from 'apollo-link-error';

import { InMemoryCache } from 'apollo-cache-inmemory';

import config from './runtime';

const Connect = (release, errorHandler) => new ApolloClient({
  version: release,
  link: ApolloLink.from([
    onError(errorHandler),
    new RetryLink(),
    new BatchHttpLink({
      uri: config.MAILYARD_API_URL,
      credentials: 'include',
    }),
  ]),
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development',
});

module.exports = Connect;
