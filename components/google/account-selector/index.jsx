import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { Typography, Divider, Row, Col, Avatar } from 'antd';

import { useAuth } from '../../../hooks/auth-context';
import { useGoogle } from '../../../hooks/google-context';
import { makeStyles } from '../../../styles';
import Google from '../auth-buttons';
import GoogleProfile from '../profile';
import custom from './styles.css';

const styles = makeStyles(custom);
const { Text } = Typography;

const AccountSelector = ({ children, hint }) => {
  const { account } = useAuth();
  const { profile } = useGoogle();

  const mailbox = (account && profile) ? find(account.mailboxes, { email: profile.email }) : false;

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
              <Google.Login loginHint={hint} />
            </div>

          </Col>
          <Col sm={0} md={4} lg={5} />
        </Row>
      )}

      <Divider />

      {children({ mailbox, profile })}

    </React.Fragment>
  );
};

AccountSelector.propTypes = {
  children: PropTypes.func.isRequired,
  hint: PropTypes.string,
};

AccountSelector.defaultProps = {
  hint: null,
};

AccountSelector.whyDidYouRender = true;

export default AccountSelector;
