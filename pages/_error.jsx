import React from 'react';
import PropTypes from 'prop-types';

import { Result, Button } from 'antd';

const ERROR_LOOKUP = {
  403: {
    title: 'Forbidden',
    subTitle: 'You are not authorized to access this page.',
  },
  404: {
    title: 'Page not Found',
    subTitle: 'Sorry, the page you visited does not exist.',
  },
  500: {
    title: 'Server Error',
    subTitle: 'Sorry, something went wrong.',
  },
};

class Error extends React.Component {
  static getInitialProps({ res, err }) {
    if (res) return { statusCode: res.statusCode };
    if (err) return { statusCode: err.statusCode };
    return 403;
  }

  render() {
    const { statusCode } = this.props;

    if (statusCode && statusCode in ERROR_LOOKUP) {
      const { title, subTitle } = ERROR_LOOKUP[statusCode];
      return (
        <Result
          status={statusCode.toString()}
          title={title}
          subTitle={subTitle}
          extra={<Button type="primary" size="large" href="/"><a>Home</a></Button>}
        />
      );
    }

    return (
      <React.Fragment>
        <p>Something went wrong.</p>
      </React.Fragment>
    );
  }
}

Error.defaultProps = {
  statusCode: null,
};

Error.propTypes = {
  statusCode: PropTypes.number,
};

export default Error;
