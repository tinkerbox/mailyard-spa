import React, { useMemo } from 'react';
import { Form, Input } from '@jbuschke/formik-antd';

import { useGoogleQuery } from './google-query';
import { useGoogle } from './google-context';
import Google from '../components/google/auth-buttons';

const useMailboxBuilder = () => {
  const { profile } = useGoogle();
  const [result, loading] = useGoogleQuery('getAllLabels');

  const { googleId: providerId, email, name } = profile || {};

  const google = useMemo(() => (
    <Google.Login render={() => <React.Fragment />} />
  ), []);

  const fields = useMemo(() => (
    <Form.Item name="name" label="Mailbox name">
      <Input name="name" placeholder="Name of mailbox" size="large" />
    </Form.Item>
  ), []);

  const build = values => ({
    name,
    ...values,
    email,
    provider: 'GMAIL',
    providerId,
    labels: result.labels.map(label => ({
      name: label.name,
      gmailPayload: {
        id: label.id,
        type: label.type,
        labelListVisibility: label.labelListVisibility,
        messageListVisibility: label.messageListVisibility,
      },
    })),
  });

  return {
    loading: loading || !profile,
    fields,
    google,
    build,
    initialValues: { name },
  };
};

export default useMailboxBuilder;
