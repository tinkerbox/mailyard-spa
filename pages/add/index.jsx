import { find } from 'lodash';
import React from 'react';
import { useRouter } from 'next/router';
import { Avatar, Typography, Card, Divider, Row, Col, PageHeader } from 'antd';

import { useGoogle } from '../../hooks/google-context';
import Layout from '../../components/Layout';
import GoogleProfile from '../../components/pages/register/GoogleProfile';
import LinkButton from '../../components/link-button';
import { makeStyles } from '../../styles';
import custom from '../../styles/pages/register/index.css';
import Google from '../../components/google';
import { useAuth } from '../../hooks/auth-context';

const styles = makeStyles(custom);

const { Text } = Typography;

const AddMailboxScreen = () => {
  const router = useRouter();
  const { account } = useAuth();
  const { profile } = useGoogle();

  const existingMailbox = (account && profile) ? find(account.mailboxes, { email: profile.email }) : false;
  const canContinue = !!profile && !existingMailbox;

  return (
    <Layout.FullScreen>

      <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Add New Mailbox" />

      <Card>

        {profile && <GoogleProfile profile={profile} />}

        {!profile && (
          <Row>
            <Col sm={0} md={4} lg={5} />
            <Col sm={24} md={16} lg={14}>

              <div className={styles.cardRow}>
                <Avatar icon="user" className={`${styles['mx-2']} ${styles['mx-md-3']} `} />
                <Text>Connect to the Google account you with to back up</Text>
              </div>

              <Divider />

              <div className={styles.loading}>
                <Google.Login />
              </div>

            </Col>
            <Col sm={0} md={4} lg={5} />
          </Row>
        )}

        <Divider />

        <div className={styles.cardFooter}>
          <LinkButton type="primary" size="large" href="/add/sync" disabled={!canContinue}>Next</LinkButton>
          {profile && existingMailbox && <Text type="warning">This mailbox has already been created.</Text>}
        </div>

      </Card>
    </Layout.FullScreen>
  );
};

AddMailboxScreen.whyDidYouRender = true;

export default AddMailboxScreen;
