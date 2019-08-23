import React, { useEffect } from 'react';

import { Layout, Icon } from 'antd';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/auth-context';
import styles from '../styles';

const { Content } = Layout;

const Index = () => {
  const { loggedIn, account } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!account) return;
    if (!loggedIn) {
      router.push('/login');
    } else {
      const defaultMailViewPath = `/mail/${account.defaultMailbox.position}/${account.defaultMailbox.defaultLabel.slug}`;
      router.push(defaultMailViewPath);
    }
  }, [loggedIn, account, router]);

  return (
    <Layout className={styles.full}>
      <Content className={styles.centralize}>
        <Icon type="loading" />
      </Content>
    </Layout>
  );
};

export default Index;
