import React from 'react';
import PropTypes from 'prop-types';

import { useRouter } from 'next/router';
import { Menu, Icon, Popconfirm, message } from 'antd';

import { useAuth } from '../../../../hooks/auth-context';

import { makeStyles } from '../../../../styles';
import custom from './styles.css';

const styles = makeStyles(custom);

const Navigation = ({ query }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const { mailboxPos, labelId } = query;

  const onMenuSelect = (target) => {
    router.push(`/mail/${mailboxPos}/${target.key}`);
  };

  const onLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className={styles.menus}>

      <Menu theme="dark" onClick={onMenuSelect} selectable={false}>

        {!labelId && (
          <Menu.Item key="0">
            <Icon type="loading" />
            <span>Please wait...</span>
          </Menu.Item>
        )}

        {labelId && (
          <Menu.Item key={labelId}>
            <Icon type="user" />
            <span>Account</span>
          </Menu.Item>
        )}

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

Navigation.propTypes = {
  query: PropTypes.shape({
    mailboxPos: PropTypes.string,
    labelId: PropTypes.string,
  }).isRequired,
};

export default Navigation;
