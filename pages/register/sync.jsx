import React from 'react';
import { Card } from 'antd';

import AuthWrapper from '../../components/auth-wrapper';
import LinkButton from '../../components/link-button';
import Layout from '../../components/layout';
import Wizard from '../../components/pages/register/wizard';
import styles from '../../styles';
import MailboxSync from '../../components/mailbox-sync';

const SyncScreen = () => {
  return (
    <AuthWrapper.Authenticated>
      {account => (
        <Layout.SimpleWide>
          <Card title="Get started in 3 easy steps">

            <Wizard current={2} />

            <MailboxSync mailboxId={account.defaultMailbox.id}>
              {({ status }) => (
                <div className={styles.cardFooter}>
                  <LinkButton type="primary" size="large" href="/" disabled={status !== 'finished'}>Done</LinkButton>
                </div>
              )}
            </MailboxSync>

          </Card>
        </Layout.SimpleWide>
      )}
    </AuthWrapper.Authenticated>
  );
};

SyncScreen.whyDidYouRender = true;

export default SyncScreen;
