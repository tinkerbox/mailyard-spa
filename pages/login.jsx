import React, { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router'

import { Card, Divider } from 'antd';
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
  const { loggedIn, login } = useAuth();

  useEffect(() => {
    if (loggedIn) router.push('/');
  }, [router, loggedIn]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    await login(values, {
      success: () => { router.push('/'); },
      failure: (error) => {
        setErrors(format(error));
        setSubmitting(false);
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

export default Login;
