/* globals window */

import { filter, orderBy } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu, Icon, Popconfirm, Avatar, message } from 'antd';
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
      markedForDeletionAt
    }
  }
`;

const Navigation = () => {
  const { logout, refresh } = useAuth();
  const router = useRouter();
  const { selectedMailboxPos, selectedLabelSlug, selectMailbox } = useMailSelector();
  const { data, execute } = useGraphQLQuery(MAILBOXES_QUERY, {}, { auto: false });

  useEffect(() => execute(), [execute]);

  const onLogout = useCallback(() => {
    logout({
      success: () => message.success('Logged out, please wait'),
      failure: () => message.error('Something went wrong'),
    });
    refresh();
  }, [logout, refresh]);

  const onMailboxSelect = useCallback(({ key }) => {
    if (key === 'loading') return;
    selectMailbox(parseInt(key, 10));
    const path = `/mail/${key}/${selectedLabelSlug}`;
    window.history.pushState(null, null, path);
  }, [selectMailbox, selectedLabelSlug]);

  const onMenuSelect = useCallback(({ key }) => {
    switch (key) {
      case 'settings': {
        const prevUrl = `${window.location.pathname}${window.location.hash}`;
        window.history.pushState({ prevUrl }, null, '/settings');
        router.push('/settings');
        break;
      }

      default:
    }
  }, [router]);

  const mailboxes = data ? filter(data.mailboxes, (m) => { return !m.markedForDeletionAt; }) : [];
  const mailboxSelectors = data ? orderBy(mailboxes, ['position']).map(mailbox => (
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

      </Menu>

      <Menu theme="dark" onClick={onMenuSelect} selectable={false}>

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
