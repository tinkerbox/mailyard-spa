import React from 'react';
import { PageHeader, Card } from 'antd';
import { useRouter } from 'next/router';
import { SubmitButton } from '@jbuschke/formik-antd';

import styles from '../../../styles';
import Layout from '../../../components/Layout';
import LinkButton from '../../../components/link-button';
import ConfigureMailboxComponent from '../../../components/pages/mailboxes/new/config';

const ConfigureMailboxScreen = () => {
  const router = useRouter();

  return (
    <Layout.FullScreen>
      <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Configure Mailbox" />
      <Card>
        <ConfigureMailboxComponent>
          <div className={styles.cardFooter}>
            <SubmitButton size="large" type="primary" htmlType="submit">Next</SubmitButton>
            <LinkButton type="link" href="/mailboxes/new">Back</LinkButton>
          </div>
        </ConfigureMailboxComponent>
      </Card>
    </Layout.FullScreen>
  );
};

ConfigureMailboxScreen.whyDidYouRender = true;

export default ConfigureMailboxScreen;
