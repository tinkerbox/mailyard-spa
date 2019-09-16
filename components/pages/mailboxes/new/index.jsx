import { find } from 'lodash';
import React from 'react';
import { Typography, Divider, Row, Col, Avatar } from 'antd';

import { useAuth } from '../../../../hooks/auth-context';
import { useGoogle } from '../../../../hooks/google-context';
import { makeStyles } from '../../../../styles';
import LinkButton from '../../../link-button';
import Google from '../../../google';
import GoogleProfile from '../../register/GoogleProfile'; // TODO: make component reusable, or duplicate it
import custom from '../../../../styles/pages/register/index.css';

const styles = makeStyles(custom);
const { Text } = Typography;

const AddMailboxComponent = () => {
  const { account } = useAuth();
  const { profile } = useGoogle();

  const existingMailbox = (account && profile) ? find(account.mailboxes, { email: profile.email }) : false;
  const canContinue = profile && !existingMailbox;

  return (
    <React.Fragment>

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
        <LinkButton type="primary" size="large" href="/mailboxes/new/config" disabled={!canContinue}>Next</LinkButton>
        {profile && existingMailbox && <Text type="warning">This mailbox has already been created.</Text>}
      </div>

    </React.Fragment>
  );
};

AddMailboxComponent.whyDidYouRender = true;

export default AddMailboxComponent;
