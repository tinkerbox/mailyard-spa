import React, { useEffect } from 'react';

import { Card, Divider, Empty } from 'antd';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { useAuth } from '../../hooks/auth-context';
import { useGoogle } from '../../hooks/google-context';

import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';
import Button from '../../components/Button';

import styles from '../../utils/styles';

const GoogleLogin = dynamic(
  () => import('../../components/Google').then(mod => mod.default.Login),
  { ssr: false },
);

const Step3 = () => {
  const router = useRouter();
  const { loggedIn } = useAuth();
  const { profile, ready } = useGoogle();

  useEffect(() => {
    if (!ready) return;
    if (!profile) {
      router.push('/register');
    } else if (!loggedIn) {
      router.push('/register/step-2');
    } // TODO: else if already onboarded, redirect to /
  }, [profile, loggedIn, ready, router]);

  return (
    <Layout.SimpleWide>
      <Card title="Get started in 3 easy steps">

        <Wizard current={2} />

        <Empty description="Coming soon" />

        {!profile && <GoogleLogin render={() => null} />}

        <Divider />

        <div className={styles.cardFooter}>
          <Button type="primary" size="large" href="/">Done</Button>
        </div>

      </Card>
    </Layout.SimpleWide>
  );
};

export default Step3;
