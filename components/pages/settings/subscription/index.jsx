import React, { useContext, useEffect, useState } from 'react';
import { Button, Spin, PageHeader, Row, Statistic, Alert } from 'antd';
import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

import config from '../../../../config/runtime';

const SUBSCRIPTION_QUERY = gql`
query {
  subscription {
    status
    plan
    expiresAt
    gracePeriodEndsAt
    accountDeletionAt
    billingToken
  }
}
`;

const Subscription = () => {
  const { client } = useContext(ApolloContext);
  const [subscription, setSubscription] = useState();

  useEffect(() => {
    client.query({
      query: SUBSCRIPTION_QUERY,
    }).then(({ data }) => {
      setSubscription(data.subscription);
    }).catch((err) => {
      console.error(err);
    });
  }, [client]);

  if (!subscription) return <Spin />;

  return (
    <React.Fragment>

      <br />

      {subscription.gracePeriodEndsAt && <Alert message={`Please make payment for your account before ${new Date(subscription.gracePeriodEndsAt).toLocaleDateString()}, or you will lose access to your data.`} type="warning" showIcon />}
      {subscription.accountDeletionAt && <Alert message={`Please make payment for your account before ${new Date(subscription.accountDeletionAt).toLocaleDateString()}, or your account will be deleted.`} type="error" showIcon />}

      <PageHeader>
        <Row type="flex" justify="space-between">

          <Statistic title="Plan" value={subscription.plan} />

          <div>
            <Statistic title="Subscription status" value={subscription.status} />
            {subscription.expiresAt && <small>{`Expires ${new Date(subscription.expiresAt).toLocaleDateString()}`}</small>}
          </div>

          {subscription.expiresAt && <Statistic title="Next payment due on" value={new Date(subscription.expiresAt).toLocaleDateString()} />}

          <div>
            <p>Manage your subscription</p>
            <Button href={`${config.MAILYARD_WEB_URL}/billing/api/auth?token=${subscription.billingToken}`}>Billing Portal</Button>
          </div>

        </Row>
      </PageHeader>

    </React.Fragment>
  );
};

Subscription.whyDidYouRender = true;

export default Subscription;
