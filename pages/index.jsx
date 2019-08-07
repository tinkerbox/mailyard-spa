import React, { useEffect } from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { Layout, Button } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useAuth } from '../hooks/auth-context';

const { Content } = Layout;

const HELLO = gql`
  {
    hello
  }
`;

const Index = () => {
  const { loggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) router.push('/login');
  }, [loggedIn]);

  const onLogout = () => {
    logout();
    router.push('/login');
  }

  return (
    <Content>
      <Query query={HELLO}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>{`Error: ${error.message}`}</p>;
          return <p>{data.hello}</p>;
        }}
      </Query>
      <Link href='/'><a>Again</a></Link>
      <Button type='link' onClick={onLogout}>Logout</Button>
      <Button onClick={() => router.push('/login')}>Login</Button>
    </Content>
  );
};

export default Index;
