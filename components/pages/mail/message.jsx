/* globals window */

import React, { useRef, useMemo, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { List, Empty, Typography, Row, Col, Affix, Dropdown, Menu, Button, Icon } from 'antd';
import { parseOneAddress } from 'email-addresses';
import styled from 'styled-components';
import quotedPrintable from 'quoted-printable';

import { useMailSelector } from '../../../hooks/mail-selector-context';
import { useScrollWindow } from '../../../hooks/scroll-window';
import { useScrollObserver } from '../../../hooks/scroll-observer';

const { Text } = Typography;

const SearchRow = styled(Row)`
  background: white;
`;

const ListItem = styled(List.Item)`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  align-items: normal;

  background-color: ${props => (props.selected ? 'rgba(24, 144, 255, 0.05)' : 'inherit')};

  &:hover { background-color: rgba(0, 21, 41, 0.05); }

  & > { width: 100%; }
`;

const StyledText = styled(Text)`
  width: 100%;
`;

const labelsToIgnore = [
  'INBOX',
  'UNREAD',
  'SPAM',
  'TRASH',
  'CATEGORY_PROMOTIONS',
  'CATEGORY_FORUMS',
  'CATEGORY_UPDATES',
  'CATEGORY_SOCIAL',
  'CATEGORY_PERSONAL',
];

const Container = () => {
  const { selectedMailboxPos, selectThread, selectedThreadId, labels, selectLabel, selectedLabel } = useMailSelector();
  const { root } = useScrollObserver();

  if (typeof window !== 'undefined' && window.location.hash.length > 0) {
    const newThreadId = window.location.hash.split('#')[1];
    if (newThreadId !== selectedThreadId) selectThread(newThreadId);
  }

  const items = useMemo(() => {

    return labels.filter(item => !labelsToIgnore.includes(item.name)).map(item => (
      <Menu.Item key={item.slug}>
        {item.name}
      </Menu.Item>
    ));
  }, [labels]);

  const menuHandler = (e) => {
    window.history.pushState(null, null, `/mail/${selectedMailboxPos}/${e.key}`);
    selectLabel(e.key);
    root.current.scrollTop = 0;
  };

  return (
    <React.Fragment>
      <Affix offsetTop={0} target={() => root.current}>
        <SearchRow>
          <Col>
            <Dropdown trigger={['click']} overlay={<Menu onClick={menuHandler}>{items}</Menu>}>
              <Button block type="link">
                {selectedLabel && selectedLabel.name}
                <Icon type="down" />
              </Button>
            </Dropdown>
          </Col>
        </SearchRow>
      </Affix>
      <Message.Listing selectedThreadId={selectedThreadId} />
    </React.Fragment>
  );
};

const Listing = ({ selectedThreadId }) => {
  const { register, observe, root } = useScrollObserver();
  const { loading, page, edges, before, after } = useScrollWindow();

  const firstElement = useRef(null);
  const lastElement = useRef(null);

  useEffect(() => {
    let didCancel = false;

    if (firstElement.current && lastElement.current) observe([firstElement, lastElement]);

    register((entry) => {
      if (loading || didCancel) return;

      const { cursor } = entry.target.dataset;
      const { cursor: firstCursor } = firstElement.current.dataset;
      const { cursor: lastCursor } = lastElement.current.dataset;

      if (firstCursor === cursor && page.hasPreviousPage && edges.length > 50) {
        after(cursor);
        root.current.scrollTop = 100;
      } else if (lastCursor === cursor && page.hasNextPage) {
        before(cursor);
      }
    });

    return () => { didCancel = true; };
  }, [after, before, edges.length, loading, observe, page, register, root]);

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
        key={cursor}
        cursor={cursor}
        message={message}
        selected={selectedThreadId === id}
        ref={ref}
      />
    );
  });

  return (
    <List>
      {items.length > 0 && items}
      {items.length === 0 && (
        <div>
          <Empty />
        </div>
      )}
    </List>
  );
};

Listing.propTypes = {
  selectedThreadId: PropTypes.string,
};

Listing.defaultProps = {
  selectedThreadId: null,
};

const Item = forwardRef(({ cursor, message, selected }, ref) => {
  const { selectThread } = useMailSelector();
  const { threadId, receivedAt, snippet, headers } = message;
  const displayDate = new Date(receivedAt).toDateString();

  const clickHandler = () => {
    selectThread(threadId);
    window.location.hash = threadId;
  };

  const from = useMemo(() => parseOneAddress(headers.from), [headers.from]);

  const subject = (() => {
    if (headers.subject.startsWith('=?utf-8?Q?')) return quotedPrintable.decode(headers.subject.substring(10, headers.subject.length - 2));
    return headers.subject;
  })();

  const fromName = (() => {
    if (!from.name) return null;
    if (from.name.startsWith('=?utf-8?Q?')) return quotedPrintable.decode(from.name.substring(10, from.name.length - 2));
    return from.name;
  })();

  return (
    <ListItem onClick={clickHandler} selected={selected}>
      <Row type="flex" justify="space-between" align="top" className="mb-1">
        <Col>
          {from ? (
            <Text strong ellipsis>{fromName || from.address}</Text>
          ) : (
            <Text disabled ellipsis>Unknown Sender</Text>
          )}

        </Col>
        <Col align="right">
          <Text ellipsis type="secondary">{displayDate}</Text>
        </Col>
      </Row>

      <StyledText ellipsis>{subject}</StyledText>
      <StyledText ellipsis type="secondary">{snippet}</StyledText>

      <div ref={ref} data-cursor={cursor} />
    </ListItem>
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
      from: PropTypes.string,
      subject: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

Item.defaultProps = {
  selected: false,
};

const Message = {};

Message.Container = React.memo(Container);
Message.Listing = React.memo(Listing);
Message.Item = React.memo(Item, (prevProps, nextProps) => prevProps.cursor === nextProps.cursor && prevProps.selected === nextProps.selected);

Container.whyDidYouRender = true;
Listing.whyDidYouRender = true;
Item.whyDidYouRender = true;

export default Message;
