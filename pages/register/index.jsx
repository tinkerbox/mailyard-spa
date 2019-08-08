import React, { useEffect } from 'react';

import { Card, Divider } from 'antd';
import { useRouter } from 'next/router';

import { useAuth } from '../../hooks/auth-context';
import { useGoogle } from '../../hooks/google-context';

import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';
import GoogleProfile from '../../components/pages/register/GoogleProfile';
import Button from '../../components/Button';
import Google from '../../components/Google';

const Register = () => {
  const router = useRouter();
  const { loggedIn } = useAuth();
  const { profile } = useGoogle();

  useEffect(() => {
    if (loggedIn) router.push('/');
  }, [loggedIn]);

  return (
    <Layout.SimpleWide>
      <Card title='Get started in 3 easy steps'>

        <Wizard current={0} />

        {profile && <GoogleProfile profile={profile} />}
        {!profile && <Google.Login />}

        <Divider />

        <Button type='link' href='/login'><a>Already have an account?</a></Button>
        <Button type='primary' size='large' href='/register/step-2' disabled={!profile}>Next</Button>

      </Card>
    </Layout.SimpleWide>
  );
};

export default Register;
