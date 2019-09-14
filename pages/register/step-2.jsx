import React, { useCallback } from 'react';

import { useRouter } from 'next/router';

import { Card, Divider, Row, Col } from 'antd';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth-context';
import { useGoogle } from '../../hooks/google-context';
import { useGoogleQuery } from '../../hooks/google-query';

import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';
import format from '../../lib/error-formatter';
import LinkButton from '../../components/link-button';
import Google from '../../components/google';

import styles from '../../styles';

const schema = Yup.object().shape({
  username: Yup.string()
    .required('Required'),
  password: Yup.string()
    .required('Required'),
  passwordConfirmation: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const paramsForRegistration = (values, profile, labels) => {
  const { googleId: providerId, name, email } = profile;

  return {
    ...values,
    mailbox: {
      name,
      email,
      provider: 'GMAIL',
      providerId,
      labels: labels.map(label => ({
        name: label.name,
        gmailPayload: {
          id: label.id,
          type: label.type,
          labelListVisibility: label.labelListVisibility,
          messageListVisibility: label.messageListVisibility,
        },
      })),
    },
  };
};

const Step2 = () => {
  const router = useRouter();
  const { register } = useAuth();
  const { profile, api } = useGoogle();

  const query = useCallback(() => api.getAllLabels(), [api]);
  const [result] = useGoogleQuery(api, query);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const params = paramsForRegistration(values, profile, result.labels);
    await register(params, {
      success: () => { router.push('/register/step-3'); },
      failure: (error) => {
        setErrors(format(error));
        setSubmitting(false);
      },
    });
  };

  return (
    <Layout.SimpleWide>
      <Card title="Get started in 3 easy steps">

        <Wizard current={1} />
        <Google.Login render={() => <React.Fragment />} />

        <Formik onSubmit={handleSubmit} validationSchema={schema}>
          <Form layout="vertical">

            <Row>
              <Col sm={0} md={4} lg={5} />
              <Col sm={24} md={16} lg={14}>

                <Form.Item name="username" label="Username">
                  <Input name="username" placeholder="Username" size="large" />
                </Form.Item>
                <Form.Item name="password" label="Password">
                  <Input.Password name="password" placeholder="Password" size="large" />
                </Form.Item>
                <Form.Item name="passwordConfirmation" label="Confirm password">
                  <Input.Password name="passwordConfirmation" placeholder="Confirm password" size="large" />
                </Form.Item>

              </Col>
              <Col sm={0} md={4} lg={5} />
            </Row>

            <Divider />

            <div className={styles.cardFooter}>
              <SubmitButton size="large" type="primary" htmlType="submit">Next</SubmitButton>
              <LinkButton type="link" href="/register">Back</LinkButton>
            </div>

          </Form>
        </Formik>

      </Card>
    </Layout.SimpleWide>
  );
};

Step2.whyDidYouRender = true;

export default Step2;
