import React from 'react';
import PropTypes from 'prop-types';

import { times } from 'lodash';

import { List, Empty, Icon } from 'antd';

import { makeStyles } from '../../../../styles';

import custom from './styles.css';

const styles = makeStyles(custom);

const Container = ({ query }) => {
  // TODO: perform query, and get conversation
  return (
    <div className={styles.use('p-4', 'centralize')}>

      {!query.mailboxPos && ( // if loading
        <div className={styles.use('centralize')}>
          <Icon type="loading" />
        </div>
      )}

      {query.mailboxPos && false && ( // empty
        <Empty />
      )}

      {query.mailboxPos && true && ( // empty
        <Listing />
      )}

    </div>
  );
};

Container.propTypes = {
  query: PropTypes.shape({
    mailboxPos: PropTypes.string,
    labelId: PropTypes.string,
  }).isRequired,
};

const Listing = () => {
  const mesages = times(30, i => <Message key={i} content="Hello" />);
  return (
    <React.Fragment>
      <List>
        {mesages}
      </List>
    </React.Fragment>
  );
};

const Message = ({ content }) => {
  return (
    <List.Item>{content}</List.Item>
  );
};

Message.propTypes = {
  content: PropTypes.string.isRequired,
};

const Conversation = {};

Conversation.Container = Container;
Conversation.Listing = Listing;
Conversation.Message = Message;

export default Conversation;
