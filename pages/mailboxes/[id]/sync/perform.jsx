import React from 'react';
import { PageHeader, Card } from 'antd';
import { useRouter } from 'next/router';

import Layout from '../../../../components/Layout';

const PerformSyncMailboxScreen = () => {
  const router = useRouter();

  return (
    <Layout.FullScreen>

      <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Sync Mailbox" />

      <Card>
        <p>Content goes here</p>
      </Card>

    </Layout.FullScreen>
  );
};

PerformSyncMailboxScreen.whyDidYouRender = true;

export default PerformSyncMailboxScreen;
