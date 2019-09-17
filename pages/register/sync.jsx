import React from 'react';
import { Card } from 'antd';

import { useAuth } from '../../hooks/auth-context';
import LinkButton from '../../components/link-button';
import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/wizard';
import styles from '../../styles';
import MailboxSync from '../../components/mailbox-sync';

const SyncScreen = () => {
  const { account } = useAuth();
  const mailboxId = account ? account.defaultMailboxId : null;

  return (
    <Layout.SimpleWide>
      <Card title="Get started in 3 easy steps">

        <Wizard current={2} />

        {mailboxId && (
          <MailboxSync mailboxId={mailboxId}>
            {({ status }) => (
              <div className={styles.cardFooter}>
                <LinkButton type="primary" size="large" href="/" disabled={status !== 'finished'}>Done</LinkButton>
              </div>
            )}
          </MailboxSync>
        )}

      </Card>
    </Layout.SimpleWide>
  );
};

SyncScreen.whyDidYouRender = true;

export default SyncScreen;
