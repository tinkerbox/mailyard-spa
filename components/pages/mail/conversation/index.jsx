import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Empty, Icon, PageHeader, Tag, Card, Avatar, Typography } from 'antd';
import { parseOneAddress } from 'email-addresses';
import styled from 'styled-components';

import ErrorBoundary from '../../../error-boundary';
import { useMailSelector } from '../../../../hooks/mail-selector-context';
import { useGraphQLQuery } from '../../../../hooks/graphql-query';
import { useEmailParser } from '../../../../hooks/email-parser';
import { downloadFile } from '../../../../lib/file-manager';
import Viewer from './viewer';
import decode from '../../../../lib/utf-decoder';

const { Text } = Typography;

const Centralize = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
`;

const StyledThread = styled.div`
  display: flex;
  flex-direction: column;
`;

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
          getRequest
        }
        labels {
          id
          name
          slug
        }
      }
    }
  }
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
  const { selectedMailboxPos, selectedThreadId } = useMailSelector();
  const { parse } = useEmailParser();

  const { loading, data, execute } = useGraphQLQuery(
    THREAD_QUERY,
    {
      variables: {
        position: selectedMailboxPos,
        id: selectedThreadId,
      },
    },
    {
      auto: false,
      validate: useCallback(() => !!selectedThreadId, [selectedThreadId]),
    },
  );

  useEffect(() => {
    let didCancel = false;
    if (!didCancel) execute();
    return () => { didCancel = true; };
  }, [execute, selectedThreadId]);

  const items = data ? data.mailbox.thread.messages.map(m => <Conversation.Item key={m.id} message={m} parse={parse} />) : [];

  return (
    <React.Fragment>

      {selectedThreadId && loading && (
        <Centralize>
          <Icon type="loading" />
        </Centralize>
      )}

      {!selectedThreadId && (
        <Centralize>
          <Empty description="" />
        </Centralize>
      )}

      {items.length > 0 && <Conversation.Listing thread={data.mailbox.thread}>{items}</Conversation.Listing>}

    </React.Fragment>
  );
};

const Listing = ({ thread, children }) => {
  const { labels } = thread;

  const subject = decode(thread.subject);

  const tags = labels.filter(item => !labelsToIgnore.includes(item.name)).map(label => <Tag key={label.id}>{label.name}</Tag>);
  return (
    <StyledThread>
      <PageHeader title={subject} tags={tags} />
      <div className="p-3">{children}</div>
    </StyledThread>
  );
};

Listing.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
    labels: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

const Item = ({ message, parse }) => {
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState();
  const { receivedAt, headers, getRequest } = message;
  const from = parseOneAddress(headers.from);

  useEffect(() => {
    let didCancel = false;
    (async () => {
      const file = await downloadFile(getRequest);
      if (!didCancel) {
        setPayload(file);
        setLoading(false);
      }
    })();
    return () => { didCancel = true; };
  }, [getRequest]);

  const fromName = decode(from.name);

  const sender = from ? (
    <React.Fragment>
      <Avatar size="small" className="mr-2">{from.name ? from.name[0] : from.address[0]}</Avatar>
      {from.name && (
        <span>
          <Text strong>{fromName}</Text>
          <Text type="secondary">{` <${from.address}>`}</Text>
        </span>
      )}
      {!from.name && <Text>{from.address}</Text>}
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Avatar icon="question" size="small" className="mr-2" />
      <Text>Unknown Sender</Text>
    </React.Fragment>
  );

  const title = (
    <React.Fragment>
      {sender}
    </React.Fragment>
  );

  const extra = <Text type="secondary">{new Date(receivedAt).toString()}</Text>;

  return (
    <Card size="small" className="mb-3" title={title} extra={extra} loading={loading}>
      <ErrorBoundary>
        {loading && <Icon type="loading" />}
        {!loading && <Viewer payload={payload} parse={parse} />}
      </ErrorBoundary>
    </Card>
  );
};

Item.propTypes = {
  parse: PropTypes.func.isRequired,
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    receivedAt: PropTypes.string.isRequired,
    getRequest: PropTypes.string.isRequired,
    headers: PropTypes.shape({
      from: PropTypes.string,
    }).isRequired,
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
