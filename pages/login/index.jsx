import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router'

import { Card, Divider } from 'antd';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';

import Layout from '../../components/Layout';
import schema from './validations';

const Login = () => {
  const router = useRouter();

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    setTimeout(() => {
      setSubmitting(false);
      router.push('/');
    }, 1000)
  };

  return (
    <Layout.Simple>
      <Card title='Login'>

        <Formik onSubmit={handleSubmit} validationSchema={schema}>
          <Form layout='vertical'>

            <Form.Item name='username' label='Username'>
              <Input name='username' placeholder='Username' size='large' />
            </Form.Item>

            <Form.Item name='password' label='Password'>
              <Input name='password' placeholder='Password' size='large' />
            </Form.Item>

            <SubmitButton type='primary' htmlType='submit' size='large'>Login</SubmitButton>

          </Form>
        </Formik>

        <Divider />

        <Link href='/register'><a>Don't have an account?</a></Link>

      </Card>
    </Layout.Simple>
  );
};

export default Login;
