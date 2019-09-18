/* global window */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { Divider, Row, Col, Avatar, Statistic } from 'antd';

import { useGoogle } from '../../hooks/google-context';
import { useGoogleQuery } from '../../hooks/google-query';
import Google from '../google/auth-buttons';
import SyncProgress from './progress';

import styles from '../../styles';

const MailboxSync = ({ mailboxId, children }) => {
  const [status, setStatus] = useState('pending');
  const { profile } = useGoogle();
  const [mailbox] = useGoogleQuery('getProfile');

  useEffect(() => {
    if (status === 'running') window.onbeforeunload = () => 'Are you sure you want to stop the sync?';
    return () => { window.onbeforeunload = null; };
  }, [status]);

  return (
    <React.Fragment>

      <Google.Login render={() => null} loading={() => null} />

      {profile && (
        <Row>
          <Col sm={0} md={4} lg={5} />
          <Col sm={24} md={16} lg={14}>

            <div className={styles.cardRow}>
              <Avatar src={profile.imageUrl} size={48} className={`${styles['mx-2']} ${styles['mx-md-3']} `} />
              <Statistic title={profile.name} value={profile.email} />
            </div>

            <Divider />

            {mailbox && (
              <React.Fragment>
                <Row>
                  <Col span={12}>
                    <Statistic title="Threads" value={mailbox.threadsTotal} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Messages" value={mailbox.messagesTotal} />
                  </Col>
                </Row>

                <Divider />

                <SyncProgress
                  mailboxId={mailboxId}
                  messagesTotal={mailbox.messagesTotal}
                  updateStatus={setStatus}
                />
              </React.Fragment>
            )}

          </Col>
          <Col xs={0} sm={2} md={4} lg={6} />
        </Row>
      )}

      <Divider />

      {children({ status })}

    </React.Fragment>
  );
};

MailboxSync.propTypes = {
  mailboxId: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
};

MailboxSync.whyDidYouRender = true;

export default dynamic(() => Promise.resolve(MailboxSync), { ssr: false });
