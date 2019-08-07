import React from 'react';

import { useRouter } from 'next/router'

import { Card, Divider, Button, Empty } from 'antd';

import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';

const Step3 = () => {
  const router = useRouter();

  return (
    <Layout.SimpleWide>
      <Card title='Get started in 3 easy steps'>

        <Wizard current={2} />

        <Empty description='Coming soon' />

        <Divider />

        <Button type='primary' size='large' onClick={() => router.push('/')}>Done</Button>

      </Card>
    </Layout.SimpleWide>
  );
};

export default Step3;
