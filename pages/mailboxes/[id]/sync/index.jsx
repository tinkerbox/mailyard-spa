import React from 'react';
import { PageHeader, Card } from 'antd';
import { useRouter } from 'next/router';

import Layout from '../../../../components/Layout';

const SyncMailboxScreen = () => {
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

SyncMailboxScreen.whyDidYouRender = true;

export default SyncMailboxScreen;
