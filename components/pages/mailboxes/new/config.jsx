import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { message, Divider, Row, Col, Spin } from 'antd';
import { ApolloContext } from 'react-apollo';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

import { useGoogle } from '../../../../hooks/google-context';
import { useGoogleQuery } from '../../../../hooks/google-query';
import format from '../../../../lib/error-formatter';
import Google from '../../../google';
import LinkButton from '../../../link-button';

import styles from '../../../../styles';

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

const paramsForMailbox = (values, profile, labels) => {
  // TODO: move this somehere, and make it resuable
  const { googleId: providerId, email } = profile;

  return {
    mailbox: {
      ...values,
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

const ConfigureMailboxComponent = () => {
  const router = useRouter();
  const { client } = useContext(ApolloContext);
  const { profile } = useGoogle();
  const [result, queryLoading] = useGoogleQuery('getAllLabels');

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const variables = paramsForMailbox(values, profile, result.labels);

    client.mutate({
      mutation: ADD_MAILBOX_MUTATION,
      variables,
    })
      .then((mailbox) => {
        setSubmitting(false);
        message.success('Mailbox created, please wait.');
        router.push(`/mailboxes/${mailbox.data.addMailbox.id}/sync`);
      })
      .catch((error) => {
        setSubmitting(false);
        setErrors(format(error));
        message.error('Could not create your mailbox.');
      });
  };

  const initialValues = profile ? { name: profile.name } : {};

  const loading = queryLoading || !profile;

  return (
    <React.Fragment>

      <Google.Login render={() => <React.Fragment />} />

      {loading && <Spin size="large" />}

      {!loading && (
        <Formik onSubmit={handleSubmit} validationSchema={schema} initialValues={initialValues} isInitialValid>
          <Form layout="vertical">

            <Row>
              <Col sm={0} md={4} lg={5} />
              <Col sm={24} md={16} lg={14}>

                <Form.Item name="name" label="Mailbox name">
                  <Input name="name" placeholder="Name of mailbox" size="large" />
                </Form.Item>

              </Col>
              <Col sm={0} md={4} lg={5} />
            </Row>

            <Divider />

            <div className={styles.cardFooter}>
              <SubmitButton size="large" type="primary" htmlType="submit">Next</SubmitButton>
              <LinkButton type="link" href="/mailboxes/new">Back</LinkButton>
            </div>

          </Form>
        </Formik>
      )}

    </React.Fragment>
  );
};

ConfigureMailboxComponent.whyDidYouRender = true;

export default ConfigureMailboxComponent;
