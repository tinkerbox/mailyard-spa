import React from 'react';
import { PageHeader, Card } from 'antd';
import { useRouter } from 'next/router';

import AuthWrapper from '../../../components/auth-wrapper';
import Layout from '../../../components/layout';
import LinkButton from '../../../components/link-button';
import MailboxSync from '../../../components/mailbox-sync';

import styles from '../../../styles';

const SyncMailboxScreen = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <AuthWrapper.Authenticated>
      <Layout.FullScreen>

        <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Sync Mailbox" />

        <Card>
          {id && (
            <MailboxSync mailboxId={id}>
              {({ status }) => (
                <div className={styles.cardFooter}>
                  <LinkButton type="primary" size="large" href="/settings#mailboxes" disabled={status !== 'finished'}>Done</LinkButton>
                </div>
              )}
            </MailboxSync>
          )}
        </Card>

      </Layout.FullScreen>
    </AuthWrapper.Authenticated>
  );
};

SyncMailboxScreen.whyDidYouRender = true;

export default SyncMailboxScreen;
