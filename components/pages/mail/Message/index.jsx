/* globals window */

import React, { useRef, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { List, Icon, Empty, Typography, Row, Col } from 'antd';
import { parseOneAddress } from 'email-addresses';

import { useMailSelector } from '../../../../hooks/mail-selector-context';
import { useScrollObserver } from '../../../../hooks/scroll-observer';
import { useGraphQLQuery } from '../../../../hooks/graphql-query';
import { makeStyles } from '../../../../styles';
import custom from './styles.css';

const { Text } = Typography;
const styles = makeStyles(custom);

const MESSAGES_QUERY = gql`
  query ($position: Int!) {
    mailbox(position: $position) {
      id
      messages {
        id
        threadId
        receivedAt
        snippet
        headers
      }
    }
  }
`;

const Container = () => {
  const { selectedMailboxPos, selectThreadById, selectedThreadId } = useMailSelector();
  const { register, observe } = useScrollObserver();
  const firstElement = useRef(null);
  const lastElement = useRef(null);

  const { loading, data } = useGraphQLQuery(MESSAGES_QUERY, {
    variables: {
      position: selectedMailboxPos,
    },
  });

  const items = data ? data.mailbox.messages.map((message, index) => {
    let ref = null;

    if (index === 0) {
      ref = firstElement;
    } else if (index === data.mailbox.messages.length - 1) {
      ref = lastElement;
    }

    return (
      <Message.Item
        key={message.id}
        message={message}
        selected={selectedThreadId === message.threadId}
        ref={ref}
      />
    );
  }) : [];

  useEffect(() => {
    if (firstElement.current) observe(firstElement);
    if (lastElement.current) observe(lastElement);

    register(entry => console.log(entry.target.dataset.cursor));
  }, [items, observe, register]);

  if (typeof window !== 'undefined' && window.location.hash.length > 0) {
    const newThreadId = window.location.hash.split('#')[1];
    if (newThreadId !== selectedThreadId) selectThreadById(newThreadId);
  }

  return (
    <React.Fragment>

      {loading && (
        <div className={styles.use('centralize')}>
          <Icon type="loading" />
        </div>
      )}

      {!loading && items.length === 0 && <Empty />}

      {!loading && items.length > 0 && (
        <Message.Listing>
          {items}
        </Message.Listing>
      )}

    </React.Fragment>
  );
};

const Listing = ({ children }) => <List>{children}</List>;

Listing.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

const Item = forwardRef(({ message, selected }, ref) => {
  const { selectThreadById } = useMailSelector();
  const { id, threadId, receivedAt, snippet, headers } = message;
  const displayDate = new Date(receivedAt).toDateString();

  const clickHandler = () => {
    selectThreadById(threadId);
    window.location.hash = threadId;
  };

  const from = parseOneAddress(headers.From);
  const subject = headers.Subject;

  return (
    <List.Item key={id} onClick={clickHandler} className={styles.use('item', `${selected ? 'selected' : ''}`)}>

      <Row type="flex" justify="space-between" align="top" className={styles.use('mb-1')}>
        <Col>
          <Text strong ellipsis>{from.name || from.address}</Text>
        </Col>
        <Col align="right">
          <Text ellipsis type="secondary">{displayDate}</Text>
        </Col>
      </Row>

      <Text className={styles.text} ellipsis>{subject}</Text>
      <Text className={styles.text} ellipsis type="secondary">{snippet}</Text>

      <div ref={ref} data-cursor={'cursor-goes-here'}/>

    </List.Item>
  );
});

Item.propTypes = {
  selected: PropTypes.bool,
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    threadId: PropTypes.string.isRequired,
    receivedAt: PropTypes.string.isRequired,
    snippet: PropTypes.string.isRequired,
    headers: PropTypes.shape({
      From: PropTypes.string.isRequired,
      Subject: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

Item.defaultProps = {
  selected: false,
};

const Message = {};

Message.Container = React.memo(Container);
Message.Listing = React.memo(Listing);
Message.Item = React.memo(Item);

Container.whyDidYouRender = true;
Listing.whyDidYouRender = true;
Item.whyDidYouRender = true;

export default Message;
