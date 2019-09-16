import React from 'react';
import { PageHeader, Card } from 'antd';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';
import ConfigureMailboxComponent from '../../../components/pages/mailboxes/new/config';

const ConfigureMailboxScreen = () => {
  const router = useRouter();

  return (
    <Layout.FullScreen>

      <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Configure Mailbox" />

      <Card>
        <ConfigureMailboxComponent />
      </Card>

    </Layout.FullScreen>
  );
};

ConfigureMailboxScreen.whyDidYouRender = true;

export default ConfigureMailboxScreen;
