import React from 'react';
import { Card } from 'antd';

import AuthWrapper from '../../components/auth-wrapper';
import LinkButton from '../../components/link-button';
import Layout from '../../components/layout';
import Wizard from '../../components/pages/register/wizard';
import AccountSelector from '../../components/google/account-selector';
import styles from '../../styles';

const RegistrationScreen = () => {
  return (
    <AuthWrapper.NotAuthenticated>
      <Layout.SimpleWide>
        <Card title="Get started in 3 easy steps">
          <Wizard current={0} />
          <AccountSelector>
            {({ profile }) => (
              <div className={styles.cardFooter}>
                <LinkButton type="primary" size="large" href="register/account" disabled={!profile}>Next</LinkButton>
                <LinkButton type="link" href="/login">Already have an account?</LinkButton>
              </div>
            )}
          </AccountSelector>
        </Card>
      </Layout.SimpleWide>
    </AuthWrapper.NotAuthenticated>
  );
};

RegistrationScreen.whyDidYouRender = true;

export default RegistrationScreen;
