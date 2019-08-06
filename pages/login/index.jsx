import React, { useContext } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router'

import { Card, Divider } from 'antd';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';

import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

import Layout from '../../components/Layout';
import format from '../../utils/error-formatter';
import schema from './validations';

const AUTHENTICATE = gql`
  mutation ($username: ID!, $password: String!) {
    authenticate(username: $username, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const router = useRouter();
  const { client } = useContext(ApolloContext);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const result = await client.mutate({
        mutation: AUTHENTICATE,
        variables: values,
      });
      console.log(result.data.authenticate.token);
    } catch (error) {
      setErrors(format(error));
      return;
    } finally {
      setSubmitting(false);
    }
    router.push('/');
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
              <Input.Password name='password' placeholder='Password' size='large' />
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
