import React, { useContext } from 'react';

import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

const AUTHENTICATE = gql`
  mutation ($username: ID!, $password: String!) {
    authenticate(username: $username, password: $password) {
      token
    }
  }
`;

const REGISTER = gql`
  mutation ($username: ID!, $password: String!, $mailbox: MailboxInput!) {
    register(username: $username, password: $password, mailbox: $mailbox) {
      token
    }
  }
`;

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const { client } = useContext(ApolloContext);

  const login = async (values, callbacks) => {
    try {
      const result = await client.mutate({
        mutation: AUTHENTICATE,
        variables: values,
      });
      localStorage.setItem('authToken', result.data.authenticate.token);
      if (callbacks.success) callbacks.success(result.data.authenticate);
    } catch (error) {
      if (callbacks.failure) callbacks.failure(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
  };

  const register = async (values, callbacks) => {
    try {
      const result = await client.mutate({
        mutation: REGISTER,
        variables: values,
      });
      if (callbacks.success) callbacks.success(result.data.register);
    } catch (error) {
      if (callbacks.failure) callbacks.failure(error);
    }
  };

  const values = { login, logout, register };
  return <AuthContext.Provider value={values} {...props} />
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth }
