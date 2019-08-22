/* globals window */

import React, { useContext, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';
import { List, Icon, Empty } from 'antd';

import { useMailSelector } from '../../../../hooks/mail-selector-context';

import { makeStyles } from '../../../../styles';
import custom from './styles.css';

const styles = makeStyles(custom);

const MESSAGES_QUERY = gql`
  query ($position: Int!) {
    mailbox(position: $position) {
      id
      messages {
        id
        threadId
        receivedAt
      }
    }
  }
`;

const Container = () => {
  const { selectedMailboxPos, selectThreadById } = useMailSelector();
  const { client } = useContext(ApolloContext);
  const [messages, setMessages] = useState();

  if (typeof window !== 'undefined' && window.location.hash.length > 0) selectThreadById(window.location.hash.split('#')[1]);

  useEffect(() => {
    let didCancel = false;

    (async () => {
      const results = await client.query({
        query: MESSAGES_QUERY,
        variables: {
          position: selectedMailboxPos,
        },
      });

      if (!didCancel) setMessages(results.data.mailbox.messages);
    })();

    return () => { didCancel = true; };
  }, [client, selectedMailboxPos]);

  const items = useMemo(() => {
    if (!messages) return [];
    return messages.map(message => <Message.Item key={message.id} message={message} />);
  }, [messages]);

  return (
    <React.Fragment>

      {!messages && ( // if loading
        <div className={styles.use('centralize')}>
          <Icon type="loading" />
        </div>
      )}

      {messages && messages.length === 0 && ( // if empty
        <Empty />
      )}

      {messages && messages.length !== 0 && ( // if not empty
        <Message.Listing>
          {items}
        </Message.Listing>
      )}

    </React.Fragment>
  );
};

const Listing = ({ children }) => {
  return (
    <List>{children}</List>
  );
};

Listing.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

const Item = ({ message }) => {
  const { selectThreadById } = useMailSelector();
  const { id, threadId, receivedAt } = message;
  const displayDate = new Date(receivedAt).toDateString();

  const clickHandler = () => {
    selectThreadById(threadId);
    window.location.hash = threadId;
  };

  return (
    <List.Item key={id} onClick={clickHandler}>{displayDate}</List.Item>
  );
};

Item.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    threadId: PropTypes.string.isRequired,
    receivedAt: PropTypes.string.isRequired,
  }).isRequired,
};

const Message = {};

Message.Container = React.memo(Container);
Message.Listing = React.memo(Listing);
Message.Item = React.memo(Item);

Container.whyDidYouRender = true;
Listing.whyDidYouRender = true;
Item.whyDidYouRender = true;

export default Message;
