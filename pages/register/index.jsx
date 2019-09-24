import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

import AuthWrapper from '../../components/auth-wrapper';
import LinkButton from '../../components/link-button';
import Layout from '../../components/layout';
import Wizard from '../../components/pages/register/wizard';
import AccountSelector from '../../components/google/account-selector';

const StyledCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
`;

const RegistrationScreen = () => {
  return (
    <AuthWrapper.NotAuthenticated>
      <Layout.SimpleWide>
        <Card title="Get started in 3 easy steps">
          <Wizard current={0} />
          <AccountSelector>
            {({ profile }) => (
              <StyledCardFooter>
                <LinkButton type="primary" size="large" href="register/account" disabled={!profile}>Next</LinkButton>
                <LinkButton type="link" href="/login">Already have an account?</LinkButton>
              </StyledCardFooter>
            )}
          </AccountSelector>
        </Card>
      </Layout.SimpleWide>
    </AuthWrapper.NotAuthenticated>
  );
};

RegistrationScreen.whyDidYouRender = true;

export default RegistrationScreen;
