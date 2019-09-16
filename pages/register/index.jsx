import React, { useEffect } from 'react';
import { Card } from 'antd';
import { useRouter } from 'next/router';

import { useAuth } from '../../hooks/auth-context';
import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';

import RegistrationComponent from '../../components/pages/register';

const RegistrationScreen = () => {
  const router = useRouter();
  const { loggedIn } = useAuth();

  useEffect(() => {
    if (loggedIn) router.push('/');
  }, [loggedIn, router]);

  return (
    <Layout.SimpleWide>
      <Card title="Get started in 3 easy steps">
        <Wizard current={0} />
        <RegistrationComponent />
      </Card>
    </Layout.SimpleWide>
  );
};

RegistrationScreen.whyDidYouRender = true;

export default RegistrationScreen;
