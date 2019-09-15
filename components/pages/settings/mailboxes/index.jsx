import React, { useState } from 'react';
import { Table, Button, Divider, Drawer, Typography } from 'antd';
import prettyBytes from 'pretty-bytes';
import gql from 'graphql-tag';

import styles from '../../../../styles';
import LinkButton from '../../../link-button';
import { useGraphQLQuery } from '../../../../hooks/graphql-query';

const { Text, Paragraph } = Typography;

const MAILBOXES_QUERY = gql`
  query {
    mailboxes {
      id
      name
      email
      position
      # messageCount
      # usage
      # lastSyncAt
    }
  }
`;

const columns = [
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
    title: 'Last Sync',
    dataIndex: 'lastSync',
    key: 'lastSync',
  },
];

const Mailboxes = () => {
  const [selectedMailbox, setSelectedMailbox] = useState(null);
  const { loading, data } = useGraphQLQuery(MAILBOXES_QUERY);

  const rows = data ? data.mailboxes.map((m) => {
    return {
      key: m.position,
      email: m.email,
      name: m.name,
      messages: (32013).toLocaleString(), // TODO: use real data
      usage: prettyBytes(19200000000),
      lastSync: new Date().toDateString(),
    };
  }) : [];

  const onRowSelect = record => ({ onClick: () => setSelectedMailbox(record) });

  const closeDrawer = () => setSelectedMailbox(null);

  const drawer = selectedMailbox ? (
    <Drawer visible onClose={closeDrawer}>

      <Text strong>{selectedMailbox.name}</Text>
      <br />
      <Text>{selectedMailbox.email}</Text>

      <Divider dashed />

      <Text strong>Sync mailbox</Text>
      <Paragraph>Perform a incremental backup of the new emails since the last sync.</Paragraph>
      <LinkButton type="primary" href={`/sync/${selectedMailbox.key}`}>Go to Sync</LinkButton>

      <Divider dashed />

      <Text strong>Delete this mailbox</Text>
      <Paragraph>Warning: this action cannot be undone.</Paragraph>
      <Button type="danger">Delete</Button>

    </Drawer>
  ) : <Drawer visible={false} />;

  return (
    <React.Fragment>

      <div className={styles.use('py-3')}>
        <LinkButton type="primary" href="/add">Add Mailbox</LinkButton>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={false}
        onRow={onRowSelect}
      />

      <Divider dashed />

      {drawer}

    </React.Fragment>
  );
};

Mailboxes.whyDidYouRender = true;

export default Mailboxes;
