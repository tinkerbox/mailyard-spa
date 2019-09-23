/* globals window, localStorage */

import { isEqual } from 'lodash';
import React, { useContext, useReducer, useEffect, useCallback, useRef } from 'react';
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
      defaultMailboxId
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
      }
    }
  }
`;

const reducer = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case 'register': {
      localStorage.setItem(STORAGE_IDENTIFIER, payload.username);
      const nextState = { account: null, loading: true };
      if (isEqual(state, nextState)) return state;
      return nextState;
    }

    case 'login': {
      localStorage.setItem(STORAGE_IDENTIFIER, payload.username);
      const nextState = { account: null, loading: true };
      if (isEqual(state, nextState)) return state;
      return nextState;
    }

    case 'logout': {
      localStorage.removeItem(STORAGE_IDENTIFIER);
      const nextState = { account: null, loading: false };
      if (isEqual(state, nextState)) return state;
      return nextState;
    }

    case 'refresh': {
      const { account } = payload;
      const nextState = { ...state, account, loading: false };
      if (isEqual(state, nextState)) return state;
      return nextState;
    }

    default:
      throw new Error();
  }
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

  const values = {
    login,
    logout,
    register,
    refresh,
    ...state,
  };

  return <AuthContext.Provider value={values} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
