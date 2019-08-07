import React, { useContext } from 'react';

import { useRouter } from 'next/router'

import { Card, Divider, Button } from 'antd';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';
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

const Step2 = () => {
  const router = useRouter();
  const { client } = useContext(ApolloContext);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const result = await client.mutate({
        mutation: REGISTER,
        variables: {
          ...values,
          mailbox: {
            name: "John Doe",
            email: "john.doe@example.net",
          },
        },
      });
      console.log(result.data.register.token);
    } catch (error) {
      setErrors(format(error));
      return;
    } finally {
      setSubmitting(false);
    }
    router.push('/register/step-3');
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

            <Button size='large' type='link' onClick={() => router.push('/register')}>Back</Button>

            <SubmitButton size='large' type='primary' htmlType='submit'>Next</SubmitButton>

          </Form>
        </Formik>

      </Card>
    </Layout.SimpleWide>
  );
};

export default Step2;
