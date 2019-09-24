import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider, Row, Col, Avatar, Statistic } from 'antd';

import Google from './auth-buttons';
import Styled from '../styled';

const { Text } = Typography;

const GoogleProfile = React.memo(({ profile }) => {
  const { name, email, imageUrl } = profile;

  return (
    <Row>
      <Col sm={0} md={4} lg={5} />
      <Col sm={24} md={16} lg={14}>

        <Styled.CardRow>
          <Avatar src={imageUrl} size={48} className="mx-2 mx-md-3" />
          <Statistic title={name} value={email} />
        </Styled.CardRow>

        <Divider />

        <Styled.CardFooter>
          <Google.Logout render={({ onClick }) => <a onClick={onClick} role="button">Switch Account</a>} />
          <Text>Not the account you want to use?</Text>
        </Styled.CardFooter>

      </Col>
      <Col xs={0} sm={2} md={4} lg={6} />
    </Row>
  );
});

GoogleProfile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
};

GoogleProfile.whyDidYouRender = true;

export default GoogleProfile;
