import { orderBy } from 'lodash';

import React, { useState, useEffect, useContext } from 'react';

import { useRouter } from 'next/router';
import { Menu, Icon, Popconfirm, Avatar } from 'antd';

import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

import { useAuth } from '../../../../hooks/auth-context';
import { useMailSelector } from '../../../../hooks/mail-selector-context';

import { makeStyles } from '../../../../styles';
import custom from './styles.css';

const styles = makeStyles(custom);

const MAILBOXES_QUERY = gql`
  query {
    mailboxes {
      id
      name
      email
      position
    }
  }
`;

const Navigation = () => {
  const [mailboxes, setMailboxes] = useState([]);
  const { logout } = useAuth();
  const router = useRouter();
  const { client } = useContext(ApolloContext);
  const { selectedMailboxPos, selectedLabelSlug } = useMailSelector();

  useEffect(() => {
    let didCancel = false;

    (async () => {
      const results = await client.query({ query: MAILBOXES_QUERY });
      if (!didCancel) setMailboxes(results.data.mailboxes);
    })();

    return () => { didCancel = true; };
  }, [client]);

  const onLogout = () => {
    logout();
    router.push('/login');
  };

  const onMailboxSelect = ({ key }) => {
    switch (key) {
      case 'new':
        alert('Adding of mailboxes is not supported yet.');
        break;

      case 'loading':
        break;

      default:
        if (selectedMailboxPos.toString() !== key) router.push(`/mail/${key}/${selectedLabelSlug}`);
    }
  };

  const mailboxSelectors = orderBy(mailboxes, ['position']).map(mailbox => (
    <Menu.Item key={mailbox.position} selected={selectedMailboxPos === mailbox.id} title={mailbox.email}>
      <i className="anticon">
        <Avatar size="small">{mailbox.name[0]}</Avatar>
      </i>
      <span>{mailbox.name}</span>
    </Menu.Item>
  ));

  return (
    <div className={styles.menus}>

      <Menu theme="dark" onClick={onMailboxSelect} selectable={false}>

        {mailboxSelectors.length === 0 && (
          <Menu.Item key="loading">
            <Icon type="loading" />
          </Menu.Item>
        )}

        {mailboxSelectors.length > 0 && mailboxSelectors}

        <Menu.Item key="new">
          <Icon type="plus" />
          <span>Add Mailbox</span>
        </Menu.Item>

      </Menu>

      <Menu theme="dark" selectable={false}>

        <Menu.Item key="logout">
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

        <Menu.Item key="settings">
          <Icon type="setting" />
          <span>Settings</span>
        </Menu.Item>

      </Menu>

    </div>
  );
};

Navigation.whyDidYouRender = true;

export default Navigation;
