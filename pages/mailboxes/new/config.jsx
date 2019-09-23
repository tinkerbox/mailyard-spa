import React from 'react';
import { PageHeader, Card } from 'antd';
import { useRouter } from 'next/router';
import { SubmitButton } from '@jbuschke/formik-antd';

import AuthWrapper from '../../../components/auth-wrapper';
import styles from '../../../styles';
import Layout from '../../../components/Layout';
import LinkButton from '../../../components/link-button';
import ConfigureMailboxComponent from '../../../components/pages/mailboxes/new/config';

const ConfigureMailboxScreen = () => {
  const router = useRouter();

  return (
    <AuthWrapper.Authenticated>
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
    </AuthWrapper.Authenticated>
  );
};

ConfigureMailboxScreen.whyDidYouRender = true;

export default ConfigureMailboxScreen;
