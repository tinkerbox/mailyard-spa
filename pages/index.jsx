import React from 'react';

import Link from 'next/link';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { Layout } from 'antd';

const { Content } = Layout;

const HELLO = gql`
  {
    hello
  }
`;

const Index = () => {
  return (
    <Content>
      <Query query={HELLO}>
        {({ loading, error, data}) => {
          if (loading) return "Loading...";
          if (error) return `Error: ${error.message}`;
          return <p>{data.hello}</p>;
        }}
      </Query>
      <Link href='/login'><a>Login</a></Link>
    </Content>
  );
};

export default Index;
