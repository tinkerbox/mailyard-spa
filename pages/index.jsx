import React, { useEffect } from 'react';
import { Layout, Icon } from 'antd';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { useAuth } from '../hooks/auth-context';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  height: 100vh;
  main {
    justify-content: center;
    align-items: center;
    display: flex;
  }
`;

const Index = () => {
  const { loading, account } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && account) {
      const defaultMailViewPath = `/mail/${account.defaultMailbox.position}/${account.defaultMailbox.defaultLabel.slug}`;
      router.push(defaultMailViewPath);
    }
  }, [account, loading, router]);

  useEffect(() => {
    if (!loading && !account) router.push('/login');
  }, [account, loading, router]);

  return (
    <StyledLayout>
      <Content>
        <Icon type="loading" />
      </Content>
    </StyledLayout>
  );
};

Index.whyDidYouRender = true;

export default Index;
