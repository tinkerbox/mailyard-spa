import React, { useState, useContext, useEffect } from 'react';

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
      defaultMailboxId
    }
  }
`;

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const existingToken = (typeof window !== 'undefined') ? localStorage.getItem('authToken') : null;

  const { client } = useContext(ApolloContext);
  const [account, setAccount] = useState();
  const [token, setToken] = useState(existingToken);

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (!token) return;
      try {
        const result = await client.query({ query: ACCOUNT_QUERY });
        if (!didCancel) setAccount(result.data.account);
      } catch (error) {
        setToken(null);
      }
    })();

    return () => { didCancel = true };
  }, [token]);

  const login = async (values, callbacks) => {
    try {
      const result = await client.mutate({
        mutation: AUTHENTICATE_MUTATION,
        variables: values,
      });
      setToken(result.data.authenticate.token);
      client.cache.reset();
      if (callbacks.success) callbacks.success(result.data.authenticate);
    } catch (error) {
      if (callbacks.failure) callbacks.failure(error);
    }
  };

  const logout = () => {
    setToken(null);
    setAccount(null);
    client.cache.reset();
  };

  const register = async (values, callbacks) => {
    try {
      const result = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: values,
      });
      setToken(result.data.register.token);
      if (callbacks.success) callbacks.success(result.data.register);
    } catch (error) {
      if (callbacks.failure) callbacks.failure(error);
    }
  };

  const loggedIn = !!token;

  const values = {
    login,
    logout,
    register,
    account,
    loggedIn,
  };

  return <AuthContext.Provider value={values} {...props} />
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth }
