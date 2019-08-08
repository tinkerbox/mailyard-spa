import React, { useEffect } from 'react';

import { Card, Divider, Empty } from 'antd';
import { useRouter } from 'next/router';

import { useAuth } from '../../hooks/auth-context';
import { useGoogle } from '../../hooks/google-context';

import Google from '../../components/Google';
import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';
import GoogleProfile from '../../components/pages/register/GoogleProfile';
import Button from '../../components/Button';

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
  }, [loggedIn, ready]);

  return (
    <Layout.SimpleWide>
      <Card title='Get started in 3 easy steps'>

        <Wizard current={2} />

        <Empty description='Coming soon' />

        {/* {profile && <GoogleProfile profile={profile} />} */}
        {!profile && <Google.Login render={() => null} />}

        <Divider />

        <Button type='primary' size='large' href='/'>Done</Button>

      </Card>
    </Layout.SimpleWide>
  );
};

export default Step3;
