/* globals window, localStorage */

import { isEqual } from 'lodash';
import React, { useContext, useReducer, useEffect, useCallback, useRef, useMemo } from 'react';
import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

const STORAGE_IDENTIFIER = 'account';

const REGISTER_MUTATION = gql`
  mutation ($username: ID!, $password: String!, $mailbox: MailboxInput!) {
    register(username: $username, password: $password, mailbox: $mailbox) {
      username
    }
  }
`;

const AUTHENTICATE_MUTATION = gql`
  mutation ($username: ID!, $password: String!) {
    authenticate(username: $username, password: $password) {
      username
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation {
    logout {
      username
    }
  }
`;

const ACCOUNT_QUERY = gql`
  query {
    account {
      username
      defaultMailbox {
        id
        position
        defaultLabelId
        defaultLabel {
          id
          name
          slug
        }
      }
      mailboxes {
        id
        name
        email
        position
        defaultLabel {
          id
          slug
        }
        labels {
          id
          name
          slug
        }
      }
    }
  }
`;

const reducer = (state, action) => {
  const { payload, type } = action;
  const nextState = (() => {
    switch (type) {
      case 'register':
        localStorage.setItem(STORAGE_IDENTIFIER, payload.username);
        return { account: null, loading: true };

      case 'login':
        localStorage.setItem(STORAGE_IDENTIFIER, payload.username);
        return { account: null, loading: true };

      case 'logout':
        localStorage.removeItem(STORAGE_IDENTIFIER);
        return { account: null, loading: false };

      case 'refresh': {
        const { account } = payload;
        return { ...state, account, loading: false };
      }

      default:
        throw new Error();
    }
  })();

  if (isEqual(state, nextState)) return state;
  return nextState;
};

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const existingAccountId = (typeof window !== 'undefined') ? localStorage.getItem(STORAGE_IDENTIFIER) : null;

  const { client } = useContext(ApolloContext);
  const mounted = useRef(true);
  const [state, dispatch] = useReducer(reducer, { account: null, accountId: null, loading: true });

  useEffect(() => () => { mounted.current = false; }, []);

  const register = useCallback((values, callbacks = {}) => {
    client.mutate({
      mutation: REGISTER_MUTATION,
      variables: values,
      fetchPolicy: 'no-cache',
    }).then(({ data }) => {
      dispatch({ type: 'register', payload: data.register });
      if (callbacks.success) callbacks.success(data.register);
    }).catch((error) => {
      dispatch({ type: 'refresh', payload: { account: null } });
      if (callbacks.failure) callbacks.failure(error);
    });
  }, [client]);

  const login = useCallback((values, callbacks = {}) => {
    client.mutate({
      mutation: AUTHENTICATE_MUTATION,
      variables: values,
      fetchPolicy: 'no-cache',
    }).then(({ data }) => {
      client.cache.reset();
      dispatch({ type: 'login', payload: data.authenticate });
      if (callbacks.success) callbacks.success(data.authenticate);
    }).catch((error) => {
      dispatch({ type: 'refresh', payload: { account: null } });
      if (callbacks.failure) callbacks.failure(error);
    });
  }, [client]);

  const logout = useCallback((callbacks = {}) => {
    client.mutate({
      mutation: LOGOUT_MUTATION,
      fetchPolicy: 'no-cache',
    }).then(() => {
      client.cache.reset();
      dispatch({ type: 'logout' });
      if (callbacks.success) callbacks.success();
    }).catch((error) => {
      if (callbacks.failure) callbacks.failure(error);
    });
  }, [client]);

  const refresh = useCallback(() => {
    client.query({ query: ACCOUNT_QUERY, fetchPolicy: 'no-cache' })
      .then(({ data }) => dispatch({ type: 'refresh', payload: { account: data.account } }))
      .catch(() => {
        localStorage.removeItem(STORAGE_IDENTIFIER);
        dispatch({ type: 'refresh', payload: { account: null } });
      });
  }, [client]);

  useEffect(() => {
    if (!state.account && existingAccountId) refresh();
  }, [existingAccountId, refresh, state.account]);

  const values = useMemo(() => ({
    login,
    logout,
    register,
    refresh,
    ...state,
  }), [login, logout, refresh, register, state]);

  return <AuthContext.Provider value={values} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
