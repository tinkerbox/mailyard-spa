import React from 'react';
import { PageHeader, Card, Typography } from 'antd';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';

import AccountSelector from '../../../components/google/account-selector';
import LinkButton from '../../../components/link-button';
import styles from '../../../styles';

const { Text } = Typography;

const AddMailboxScreen = () => {
  const router = useRouter();

  return (
    <Layout.FullScreen>
      <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Add New Mailbox" />
      <Card>
        <AccountSelector>
          {({ disabled, mailbox }) => (
            <div className={styles.cardFooter}>
              <LinkButton type="primary" size="large" href="/mailboxes/new/config" disabled={disabled}>Next</LinkButton>
              {mailbox && <Text type="warning">This mailbox has already been created.</Text>}
            </div>
          )}
        </AccountSelector>
      </Card>
    </Layout.FullScreen>
  );
};

AddMailboxScreen.whyDidYouRender = true;

export default AddMailboxScreen;
