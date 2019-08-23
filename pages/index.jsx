import React, { useEffect } from 'react';

import { Layout } from 'antd';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/auth-context';

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
    <Content>
      <p>Please wait...</p>
    </Content>
  );
};

export default Index;
