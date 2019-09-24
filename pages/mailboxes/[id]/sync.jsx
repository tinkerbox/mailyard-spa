import React from 'react';
import { PageHeader, Card } from 'antd';
import { useRouter } from 'next/router';

import AuthWrapper from '../../../components/auth-wrapper';
import Layout from '../../../components/layout';
import LinkButton from '../../../components/link-button';
import MailboxSync from '../../../components/mailbox-sync';
import Styled from '../../../components/styled';

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
                <Styled.CardFooter>
                  <LinkButton type="primary" size="large" href="/settings#mailboxes" disabled={status !== 'finished'}>Done</LinkButton>
                </Styled.CardFooter>
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
