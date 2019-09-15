import React from 'react';
import { Card, Divider, Row, Col, PageHeader, Typography } from 'antd';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';

const ConnectGoogle = () => {
  const router = useRouter();
  return (
    <Layout.FullScreen>

      <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Sync Mailbox" />

      <Card>
        <p>Connect Google</p>
      </Card>

    </Layout.FullScreen>
  );
};

export default ConnectGoogle;
