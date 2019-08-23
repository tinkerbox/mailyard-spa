import React, { useEffect, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';
import { List, Empty, Icon, PageHeader, Tag } from 'antd';

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
        subject
        messages {
          id
          threadId
          receivedAt
          headers
          labels {
            id
            name
            slug
          }
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
    return thread.messages.map(m => <Conversation.Item key={m.id} message={m} />);
  }, [thread]);

  return (
    <React.Fragment>

      {selectedThreadId && !thread && (
        <div className={styles.use('centralize')}>
          <Icon type="loading" />
        </div>
      )}

      {!selectedThreadId && !thread && (
        <div className={styles.use('centralize')}>
          <Empty description="" />
        </div>
      )}

      {thread && (
        <Conversation.Listing thread={thread}>{items}</Conversation.Listing>
      )}

    </React.Fragment>
  );
};

const Listing = ({ thread, children }) => {
  // TODO: labels should be aggregated at the thread level, not messages
  const { labels } = thread.messages[0];
  const tags = labels.map(label => <Tag>{label.name}</Tag>);
  return (
    <div className={styles.thread}>
      <PageHeader title={thread.subject} tags={tags} />
      <List className={styles.use('p-3')}>{children}</List>
    </div>
  );
};

Listing.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      labels: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
      })).isRequired,
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

const Conversation = {};

Conversation.Container = React.memo(Container);
Conversation.Listing = React.memo(Listing);
Conversation.Item = React.memo(Item);

Container.whyDidYouRender = true;
Listing.whyDidYouRender = true;
Item.whyDidYouRender = true;

export default Conversation;
