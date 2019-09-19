import React, { useState, useContext } from 'react';
import { message, Table, Button, Divider, Drawer, Typography, Tag } from 'antd';
import prettyBytes from 'pretty-bytes';
import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

import styles from '../../../../styles';
import LinkButton from '../../../link-button';
import { useGraphQLQuery } from '../../../../hooks/graphql-query';
import { useAuth } from '../../../../hooks/auth-context';

const { Text, Paragraph } = Typography;

const MAILBOXES_QUERY = gql`
  query {
    mailboxes {
      id
      name
      email
      position
      messageCount
      usage
      lastSyncAt
      markedForDeletionAt
    }
  }
`;

const SET_AS_DEFAULT_MUTATION = gql`
mutation ($id: ID!) {
  setMailboxAsDefault(id: $id){
    id
  }
}
`;

const DELETE_MAILBOX_MUTATION = gql`
mutation ($id: ID!) {
  removeMailbox(id: $id){
    id
  }
}
`;

const columns = [
  {
    title: '',
    dataIndex: 'default',
    key: 'default',
    render: isDefault => (isDefault ? <Tag>Default</Tag> : null),
    align: 'right',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Messages',
    dataIndex: 'messages',
    key: 'messages',
  },
  {
    title: 'Usage',
    dataIndex: 'usage',
    key: 'usage',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

const Mailboxes = () => {
  const { client } = useContext(ApolloContext);
  const { refresh, account } = useAuth();
  const [selectedMailbox, setSelectedMailbox] = useState(null);
  const { loading, data, execute } = useGraphQLQuery(MAILBOXES_QUERY, { auto: false });

  const rows = data ? data.mailboxes.map((m) => {
    return {
      default: account.defaultMailboxId === m.id,
      id: m.id,
      key: m.position,
      email: m.email,
      name: m.name,
      messages: m.messageCount ? (m.messageCount).toLocaleString() : '-',
      usage: m.usage ? prettyBytes(m.usage) : '-',
      markedForDeletionAt: m.markedForDeletionAt,
      status: (() => {
        if (m.markedForDeletionAt) return 'Pending deletion...';
        return m.lastSyncAt ? new Date(m.lastSyncAt).toLocaleString() : 'Pending sync...';
      })(),
    };
  }) : [];

  const onRowSelect = record => ({ onClick: () => setSelectedMailbox(record) });

  const closeDrawer = () => setSelectedMailbox(null);

  const handleSetAsDefault = async () => {
    client.mutate({
      mutation: SET_AS_DEFAULT_MUTATION,
      variables: { id: selectedMailbox.id },
    }).then(() => {
      execute();
      refresh();
      setSelectedMailbox(null);
      message.success('Mailbox has been set as default');
    }).catch(() => {
      message.error('Could not set selected mailbox as default');
    });
  };

  const handleDelete = async () => {
    client.mutate({
      mutation: DELETE_MAILBOX_MUTATION,
      variables: { id: selectedMailbox.id },
    }).then(() => {
      message.success('Your mailbox will be removed shortly');
      execute();
      refresh();
      setSelectedMailbox(null);
    }).catch(() => {
      message.error('Could not remove selected mailbox');
    });
  };

  const drawer = selectedMailbox ? (
    <Drawer visible onClose={closeDrawer}>

      <Text strong>{selectedMailbox.name}</Text>
      <br />
      <Text>{selectedMailbox.email}</Text>

      <Divider dashed />

      <Text strong>Sync mailbox</Text>
      <Paragraph>Perform a incremental backup of the new emails since the last sync.</Paragraph>
      <LinkButton type="primary" href={`/mailboxes/${selectedMailbox.id}/sync`} disabled={!!selectedMailbox.markedForDeletionAt}>Go to Sync</LinkButton>

      <Divider dashed />

      <Text strong>Set as default</Text>
      <Paragraph>This will be the mailbox that is displayed upon startup.</Paragraph>
      {account.defaultMailboxId === selectedMailbox.id ? (
        <Paragraph type="warning">This mailbox is already your default.</Paragraph>
      ) : (
        <Button type="primary" onClick={handleSetAsDefault} disabled={!!selectedMailbox.markedForDeletionAt}>Set as default</Button>
      )}

      <Divider dashed />

      <Text strong>Delete this mailbox</Text>
      <Paragraph>Warning: this action cannot be undone.</Paragraph>
      {account.defaultMailboxId === selectedMailbox.id ? (
        <Paragraph type="warning">This mailbox is set as your default, and cannot be deleted.</Paragraph>
      ) : (
        <Button type="danger" onClick={handleDelete} disabled={!!selectedMailbox.markedForDeletionAt}>Delete</Button>
      )}

    </Drawer>
  ) : <Drawer visible={false} />;

  const rowClassName = (record) => {
    if (record.markedForDeletionAt) return styles.deleted;
    return '';
  };

  return (
    <React.Fragment>

      <div className={styles.use('py-3')}>
        <LinkButton type="primary" href="/mailboxes/new">Add Mailbox</LinkButton>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={false}
        onRow={onRowSelect}
        rowClassName={rowClassName}
      />

      <Divider dashed />

      {drawer}

    </React.Fragment>
  );
};

Mailboxes.whyDidYouRender = true;

export default Mailboxes;
