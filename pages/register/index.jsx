import React, { useEffect } from 'react';

import { Avatar, Typography, Card, Divider, Row, Col } from 'antd';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { useAuth } from '../../hooks/auth-context';
import { useGoogle } from '../../hooks/google-context';

import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';
import GoogleProfile from '../../components/pages/register/GoogleProfile';
import LinkButton from '../../components/link-button';

import { makeStyles } from '../../styles';

import custom from '../../styles/pages/register/index.css';

const styles = makeStyles(custom);

const { Text } = Typography;

const GoogleLogin = dynamic(
  () => import('../../components/Google').then(mod => mod.default.Login),
  {
    ssr: false,
    loading: () => <Text>Please wait...</Text>,
  },
);

const Register = () => {
  const router = useRouter();
  const { loggedIn } = useAuth();
  const { profile } = useGoogle();

  useEffect(() => {
    if (loggedIn) router.push('/');
  }, [loggedIn, router]);

  return (
    <Layout.SimpleWide>
      <Card title="Get started in 3 easy steps">

        <Wizard current={0} />

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
                <GoogleLogin />
              </div>

            </Col>
            <Col sm={0} md={4} lg={5} />
          </Row>
        )}

        <Divider />

        <div className={styles.cardFooter}>
          <LinkButton type="primary" size="large" href="/register/step-2" disabled={!profile}>Next</LinkButton>
          <LinkButton type="link" href="/login">Already have an account?</LinkButton>
        </div>

      </Card>
    </Layout.SimpleWide>
  );
};

Register.whyDidYouRender = true;

export default Register;
