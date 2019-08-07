import React from 'react';

import { Divider, Steps } from 'antd';

const { Step } = Steps;

const Wizard = (props) => {
  return (
    <React.Fragment>

      <Steps size='small' current={props.current}>
        <Step title='Login with Google' />
        <Step title='Register with Mailyard' />
        <Step title='Sync emails' description='' />
      </Steps>

      <Divider />

    </React.Fragment>
  );
};

export default Wizard;
