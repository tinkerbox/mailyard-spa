import React, { useCallback, useContext } from 'react';
import { message, Card, Divider, Row, Col, PageHeader, Typography } from 'antd';
import { useRouter } from 'next/router';
import { ApolloContext } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useGoogle } from '../../hooks/google-context';
import { useGoogleQuery } from '../../hooks/google-query';

import Layout from '../../components/Layout';
import format from '../../lib/error-formatter';
import LinkButton from '../../components/link-button';
import Google from '../../components/google';

import styles from '../../styles';

const { Text } = Typography;

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

const ConfigureMailboxScreen = () => {
  const router = useRouter();
  const { client } = useContext(ApolloContext);

  const { profile, api } = useGoogle();

  const query = useCallback(() => api.getAllLabels(), [api]);
  const [result, status] = useGoogleQuery(api, query);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const variables = paramsForMailbox(values, profile, result.labels);

    client.mutate({
      mutation: ADD_MAILBOX_MUTATION,
      variables,
    })
      .then((mailbox) => {
        setSubmitting(false);
        message.success('Mailbox created, please wait.');
        router.push(`/sync/${mailbox.data.addMailbox.id}`);
      })
      .catch((error) => {
        setSubmitting(false);
        setErrors(format(error));
        message.error('Could not create your mailbox.');
      });
  };

  const initialValues = profile ? { name: profile.name } : {};

  const loading = (status !== 'done') || !profile;

  return (
    <Layout.FullScreen>

      <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Add New Mailbox" />

      <Card>

        <Google.Login render={() => <React.Fragment />} />

        {loading && <Text>Please wait...</Text>}

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
                <LinkButton type="link" href="/add">Back</LinkButton>
              </div>

            </Form>
          </Formik>
        )}

      </Card>
    </Layout.FullScreen>

  );
};

ConfigureMailboxScreen.whyDidYouRender = true;

export default ConfigureMailboxScreen;
