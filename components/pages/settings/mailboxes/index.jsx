import React, { useState } from 'react';
import { Table, Button, Divider, Drawer, Typography } from 'antd';
import Link from 'next/link';
import prettyBytes from 'pretty-bytes';

import styles from '../../../../styles';

const { Text, Paragraph } = Typography;

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

const LinkButton = React.forwardRef(({ onClick, href, children, ...others }, ref) => {
  return <Button onClick={onClick} href={href} ref={ref} {...others}>{children}</Button>;
});

const Mailboxes = () => {
  const [selectedMailbox, setSelectedMailbox] = useState(null);

  const data = [
    {
      key: '0',
      name: 'John Doe',
      email: 'john.doe@example.net',
      messages: (32013).toLocaleString(),
      usage: prettyBytes(19200000000),
      lastSync: new Date().toDateString(),
    },
  ];

  const onRowSelect = (record) => {
    return {
      onClick: () => setSelectedMailbox(record),
    };
  };

  const closeDrawer = () => setSelectedMailbox(null);

  const drawer = selectedMailbox ? (
    <Drawer visible onClose={closeDrawer}>

      <Text strong>{selectedMailbox.name}</Text>
      <br />
      <Text>{selectedMailbox.email}</Text>

      <Divider dashed />

      <Text strong>Sync mailbox</Text>
      <Paragraph>Perform a incremental backup of the new emails since the last sync.</Paragraph>
      <LinkButton type="primary" href={`/mail/${selectedMailbox.key}/sync`}>Go to Sync</LinkButton>

      <Divider dashed />

      <Text strong>Delete this mailbox</Text>
      <Paragraph>Warning: this action cannot be undone.</Paragraph>
      <Button type="danger">Delete</Button>

    </Drawer>
  ) : <Drawer visible={false} />;

  return (
    <React.Fragment>

      <div className={styles.use('py-3')}>
        <Button type="primary">Add Mailbox</Button>
      </div>

      <Table columns={columns} dataSource={data} pagination={false} onRow={onRowSelect} />

      <Divider dashed />

      {drawer}

    </React.Fragment>
  );
};

export default Mailboxes;
