import React, { useContext, useEffect, useState } from 'react';
import { Button, Spin } from 'antd';
import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

import config from '../../../../config/runtime';

const BILLING_TOKEN_MUTATATION = gql`
  mutation {
  billingToken{
    token
  }
}
`;

const Subscription = () => {
  const { client } = useContext(ApolloContext);
  const [token, setToken] = useState();

  useEffect(() => {
    client.mutate({
      mutation: BILLING_TOKEN_MUTATATION,
    }).then(({ data }) => {
      setToken(data.billingToken.token);
    }).catch((err) => {
      console.error(err);
    });
  }, [client]);

  return (
    <React.Fragment>
      <br />
      <p>Show subscription status here.</p>
      {token && <Button href={`${config.MAILYARD_WEB_URL}/billing/api/auth?token=${token}`}>Billing Portal</Button>}
      {!token && <Spin />}
    </React.Fragment>
  );
};

Subscription.whyDidYouRender = true;

export default Subscription;
