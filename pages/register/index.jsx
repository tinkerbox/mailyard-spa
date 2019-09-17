import React, { useEffect } from 'react';
import { Card } from 'antd';
import { useRouter } from 'next/router';

import { useAuth } from '../../hooks/auth-context';
import LinkButton from '../../components/link-button';
import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/wizard';
import styles from '../../styles';
import AccountSelector from '../../components/google/account-selector';


const RegistrationScreen = () => {
  const router = useRouter();
  const { loggedIn } = useAuth();

  useEffect(() => {
    if (loggedIn) router.push('/');
  }, [loggedIn, router]);

  return (
    <Layout.SimpleWide>
      <Card title="Get started in 3 easy steps">
        <Wizard current={0} />
        <AccountSelector>
          {({ disabled }) => (
            <div className={styles.cardFooter}>
              <LinkButton type="primary" size="large" href="register/account" disabled={disabled}>Next</LinkButton>
              <LinkButton type="link" href="/login">Already have an account?</LinkButton>
            </div>
          )}
        </AccountSelector>
      </Card>
    </Layout.SimpleWide>
  );
};

RegistrationScreen.whyDidYouRender = true;

export default RegistrationScreen;
