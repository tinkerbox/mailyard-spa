import React from 'react';

import AccountSelector from '../../google/account-selector';
import LinkButton from '../../link-button';
import styles from '../../../styles';

const RegistrationComponent = () => {
  return (
    <AccountSelector>
      {({ disabled }) => (
        <div className={styles.cardFooter}>
          <LinkButton type="primary" size="large" href="register/step-2" disabled={disabled}>Next</LinkButton>
          <LinkButton type="link" href="/login">Already have an account?</LinkButton>
        </div>
      )}
    </AccountSelector>
  );
};

RegistrationComponent.whyDidYouRender = true;

export default RegistrationComponent;
