import React, { useEffect } from 'react';

import { Layout, Icon } from 'antd';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/auth-context';
import styles from '../styles';

const { Content } = Layout;

const Index = () => {
  const { loading, account } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && account) {
      const defaultMailViewPath = `/mail/${account.defaultMailbox.position}/${account.defaultMailbox.defaultLabel.slug}`;
      router.push(defaultMailViewPath);
    }
  }, [account, loading, router]);

  return (
    <Layout className={styles.full}>
      <Content className={styles.centralize}>
        <Icon type="loading" />
      </Content>
    </Layout>
  );
};

Index.whyDidYouRender = true;

export default Index;
