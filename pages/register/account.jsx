import React from 'react';
import { Card } from 'antd';
import { SubmitButton } from '@jbuschke/formik-antd';

import LinkButton from '../../components/link-button';
import Layout from '../../components/layout';
import Wizard from '../../components/pages/register/wizard';
import styles from '../../styles';
import AccountRegistrationComponent from '../../components/pages/register/account';

const AccountRegistrationScreen = () => {
  return (
    <Layout.SimpleWide>
      <Card title="Get started in 3 easy steps">
        <Wizard current={1} />
        <AccountRegistrationComponent>
          <div className={styles.cardFooter}>
            <SubmitButton size="large" type="primary" htmlType="submit">Next</SubmitButton>
            <LinkButton type="link" href="/register">Back</LinkButton>
          </div>
        </AccountRegistrationComponent>
      </Card>
    </Layout.SimpleWide>
  );
};

AccountRegistrationScreen.whyDidYouRender = true;

export default AccountRegistrationScreen;
