import React, { useEffect } from 'react';

import { useRouter } from 'next/router'

import { Card, Divider, Button, Empty } from 'antd';

import { useAuth } from '../../hooks/auth-context';
import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';

const Register = () => {
  const router = useRouter();
  const { loggedIn } = useAuth();

  useEffect(() => {
    if (loggedIn) router.push('/');
  }, [loggedIn]);

  return (
    <Layout.SimpleWide>
      <Card title='Get started in 3 easy steps'>

        <Wizard current={0} />

        <Empty description='Coming soon' />

        <Divider />

        <Button type='link' onClick={() => router.push('/login')}><a>Already have an account?</a></Button>
        <Button type='primary' size='large' onClick={() => router.push('/register/step-2')}>Next</Button>

      </Card>
    </Layout.SimpleWide>
  );
};

export default Register;
