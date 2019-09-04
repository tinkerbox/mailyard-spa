/* globals window */

import React, { useRef, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { List, Empty, Typography, Row, Col } from 'antd';
import { parseOneAddress } from 'email-addresses';

import { useMailSelector } from '../../../../hooks/mail-selector-context';
import { useScrollWindow } from '../../../../hooks/scroll-window';
import { useScrollObserver } from '../../../../hooks/scroll-observer';
import { makeStyles } from '../../../../styles';
import custom from './styles.css';

const { Text } = Typography;
const styles = makeStyles(custom);

const Container = () => {
  const { selectThreadById, selectedThreadId } = useMailSelector();

  if (typeof window !== 'undefined' && window.location.hash.length > 0) {
    const newThreadId = window.location.hash.split('#')[1];
    if (newThreadId !== selectedThreadId) selectThreadById(newThreadId);
  }

  return (
    <React.Fragment>
      <Message.Listing />
    </React.Fragment>
  );
};

const Listing = () => {
  const { register, observe } = useScrollObserver();
  const { selectedThreadId } = useMailSelector();
  const { loading, page, edges, before, after } = useScrollWindow();

  const firstElement = useRef(null);
  const lastElement = useRef(null);

  const items = edges.map(({ cursor, node }, index) => {
    let ref = null;
    const { id, message } = node;

    if (index === 0) {
      ref = firstElement;
    } else if (index === edges.length - 1) {
      ref = lastElement;
    }

    return (
      <Message.Item
        key={message.id}
        cursor={cursor}
        message={message}
        selected={selectedThreadId === id}
        ref={ref}
      />
    );
  });

  useEffect(() => {
    if (firstElement.current && lastElement.current) observe([firstElement, lastElement]);

    register((entry) => {
      if (loading) return;

      if (firstElement.current.dataset.cursor === entry.target.dataset.cursor && page.hasPreviousPage) {
        after(entry.target.dataset.cursor);
      }

      if (lastElement.current.dataset.cursor === entry.target.dataset.cursor && page.hasNextPage) {
        before(entry.target.dataset.cursor);
      }
    });
  }, [after, before, items, loading, observe, page, register]);

  return (
    <List>
      {items.length > 0 && items}
      {items.length === 0 && (
        <div className={styles.use('centralize')}>
          <Empty />
        </div>
      )}
    </List>
  );
};

const Item = forwardRef(({ cursor, message, selected }, ref) => {
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

      <div ref={ref} data-cursor={cursor} />

    </List.Item>
  );
});

Item.propTypes = {
  selected: PropTypes.bool,
  cursor: PropTypes.string.isRequired,
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
