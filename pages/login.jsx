import React, { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { message, Card, Divider } from 'antd';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '../hooks/auth-context';
import Layout from '../components/Layout';
import format from '../lib/error-formatter';

const schema = Yup.object().shape({
  username: Yup.string()
    .required('Required'),
  password: Yup.string()
    .required('Required'),
});

const Login = () => {
  const router = useRouter();
  const { login, loading, account } = useAuth();

  useEffect(() => {
    if (!loading && account) router.push('/');
  }, [router, account, loading]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    await login(values, {
      success: () => {
        router.push('/');
        message.success('Logged in successfully');
      },
      failure: (error) => {
        setErrors(format(error));
        setSubmitting(false);
        message.error('Could not log you in');
      },
    });
  };

  return (
    <Layout.Simple>
      <Card title="Login">

        <Formik onSubmit={handleSubmit} validationSchema={schema}>
          <Form layout="vertical">

            <Form.Item name="username" label="Username">
              <Input name="username" placeholder="Username" size="large" />
            </Form.Item>

            <Form.Item name="password" label="Password">
              <Input.Password name="password" placeholder="Password" size="large" />
            </Form.Item>

            <SubmitButton type="primary" htmlType="submit" size="large">Login</SubmitButton>

          </Form>
        </Formik>

        <Divider />

        <Link href="/register"><a>Don't have an account?</a></Link>

      </Card>
    </Layout.Simple>
  );
};

Login.whyDidYouRender = true;

export default Login;
