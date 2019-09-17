import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { message, Divider, Row, Col, Spin } from 'antd';
import { ApolloContext } from 'react-apollo';
import { Form } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

import format from '../../../../lib/error-formatter';
import { useAuth } from '../../../../hooks/auth-context';
import useMailboxBuilder from '../../../../hooks/mailbox-builder';

const ADD_MAILBOX_MUTATION = gql`
  mutation($mailbox: MailboxInput!) {
  addMailbox(mailbox: $mailbox) {
    id
    name
    email
  }
}
`;

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Required'),
});

const ConfigureMailboxComponent = ({ children }) => {
  const router = useRouter();
  const { client } = useContext(ApolloContext);
  const { refresh } = useAuth();
  const { loading, fields, google, build, initialValues } = useMailboxBuilder();

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    client.mutate({
      mutation: ADD_MAILBOX_MUTATION,
      variables: { mailbox: build(values) },
    })
      .then((mailbox) => {
        setSubmitting(false);
        message.success('Mailbox created, please wait.');
        refresh();
        router.push(`/mailboxes/${mailbox.data.addMailbox.id}/sync`);
      })
      .catch((error) => {
        setSubmitting(false);
        setErrors(format(error));
        message.error('Could not create your mailbox.');
      });
  };
  return (
    <React.Fragment>

      {google}

      {loading && <Spin size="large" />}

      {!loading && (
        <Formik onSubmit={handleSubmit} validationSchema={schema} initialValues={initialValues} isInitialValid>
          <Form layout="vertical">

            <Row>
              <Col sm={0} md={4} lg={5} />
              <Col sm={24} md={16} lg={14}>
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

ConfigureMailboxComponent.propTypes = { children: PropTypes.node.isRequired };

ConfigureMailboxComponent.whyDidYouRender = true;

export default ConfigureMailboxComponent;
