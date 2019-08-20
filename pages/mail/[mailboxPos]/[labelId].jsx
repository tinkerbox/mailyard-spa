import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout, Button } from 'antd';

import { useAuth } from '../../../hooks/auth-context';

const { Content } = Layout;

const MailView = () => {
  const { logout } = useAuth();

  const router = useRouter();
  const { mailboxPos, labelId } = router.query;

  const onLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Content>
      <p>{labelId}</p>
      <Link href={`/mail/${mailboxPos}/${labelId}`}><a>All</a></Link>
      <Button type='link' onClick={onLogout}>Logout</Button>
      <Button onClick={() => router.push('/login')}>Login</Button>
    </Content>
  );
};

MailView.whyDidYouRender = true;

export default MailView;
