import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Empty, Icon, PageHeader, Tag, Card, Avatar, Typography } from 'antd';
import { parseOneAddress } from 'email-addresses';

import ErrorBoundary from '../../../error-boundary';
import { useMailSelector } from '../../../../hooks/mail-selector-context';
import { useGraphQLQuery } from '../../../../hooks/graphql-query';
import { useEmailParser } from '../../../../hooks/email-parser';
import { makeStyles } from '../../../../styles';
import { downloadFile } from '../../../../lib/file-manager';
import custom from './styles.css';
import Viewer from './viewer';

const styles = makeStyles(custom);
const { Text } = Typography;

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

const Container = () => {
  const { selectedMailboxPos, selectedThreadId } = useMailSelector();
  const { parse } = useEmailParser();

  const { loading, data } = useGraphQLQuery(
    THREAD_QUERY,
    {
      variables: {
        position: selectedMailboxPos,
        id: selectedThreadId,
      },
    },
    {
      validate: useCallback(() => !!selectedThreadId, [selectedThreadId]),
    },
  );

  const items = data ? data.mailbox.thread.messages.map(m => <Conversation.Item key={m.id} message={m} parse={parse} />) : [];

  return (
    <React.Fragment>

      {selectedThreadId && loading && (
        <div className={styles.use('centralize')}>
          <Icon type="loading" />
        </div>
      )}

      {!selectedThreadId && (
        <div className={styles.use('centralize')}>
          <Empty description="" />
        </div>
      )}

      {items.length > 0 && <Conversation.Listing thread={data.mailbox.thread}>{items}</Conversation.Listing>}

    </React.Fragment>
  );
};

const Listing = ({ thread, children }) => {
  const { labels } = thread;
  const tags = labels.map(label => <Tag key={label.id}>{label.name}</Tag>);
  return (
    <div className={styles.thread}>
      <PageHeader title={thread.subject} tags={tags} />
      <div className={styles.use('p-3')}>{children}</div>
    </div>
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
  const from = parseOneAddress(headers.From);

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

  const title = (
    <React.Fragment>
      <Avatar size="small" className={styles.use('mr-2')}>{from.name[0]}</Avatar>

      {from.name && (
        <span>
          <Text strong>{from.name}</Text>
          <Text type="secondary">{` <${from.address}>`}</Text>
        </span>
      )}

      {!from.name && <Text>{from.address}</Text>}

    </React.Fragment>
  );

  const extra = <Text type="secondary">{new Date(receivedAt).toString()}</Text>;

  return (
    <Card size="small" className={styles.use('mb-3', 'item')} title={title} extra={extra} loading={loading}>
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
      From: PropTypes.string,
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
