import { orderBy } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu, Icon, Popconfirm, Avatar } from 'antd';
import gql from 'graphql-tag';

import { useAuth } from '../../../../hooks/auth-context';
import { useGraphQLQuery } from '../../../../hooks/graphql-query';
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
  const { logout } = useAuth();
  const router = useRouter();
  const { selectedMailboxPos, selectedLabelSlug } = useMailSelector();
  const { data, execute } = useGraphQLQuery(MAILBOXES_QUERY, {}, { auto: false });

  useEffect(() => execute(), [execute]);

  const onLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  const onMailboxSelect = useCallback(({ key }) => {
    if (key === 'new') {
      // TOOD: replace with a modal
      alert('Adding of mailboxes is not supported yet.');
    } else if (key !== 'loading') {
      if (selectedMailboxPos.toString() !== key) router.push(`/mail/${key}/${selectedLabelSlug}`);
    }
  }, [router, selectedLabelSlug, selectedMailboxPos]);

  const mailboxSelectors = data ? orderBy(data.mailboxes, ['position']).map(mailbox => (
    <Menu.Item key={mailbox.position} selected={selectedMailboxPos === mailbox.id} title={mailbox.email}>
      <i className="anticon">
        <Avatar size="small">{mailbox.name[0]}</Avatar>
      </i>
      <span>{mailbox.name}</span>
    </Menu.Item>
  )) : [];

  return (
    <div className={styles.menus}>

      <Menu theme="dark" onClick={onMailboxSelect} selectable={false}>

        {!data && (
          <Menu.Item key="loading">
            <Icon type="loading" />
          </Menu.Item>
        )}

        {data && mailboxSelectors}

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
