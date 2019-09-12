/* globals window */

import React, { useState, useRef } from 'react';
import { PageHeader, Menu, Icon, Card } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';

const Mailboxes = dynamic(() => import('../../components/pages/settings/mailboxes'));
const Account = dynamic(() => import('../../components/pages/settings/account'));
const Subscription = dynamic(() => import('../../components/pages/settings/subscription'));

const initialData = () => {
  return {
    initialSelectedScreen: window.location.hash.length > 0 ? window.location.hash.split('#')[1] : 'mailboxes',
    prevUrl: window.history.state.prevUrl,
  };
};

const Content = dynamic(() => {
  return Promise.resolve(() => {
    const { initialSelectedScreen, prevUrl } = initialData();

    const router = useRouter();
    const [selectedScreen, setSelectedScreen] = useState(initialSelectedScreen);
    const previousPage = useRef(prevUrl);

    const handleClick = (e) => {
      setSelectedScreen(e.key);
      window.location.hash = e.key;
    };

    return (
      <React.Fragment>
        <PageHeader onBack={() => router.push(previousPage.current)} title="Settings" />

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
      </React.Fragment>
    );
  });
}, {
  ssr: false,
});

const Settings = () => {
  return (
    <Layout.FullScreen>
      <Content />
    </Layout.FullScreen>
  );
};

export default Settings;
