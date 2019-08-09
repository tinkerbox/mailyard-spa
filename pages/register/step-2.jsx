import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { Card, Divider, Row, Col } from 'antd';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth-context';
import { useGoogle } from '../../hooks/google-context';

import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';
import format from '../../utils/error-formatter';
import Button from '../../components/Button';

import styles from '../../utils/styles';

const GoogleLogin = dynamic(
  () => import('../../components/Google').then(mod => mod.default.Login),
  { ssr: false },
);

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
  const { register } = useAuth();
  const { profile, api, ready, refresh } = useGoogle();
  const [labels, setLabels] = useState();

  useEffect(() => {
    if (!ready) refresh();
  }, [ready, refresh]);

  useEffect(() => {
    let didCancel = false;
    (async () => {
      if (ready && api) {
        const { result } = await api.getAllLabels();
        if (!didCancel) setLabels(result.labels);
      }
    })();
    return () => { didCancel = true; };
  }, [ready, api]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const { name, email } = profile;
    const params = {
      ...values,
      mailbox: {
        name,
        email,
        labels: labels.map(label => ({
          name: label.name,
          type: 'USER',
        })),
      },
    };
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
        <GoogleLogin render={() => <React.Fragment />} />

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
              <Button type="link" href="/register">Back</Button>
            </div>

          </Form>
        </Formik>

      </Card>
    </Layout.SimpleWide>
  );
};

export default Step2;
