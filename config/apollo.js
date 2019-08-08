/* global localStorage */

import 'cross-fetch/polyfill';

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';

import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';

import { InMemoryCache } from 'apollo-cache-inmemory';

import config from './runtime';

const withToken = setContext(() => {
  const token = localStorage.getItem('authToken');
  const authorization = token ? `Bearer ${token}` : '';
  return { headers: { authorization } };
});

const Connect = (release, errorHandler) => new ApolloClient({
  version: release,
  link: ApolloLink.from([
    withToken,
    onError(errorHandler),
    new RetryLink(),
    new HttpLink({ uri: config.MAILYARD_API_URL }),
  ]),
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development',
});

module.exports = Connect;
