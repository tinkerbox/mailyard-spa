import React from 'react';
import { PageHeader, Card } from 'antd';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';
import AddMailboxComponent from '../../../components/pages/mailboxes/new';

const AddMailboxScreen = () => {
  const router = useRouter();

  return (
    <Layout.FullScreen>

      <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Add New Mailbox" />

      <Card>
        <AddMailboxComponent />
      </Card>

    </Layout.FullScreen>
  );
};

AddMailboxScreen.whyDidYouRender = true;

export default AddMailboxScreen;
