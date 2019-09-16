import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Divider, Row, Col, Spin } from 'antd';
import { Form, Input } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import format from '../../../lib/error-formatter';
import { useAuth } from '../../../hooks/auth-context';
import useMailboxBuilder from '../../../hooks/mailbox-builder';

const schema = Yup.object().shape({
  username: Yup.string()
    .required('Required'),
  password: Yup.string()
    .required('Required'),
  passwordConfirmation: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  name: Yup.string()
    .required('Required'),
});

const AccountRegistrationComponent = ({ children }) => {
  const router = useRouter();
  const { register } = useAuth();
  const { loading, fields, google, build, initialValues } = useMailboxBuilder();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const params = { ...values, mailbox: build() };
    await register(params, {
      success: () => { router.push('/register/sync'); },
      failure: (error) => {
        setErrors(format(error));
        setSubmitting(false);
      },
    });
  };

  return (
    <React.Fragment>

      {google}

      {loading && <Spin size="large" />}

      {!loading && (
        <Formik onSubmit={handleSubmit} validationSchema={schema} initialValues={initialValues}>
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

                <Divider />

                {fields}

              </Col>
              <Col sm={0} md={4} lg={5} />
            </Row>

            <Divider />

            {children}

          </Form>
        </Formik>
      )}

    </React.Fragment>
  );
};

AccountRegistrationComponent.propTypes = { children: PropTypes.node.isRequired };

AccountRegistrationComponent.whyDidYouRender = true;

export default AccountRegistrationComponent;
