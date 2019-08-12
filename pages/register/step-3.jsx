import { isEmpty } from 'lodash';
import React, { useCallback } from 'react';

import { Card, Divider, Row, Col, Avatar, Statistic, Typography } from 'antd';
import dynamic from 'next/dynamic';

import { useGoogle } from '../../hooks/google-context';
import { useGoogleQuery } from '../../hooks/google-query';

import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';
import Button from '../../components/Button';

import { makeStyles } from '../../utils/styles';

import custom from '../../styles/pages/register/step-3.css';

const styles = makeStyles(custom);

const { Text } = Typography;

const GoogleLogin = dynamic(
  () => import('../../components/Google').then(mod => mod.default.Login),
  { ssr: false },
);

const Step3 = () => {
  const { profile, api } = useGoogle();

  const query = useCallback(() => api.getProfile(), [api]);
  const [mailbox] = useGoogleQuery(api, query);

  return (
    <Layout.SimpleWide>
      <Card title="Get started in 3 easy steps">

        <Wizard current={2} />

        {!profile && <GoogleLogin render={() => null} />}

        {(!profile || isEmpty(mailbox)) && (
          <div className={styles.loading}>
            <Text>Please wait...</Text>
          </div>
        )}

        {profile && !isEmpty(mailbox) && (
          <Row>
            <Col sm={0} md={4} lg={5} />
            <Col sm={24} md={16} lg={14}>

              <div className={styles.cardRow}>
                <Avatar src={profile.imageUrl} size={48} className={`${styles['mx-2']} ${styles['mx-md-3']} `} />
                <Statistic title={profile.name} value={profile.email} />
              </div>

              <Divider />

              <Row>
                <Col span={12}>
                  <Statistic title="Threads" value={mailbox.threadsTotal} />
                </Col>
                <Col span={12}>
                  <Statistic title="Messages" value={mailbox.messagesTotal} />
                </Col>
              </Row>

              <Divider />

              <div className={styles.cardRow}>
                <Button type="primary" size="large">Start Sync</Button>
              </div>

            </Col>
            <Col xs={0} sm={2} md={4} lg={6} />
          </Row>
        )}

        <Divider />

        <div className={styles.cardFooter}>
          <Button type="primary" size="large" href="/">Done</Button>
        </div>

      </Card>
    </Layout.SimpleWide>
  );
};

Step3.whyDidYouRender = true;

export default Step3;
