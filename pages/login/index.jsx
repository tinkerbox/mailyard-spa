import React from 'react';

import Link from 'next/link';

import { Card, Form, Input, Button, Divider } from 'antd';

import Layout from '../../components/Layout';

const Login = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('logging in...');
  };

  return (
    <Layout.Simple>
      <Card title='Login'>

        <Form layout='vertical' onSubmit={handleSubmit}>

          <Form.Item label='Username'>
            <Input size='large' placeholder='Username' />
          </Form.Item>
          <Form.Item label='Password'>
            <Input size='large' placeholder='Password' />
          </Form.Item>

          <Button type='primary' htmlType='submit' size='large'>Login</Button>

        </Form>

        <Divider />

        <Link href='/register'><a>Don't have an account?</a></Link>

      </Card>
    </Layout.Simple>
  );
};

export default Login;
