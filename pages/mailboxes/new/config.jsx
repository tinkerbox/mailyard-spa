import React from 'react';
import { PageHeader, Card } from 'antd';
import { useRouter } from 'next/router';
import { SubmitButton } from '@jbuschke/formik-antd';

import AuthWrapper from '../../../components/auth-wrapper';
import Styled from '../../../components/styled';
import Layout from '../../../components/layout';
import LinkButton from '../../../components/link-button';
import ConfigureMailboxComponent from '../../../components/pages/mailboxes/new/config';

const ConfigureMailboxScreen = () => {
  const router = useRouter();

  return (
    <AuthWrapper.Authenticated>
      <Layout.FullScreen>
        <PageHeader onBack={() => router.push('/settings#mailboxes')} title="Configure Mailbox" />
        <Card>
          <ConfigureMailboxComponent>
            <Styled.CardFooter>
              <SubmitButton size="large" type="primary" htmlType="submit">Next</SubmitButton>
              <LinkButton type="link" href="/mailboxes/new">Back</LinkButton>
            </Styled.CardFooter>
          </ConfigureMailboxComponent>
        </Card>
      </Layout.FullScreen>
    </AuthWrapper.Authenticated>
  );
};

ConfigureMailboxScreen.whyDidYouRender = true;

export default ConfigureMailboxScreen;
