import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { message, Collapse, Row, Col, Typography, Alert, Button, Checkbox, Divider } from 'antd';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

import { useAuth } from '../../../../hooks/auth-context';
import styles from '../../../../styles';
import format from '../../../../lib/error-formatter';

const { Panel } = Collapse;
const { Paragraph } = Typography;

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ($existingPassword: String!, $newPassword: String!) {
    changePassword(existingPassword: $existingPassword, newPassword: $newPassword) {
      token
    }
  }
`;

const DELETE_ACCOUNT_MUTATION = gql`
  mutation {
    removeAccount {
      id
    }
  }
`;

const schema = Yup.object().shape({
  existingPassword: Yup.string()
    .required('Required'),
  newPassword: Yup.string()
    .required('Required'),
  confirmPassword: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    md: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    md: { span: 16 },
  },
};

const ChangePasswordForm = () => {
  const { client } = useContext(ApolloContext);

  const handleChangePassword = async (values, { setSubmitting, setErrors }) => {
    const { existingPassword, newPassword } = values;

    client.mutate({
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: { existingPassword, newPassword },
    })
      .then(() => {
        setSubmitting(false);
        message.success('Your password has been changed.');
        // TODO: clean up the form, or close the accordion
      })
      .catch((error) => {
        setSubmitting(false);
        setErrors(format(error));
        message.error('Could not change your password.');
      });
  };

  return (
    <Row>
      <Col md={12}>
        <Formik onSubmit={handleChangePassword} validationSchema={schema}>
          <Form layout="horizontal" {...formItemLayout}>

            <Form.Item name="existingPassword" label="Current password">
              <Input.Password name="existingPassword" />
            </Form.Item>

            <Form.Item name="newPassword" label="New password">
              <Input.Password name="newPassword" />
            </Form.Item>

            <Form.Item name="confirmPassword" label="Confirm new password">
              <Input.Password name="confirmPassword" />
            </Form.Item>

            <Divider dashed />

            <SubmitButton type="primary" htmlType="submit">Change Password</SubmitButton>

          </Form>
        </Formik>
      </Col>
    </Row>
  );
};

const DeleteAccountForm = () => {
  const [agree, setAgree] = useState(false);
  const { client } = useContext(ApolloContext);
  const { logout } = useAuth();
  const router = useRouter();

  const handleDeleteAccount = () => {
    client.mutate({ mutation: DELETE_ACCOUNT_MUTATION })
      .then(() => {
        message.success('Your account will be deleted shortly.');
        logout();
        router.push('/login');
      })
      .catch(() => {
        message.error('Could not delete your account.');
      });
  };

  return (
    <React.Fragment>
      <Alert message="This action cannot be undone. This will permanently delete all your mailboxes, labels, threads and messages." type="warning" />
      <div className={styles.use('m-3')}>
        <Checkbox checked={agree} onClick={() => setAgree(true)}>I fully understand the consequences of deleting my account</Checkbox>
      </div>
      <Divider dashed />
      <Button type="danger" onClick={handleDeleteAccount} disabled={!agree}>Delete Account</Button>
    </React.Fragment>
  );
};

const Account = () => {
  return (
    <React.Fragment>

      <Collapse bordered={false} accordion>

        <Panel header="Change your password" className={styles.use('mt-4')}>
          <ChangePasswordForm />
        </Panel>

        <Panel header="Manage your notifications" className={styles.use('mt-4')}>
          <Paragraph>Lorem ipsum</Paragraph>
        </Panel>

        <Panel header="Delete your account" className={styles.use('mt-4')}>
          <DeleteAccountForm />
        </Panel>

      </Collapse>

      {/* <Divider dashed />

      <Row className={styles.use('mt-4')} gutter={48}>
        <Col span={8}>
          <Title level={4}>Your privacy matters</Title>
          <Paragraph>Mailyard goes to great lengths to ensure your privacy. All your data is encrypted in the browser before it is sent to our servers for storage. As an email backup service, we do not even know your email address as we rely on browser notifications for communication, nor do we collect emails during payment.</Paragraph>
          <Button type="link" href="#">Read more</Button>
        </Col>
        <Col span={8}>
          <Title level={4}>Security in depth</Title>
          <Paragraph>
            Mailyard secures your data using encryption keys&nbsp;(
            <abbr title="Data Encryption Key">DEK</abbr>
            &nbsp;and&nbsp;
            <abbr title="Key Encryption Key">KEK</abbr>
            )&nbsp;that we store on our servers, but are unlocked only within the client using your chosen passphrase. With the Lanyard browser extension, you can store your keys securely without entrusting them to our servers.
          </Paragraph>
          <Button type="link" href="#">Read more</Button>
        </Col>
        <Col span={8}>
          <Title level={4}>Your data is safe with us</Title>
          <Paragraph>
            Your emails are stored across multiple availability zones on Amazon S3 to avoid data loss, but still adhere to regulatory requirements such as&nbsp;
            <abbr title="General Data Protection Regulation">GDPR</abbr>
            . You can request for your all data at any time, and account deletion requests will be honored to the fullest extent possible.
          </Paragraph>
          <Button type="link" href="#">Read more</Button>
        </Col>
      </Row> */}

    </React.Fragment>
  );
};

Account.whyDidYouRender = true;

export default Account;
