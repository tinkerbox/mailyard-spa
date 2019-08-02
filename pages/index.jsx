import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const HELLO = gql`
  {
    hello
  }
`;

const Index = () => {
  return (
    <div>
      <Query query={HELLO}>
        {({ loading, error, data}) => {
          if (loading) return "Loading...";
          if (error) return `Error: ${error.message}`;
          return <p>{data.hello}</p>;
        }}
      </Query>
    </div>
  );
};

export default Index;
