import React from 'react';
import { Typography } from 'antd';

import AccountSelector from '../../../google/account-selector';
import LinkButton from '../../../link-button';
import styles from '../../../../styles';

const { Text } = Typography;

const AddMailboxComponent = () => {
  return (
    <AccountSelector>
      {({ disabled, mailbox }) => (
        <div className={styles.cardFooter}>
          <LinkButton type="primary" size="large" href="/mailboxes/new/config" disabled={disabled}>Next</LinkButton>
          {mailbox && <Text type="warning">This mailbox has already been created.</Text>}
        </div>
      )}
    </AccountSelector>
  );
};

AddMailboxComponent.whyDidYouRender = true;

export default AddMailboxComponent;
