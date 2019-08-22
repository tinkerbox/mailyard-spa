import React, { useEffect, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';
import { List, Empty, Icon, PageHeader } from 'antd';

import { useMailSelector } from '../../../../hooks/mail-selector-context';

import { makeStyles } from '../../../../styles';

import custom from './styles.css';

const styles = makeStyles(custom);

const THREAD_QUERY = gql`
  query ($position: Int!, $id: ID!) {
    mailbox(position: $position) {
      id
      thread(id: $id) {
        id
        messages {
          id
          threadId
          receivedAt
        }
      }
    }
  }
`;

const Container = () => {
  const { selectedMailboxPos, selectedThreadId } = useMailSelector();
  const { client } = useContext(ApolloContext);
  const [thread, setThread] = useState(undefined);

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (selectedThreadId === null) return;

      const results = await client.query({
        query: THREAD_QUERY,
        variables: {
          position: selectedMailboxPos,
          id: selectedThreadId,
        },
      });

      if (!didCancel) setThread(results.data.mailbox.thread);
    })();

    return () => { didCancel = true; };
  }, [client, selectedMailboxPos, selectedThreadId]);

  const items = useMemo(() => {
    if (!thread) return [];
    return thread.messages.map(m => <Thread.Item key={m.id} message={m} />);
  }, [thread]);

  return (
    <React.Fragment>

      {selectedThreadId && !thread && ( // if loading
        <div className={styles.use('centralize')}>
          <Icon type="loading" />
        </div>
      )}

      {!selectedThreadId && !thread && ( // empty
        <div className={styles.use('centralize')}>
          <Empty description="" />
        </div>
      )}

      {thread && ( // empty
        <Thread.Listing thread={thread}>{items}</Thread.Listing>
      )}

    </React.Fragment>
  );
};

const Listing = ({ thread, children }) => {
  return (
    <div className={styles.thread}>
      <PageHeader>{thread.id}</PageHeader>
      <List className={styles.use('p-3')}>{children}</List>
    </div>
  );
};

Listing.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

const Item = ({ message }) => {
  const { id, receivedAt } = message;
  return (
    <List.Item>
      <strong>{`${id} => ${receivedAt}`}</strong>
    </List.Item>
  );
};

Item.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    receivedAt: PropTypes.string.isRequired,
  }).isRequired,
};

const Thread = {};

Thread.Container = React.memo(Container);
Thread.Listing = React.memo(Listing);
Thread.Item = React.memo(Item);

Container.whyDidYouRender = true;
Listing.whyDidYouRender = true;
Item.whyDidYouRender = true;

export default Thread;
