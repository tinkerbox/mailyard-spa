import React from 'react';

import Link from 'next/link';

import { Card, Form, Input, Button, Divider } from 'antd';

import Layout from '../../components/Layout';

const Register = () => {
  const handleSubmit = (e) => {
    console.log('registering account...');
    e.preventDefault();
  };

  return (
    <Layout.Simple>
      <Card title='Register'>

        <Form layout='vertical' onSubmit={handleSubmit}>

          <Form.Item label='Username'>
            <Input size='large' placeholder='Username' />
          </Form.Item>
          <Form.Item label='Password'>
            <Input size='large' placeholder='Password' />
          </Form.Item>
          <Form.Item label='Confirm password'>
            <Input size='large' placeholder='Confirm password' />
          </Form.Item>

          <Button type='primary' htmlType='submit' size='large'>Register</Button>

        </Form>

        <Divider />

        <Link href='/login'><a>Already have an account?</a></Link>

      </Card>
    </Layout.Simple>
  );
};

export default Register;
