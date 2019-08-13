import React from 'react';
import PropTypes from 'prop-types';

import { Typography, Divider, Row, Col, Avatar, Statistic } from 'antd';

import Google from '../../Google';

import styles from '../../../styles';

const { Text } = Typography;

const GoogleProfile = ({ profile }) => {
  const { name, email, imageUrl } = profile;

  return (
    <Row>
      <Col sm={0} md={4} lg={5} />
      <Col sm={24} md={16} lg={14}>

        <div className={styles.cardRow}>
          <Avatar src={imageUrl} size={48} className={`${styles['mx-2']} ${styles['mx-md-3']} `} />
          <Statistic title={name} value={email} />
        </div>

        <Divider />

        <div className={styles.cardFooter}>
          <Google.Logout render={({ onClick }) => <a onClick={onClick} role="button">Switch Account</a>} />
          <Text>Not the account you want to use?</Text>
        </div>

      </Col>
      <Col xs={0} sm={2} md={4} lg={6} />
    </Row>
  );
};

GoogleProfile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default GoogleProfile;
