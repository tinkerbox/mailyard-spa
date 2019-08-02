import 'cross-fetch/polyfill';

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';

import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';

import { InMemoryCache } from 'apollo-cache-inmemory';

import config from '../config/runtime';

const withError = onError((error) => {
  const { graphQLErrors, networkError } = error;

  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const withToken = setContext(() => {
  const token = localStorage.getItem('authToken');
  const authorization = token ? `Bearer ${token}` : '';
  return { headers: { authorization } };
});

const client = new ApolloClient({
  link: ApolloLink.from([
    withToken,
    withError,
    new RetryLink(),
    new HttpLink({ uri: config.MAILYARD_API_URL }),
  ]),
  cache: new InMemoryCache(),
});

module.exports = client;
