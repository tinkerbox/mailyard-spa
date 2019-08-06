import React, { useContext } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router'

import { Card, Divider } from 'antd';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

import Layout from '../../components/Layout';
import format from '../../utils/error-formatter';

const schema = Yup.object().shape({
  username: Yup.string()
    .required('Required'),
  password: Yup.string()
    .required('Required'),
  passwordConfirmation: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const REGISTER = gql`
  mutation ($username: ID!, $password: String!, $mailbox: MailboxInput!) {
    register(username: $username, password: $password, mailbox: $mailbox) {
      token
    }
  }
`;

const Register = () => {
  const router = useRouter();
  const { client } = useContext(ApolloContext);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const result = await client.mutate({
        mutation: REGISTER,
        variables: {
          ...values,
          mailbox: {
            providerType: "GMAIL",
            providerId: "66188B8F-C149-4022-AAF6-03B6414F5776",
            name: "John Doe",
            email: "john.doe@example.net",
            labels: {
              providerId: "5C94AC0F-427E-4A86-8B00-BA6968B71659",
              name: "All",
              type: "app",
            }
          }
        },
      });
      console.log(result.data.register.token);
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
      <Card title='Register'>

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
