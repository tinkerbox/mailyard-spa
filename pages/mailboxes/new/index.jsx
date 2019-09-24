import React from 'react';
import { PageHeader, Card, Typography } from 'antd';
import { useRouter } from 'next/router';

import Layout from '../../../components/layout';

import AuthWrapper from '../../../components/auth-wrapper';
import AccountSelector from '../../../components/google/account-selector';
import LinkButton from '../../../components/link-button';
import Styled from '../../../components/styled';

const { Text } = Typography;

const AddMailboxScreen = () => {
  const router = useRouter();

  return (
    <AuthWrapper.Authenticated>
      <Layout.FullScreen>
        <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Add New Mailbox" />
        <Card>
          <AccountSelector>
            {({ mailbox, profile }) => (
              <Styled.CardFooter>
                <LinkButton type="primary" size="large" href="/mailboxes/new/config" disabled={!profile || mailbox}>Next</LinkButton>
                {mailbox && <Text type="warning">This mailbox has already been created.</Text>}
              </Styled.CardFooter>
            )}
          </AccountSelector>
        </Card>
      </Layout.FullScreen>
    </AuthWrapper.Authenticated>
  );
};

AddMailboxScreen.whyDidYouRender = true;

export default AddMailboxScreen;
