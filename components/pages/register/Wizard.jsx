import React from 'react';
import PropTypes from 'prop-types';

import { Divider, Steps } from 'antd';

const { Step } = Steps;

const Wizard = ({ current }) => {
  return (
    <React.Fragment>

      <Steps size="small" current={current}>
        <Step title="Login with Google" />
        <Step title="Register with Mailyard" />
        <Step title="Sync emails" description="" />
      </Steps>

      <Divider />

    </React.Fragment>
  );
};

Wizard.propTypes = {
  current: PropTypes.number.isRequired,
};

export default Wizard;
