import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Typography, Progress } from 'antd';

import Button from '../../Button';
import styles from '../../../styles';

import { useMessageSynchronizer } from '../../../hooks/message-synchronizer';

const { Text } = Typography;

const SyncProgress = ({ mailboxId, messagesTotal, onFinish }) => {
  const { status, count, start } = useMessageSynchronizer(mailboxId);

  const progress = Math.round(count / messagesTotal * 100);

  useEffect(() => {
    let didCancel = true;
    if (status === 'finished' && !didCancel) onFinish();
    return () => { didCancel = true; };
  }, [status, onFinish]);

  return (
    <React.Fragment>

      { status === 'waiting' && (
        <div className={styles.cardRow}>
          <Button type="primary" size="large" onClick={() => start()}>Start Sync</Button>
        </div>
      )}

      {status === 'running' && (
        <React.Fragment>
          <Progress percent={progress} status="active" />
          <br />
          <Text>{`${count.toLocaleString()} of ${messagesTotal.toLocaleString()} messages.`}</Text>
        </React.Fragment>
      )}

      {status === 'finished' && (
        <Progress percent={progress} />
      )}

    </React.Fragment>
  );
};

SyncProgress.propTypes = {
  mailboxId: PropTypes.string.isRequired,
  messagesTotal: PropTypes.number.isRequired,
  onFinish: PropTypes.func.isRequired,
};

SyncProgress.whyDidYouRender = true;

export default SyncProgress;
