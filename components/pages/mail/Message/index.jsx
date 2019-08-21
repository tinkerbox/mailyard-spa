import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';
import { List, Icon, Empty } from 'antd';

import { makeStyles } from '../../../../styles';
import custom from './styles.css';

const styles = makeStyles(custom);

const MESSAGES_QUERY = gql`
  query ($position: Int!) {
    mailbox(position: $position) {
      id
      messages {
        id
        receivedAt
      }
    }
  }
`;

const Container = ({ query }) => {
  const { client } = useContext(ApolloContext);
  const [messages, setMessages] = useState();

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (!query.mailboxPos) return;

      const results = await client.query({
        query: MESSAGES_QUERY,
        variables: {
          position: parseInt(query.mailboxPos, 10),
        },
      });

      if (!didCancel) setMessages(results.data.mailbox.messages);
    })();

    return () => { didCancel = true; };
  }, [client, query.mailboxPos]);

  return (
    <React.Fragment>

      {(!query.mailboxPos) && ( // if loading
        <div className={styles.use('centralize')}>
          <Icon type="loading" />
        </div>
      )}

      {query.mailboxPos && false && ( // if empty
        <Empty />
      )}

      {query.mailboxPos && messages && ( // if not empty
        <Listing messages={messages} />
      )}

    </React.Fragment>
  );
};

Container.propTypes = {
  query: PropTypes.shape({
    mailboxPos: PropTypes.string,
    labelId: PropTypes.string,
  }).isRequired,
};

const Listing = ({ messages }) => {
  const items = messages.map(({ id, receivedAt }) => <Detail key={id} content={receivedAt} />);
  return (
    <List>
      {items}
    </List>
  );
};

Listing.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
};

const Detail = ({ content }) => {
  const receivedAt = new Date(content);
  return (
    <List.Item onClick={() => alert('asd')}>{receivedAt.toDateString()}</List.Item>
  );
};

Detail.propTypes = {
  content: PropTypes.string.isRequired,
};

const Message = {};

Message.Container = Container;
Message.Listing = Listing;
Message.Detail = Detail;

export default Message;
