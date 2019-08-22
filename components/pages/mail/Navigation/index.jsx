import React from 'react';

import { useRouter } from 'next/router';
import { Menu, Icon, Popconfirm } from 'antd';

import { useAuth } from '../../../../hooks/auth-context';
import { useMailSelector } from '../../../../hooks/mail-selector-context';

import { makeStyles } from '../../../../styles';
import custom from './styles.css';

const styles = makeStyles(custom);

const Navigation = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const { selectedMailboxPos, selectedLabelId } = useMailSelector();

  const onMenuSelect = (target) => {
    router.push(`/mail/${target.key}/${selectedLabelId}`);
  };

  const onLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className={styles.menus}>

      <Menu theme="dark" onClick={onMenuSelect} selectable={false}>

        <Menu.Item key={selectedMailboxPos}>
          <Icon type="user" />
          <span>Account</span>
        </Menu.Item>

      </Menu>

      <Menu theme="dark" selectable={false}>

        <Menu.Item key="1">
          <Popconfirm
            title="Confirm logout?"
            onConfirm={onLogout}
            okText="Yes"
            cancelText="No"
          >
            <Icon type="logout" />
            <span>Logout</span>
          </Popconfirm>
        </Menu.Item>

        <Menu.Item key="2">
          <Icon type="setting" />
          <span>Settings</span>
        </Menu.Item>

      </Menu>

    </div>
  );
};

Navigation.whyDidYouRender = true;

export default Navigation;
