import React from 'react';
import PropTypes from 'prop-types';

import { times } from 'lodash';
import { List, Icon, Empty } from 'antd';

import { makeStyles } from '../../../../styles';

import custom from './styles.css';

const styles = makeStyles(custom);

const Container = ({ query }) => {
  // TODO: perform query, and get threads


  return (
    <React.Fragment>

      {!query.mailboxPos && ( // if loading
        <div className={styles.use('centralize')}>
          <Icon type="loading" />
        </div>
      )}

      {query.mailboxPos && false && ( // if empty
        <Empty />
      )}

      {query.mailboxPos && true && ( // if not empty
        <Listing />
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

const Listing = () => {
  const threads = times(30, i => <Detail key={i} content="Hello" />);
  return (
    <List>
      {threads}
    </List>
  );
};

const Detail = ({ content }) => {
  return (
    <List.Item>{content}</List.Item>
  );
};

Detail.propTypes = {
  content: PropTypes.string.isRequired,
};

const Thread = {};

Thread.Container = Container;
Thread.Listing = Listing;
Thread.Detail = Detail;

export default Thread;
