/* globals window */

import React, { useState } from 'react';
import { PageHeader, Menu, Icon, Card } from 'antd';
import dynamic from 'next/dynamic';

import Layout from '../../components/Layout';

const Mailboxes = dynamic(() => import('../../components/pages/settings/mailboxes'));
const Account = dynamic(() => import('../../components/pages/settings/account'));
const Subscription = dynamic(() => import('../../components/pages/settings/subscription'));

const initialSelectedScreen = () => {
  if (window.location.hash.length > 0) return window.location.hash.split('#')[1];
  return 'mailboxes';
};

const Content = dynamic(() => {
  return Promise.resolve(() => {
    const [selectedScreen, setSelectedScreen] = useState(initialSelectedScreen());

    const handleClick = (e) => {
      setSelectedScreen(e.key);
      window.location.hash = e.key;
    };

    return (
      <Card>

        <Menu onClick={handleClick} mode="horizontal" selectedKeys={[selectedScreen]}>
          <Menu.Item key="mailboxes">
            <Icon type="mail" />
            Mailboxes
          </Menu.Item>
          <Menu.Item key="account">
            <Icon type="user" />
            Account
          </Menu.Item>
          <Menu.Item key="subscription">
            <Icon type="dollar" />
            Subscription
          </Menu.Item>
        </Menu>

        {selectedScreen === 'mailboxes' && <Mailboxes />}
        {selectedScreen === 'account' && <Account />}
        {selectedScreen === 'subscription' && <Subscription />}

      </Card>
    );
  });
}, {
  ssr: false,
});

const Settings = () => {
  return (
    <Layout.FullScreen>
      <PageHeader onBack={() => window.history.back()} title="Settings" />
      <Content />
    </Layout.FullScreen>
  );
};

export default Settings;
