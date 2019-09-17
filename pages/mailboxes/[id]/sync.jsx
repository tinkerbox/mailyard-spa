import React from 'react';
import { PageHeader, Card } from 'antd';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';
import LinkButton from '../../../components/link-button';
import MailboxSync from '../../../components/mailbox-sync';

import styles from '../../../styles';

const SyncMailboxScreen = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
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
  );
};

SyncMailboxScreen.whyDidYouRender = true;

export default SyncMailboxScreen;
