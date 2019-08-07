import React, { useEffect } from 'react';

import { useRouter } from 'next/router'

import { Card, Divider } from 'antd';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth-context';
import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';
import format from '../../utils/error-formatter';
import Button from '../../components/Button';

const schema = Yup.object().shape({
  username: Yup.string()
    .required('Required'),
  password: Yup.string()
    .required('Required'),
  passwordConfirmation: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const Step2 = () => {
  const router = useRouter();
  const { loggedIn, register } = useAuth();

  useEffect(() => {
    if (loggedIn) router.push('/');
  }, [loggedIn]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const params = {
      ...values,
      mailbox: {
        name: "John Doe",
        email: "john.doe@example.net",
      },
    };
    await register(params, {
      success: () => { router.push('/register/step-3') },
      failure: (error) => {
        setErrors(format(error));
        setSubmitting(false);
      },
    });
  };

  return (
    <Layout.SimpleWide>
      <Card title='Get started in 3 easy steps'>

        <Wizard current={1} />

        <Formik onSubmit={handleSubmit} validationSchema={schema}>
          <Form layout='vertical'>

            <Form.Item name='username' label='Username'>
              <Input name='username' placeholder='Username' size='large' />
            </Form.Item>
            <Form.Item name='password' label='Password'>
              <Input.Password name='password' placeholder='Password' size='large' />
            </Form.Item>
            <Form.Item name='passwordConfirmation' label='Confirm password'>
              <Input.Password name='passwordConfirmation' placeholder='Confirm password' size='large' />
            </Form.Item>

            <Divider />

            <Button type='link' href='/register'>Back</Button>
            <SubmitButton size='large' type='primary' htmlType='submit'>Next</SubmitButton>

          </Form>
        </Formik>

      </Card>
    </Layout.SimpleWide>
  );
};

export default Step2;
