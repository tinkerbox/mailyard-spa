import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router'

import { Card, Divider } from 'antd';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';

import Layout from '../../components/Layout';
import schema from './validations';

const Register = () => {
  const router = useRouter();

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    console.log(values);
    setTimeout(() => {
      setSubmitting(false);
      router.push('/');
    }, 1000)
  };

  return (
    <Layout.Simple>
      <Card title='Register'>

        <Formik onSubmit={handleSubmit} validationSchema={schema}>
          <Form layout='vertical'>

            <Form.Item name='username' label='Username'>
              <Input name='username' placeholder='Username' size='large' />
            </Form.Item>
            <Form.Item name='password' label='Password'>
              <Input name='password' placeholder='Password' size='large' />
            </Form.Item>
            <Form.Item name='passwordConfirmation' label='Confirm password'>
              <Input name='passwordConfirmation' placeholder='Confirm password' size='large' />
            </Form.Item>

            <SubmitButton type='primary' htmlType='submit' size='large'>Register</SubmitButton>

          </Form>
        </Formik>

        <Divider />

        <Link href='/login'><a>Already have an account?</a></Link>

      </Card>
    </Layout.Simple>
  );
};

export default Register;
