import { find } from 'lodash';
import React from 'react';
import { PageHeader, Card, Typography } from 'antd';
import { useRouter } from 'next/router';

import { useAuth } from '../../../hooks/auth-context';
import AuthWrapper from '../../../components/auth-wrapper';
import Layout from '../../../components/Layout';
import LinkButton from '../../../components/link-button';
import AccountSelector from '../../../components/google/account-selector';
import styles from '../../../styles';

const { Text } = Typography;

const GoogleSyncMailboxScreen = () => {
  const router = useRouter();
  const { id } = router.query;
  const { account } = useAuth();

  const target = account ? find(account.mailboxes, { id }) : null;

  return (
    <AuthWrapper.Authenticated>
      <Layout.FullScreen>

        <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Login to Google" />

        <Card>
          {target && (
            <AccountSelector hint={target.email}>
              {({ mailbox }) => (
                <div className={styles.cardFooter}>
                  <LinkButton type="primary" size="large" href={`/mailboxes/${id}/sync`} disabled={!mailbox || mailbox.email !== target.email}>Next</LinkButton>
                  {(!mailbox && target) && <Text type="warning">{`You need to be logged in to ${target.email} to continue`}</Text>}
                  {(mailbox && target.email !== mailbox.email) && <Text type="warning">{`You need to be logged in to ${target.email} to continue`}</Text>}
                </div>
              )}
            </AccountSelector>
          )}
        </Card>

      </Layout.FullScreen>
    </AuthWrapper.Authenticated>
  );
};

GoogleSyncMailboxScreen.whyDidYouRender = true;

export default GoogleSyncMailboxScreen;
