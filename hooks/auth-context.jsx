/* globals window, localStorage */

import React, { useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';

import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

const AUTHENTICATE_MUTATION = gql`
  mutation ($username: ID!, $password: String!) {
    authenticate(username: $username, password: $password) {
      token
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation ($username: ID!, $password: String!, $mailbox: MailboxInput!) {
    register(username: $username, password: $password, mailbox: $mailbox) {
      token
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

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const existingToken = (typeof window !== 'undefined') ? localStorage.getItem('authToken') : null;
  const existingAccount = (typeof window !== 'undefined') ? localStorage.getItem('account') : null;

  const { client } = useContext(ApolloContext);
  // TODO: combine state to reduce re-renders
  const [token, setToken] = useState(existingToken);
  const [account, setAccount] = useState(existingAccount ? JSON.parse(existingAccount) : null);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);

  useEffect(() => {
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
  }, [token]);

  useEffect(() => {
    if (account) localStorage.setItem('account', JSON.stringify(account));
    else localStorage.removeItem('account');
  }, [account]);

  useEffect(() => {
    (async () => {
      if (!token) return;
      const result = await client.query({ query: ACCOUNT_QUERY });
      if (mounted.current) setAccount(prev => prev || result.data.account);
    })();
  }, [client, token]);

  const login = useCallback(async (values, callbacks) => {
    try {
      const result = await client.mutate({
        mutation: AUTHENTICATE_MUTATION,
        variables: values,
        fetchPolicy: 'no-cache',
      });
      if (mounted.current) setToken(result.data.authenticate.token);
      client.cache.reset();
      if (callbacks.success) callbacks.success(result.data.authenticate);
    } catch (error) {
      if (callbacks.failure) callbacks.failure(error);
    }
  }, [client]);

  const logout = useCallback(() => {
    setToken(null);
    setAccount(null);
    client.cache.reset();
  }, [client.cache]);

  const register = useCallback(async (values, callbacks) => {
    try {
      const result = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: values,
        fetchPolicy: 'no-cache',
      });
      if (mounted.current) setToken(result.data.register.token);
      if (callbacks.success) callbacks.success(result.data.register);
    } catch (error) {
      if (callbacks.failure) callbacks.failure(error);
    }
  }, [client]);

  const loggedIn = !!token;

  const refresh = useCallback(() => {
    (async () => {
      if (!token) return;
      const result = await client.query({
        query: ACCOUNT_QUERY,
        fetchPolicy: 'no-cache',
      });
      if (mounted.current) setAccount(result.data.account);
    })();
  }, [client, token]);

  const values = useMemo(() => ({
    login,
    logout,
    register,
    account,
    loggedIn,
    refresh,
  }), [account, loggedIn, login, logout, register, refresh]);

  return <AuthContext.Provider value={values} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
