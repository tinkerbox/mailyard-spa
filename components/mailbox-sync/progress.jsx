import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Typography, Progress, Button } from 'antd';

import styles from '../../styles';
import { useMessageSynchronizer } from '../../hooks/message-synchronizer';

const { Text } = Typography;

const SyncProgress = React.memo(({ mailboxId, messagesTotal, updateStatus }) => {
  const { status, count, start } = useMessageSynchronizer(mailboxId);

  const progress = Math.round(count / messagesTotal * 100);

  useEffect(() => {
    let didCancel = false;
    if (status === 'finished' && !didCancel) updateStatus('finished');
    return () => { didCancel = true; };
  }, [status, updateStatus]);

  const startSync = useCallback(() => {
    updateStatus('running');
    start();
  }, [start, updateStatus]);

  return (
    <React.Fragment>

      {status === 'waiting' && (
        <div className={styles.cardRow}>
          <Button type="primary" size="large" onClick={startSync}>Start Sync</Button>
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
        <React.Fragment>
          <Progress percent={progress} />
          <br />
          <Text>Sync complete!</Text>
        </React.Fragment>
      )}

    </React.Fragment>
  );
});

SyncProgress.propTypes = {
  mailboxId: PropTypes.string.isRequired,
  messagesTotal: PropTypes.number.isRequired,
  updateStatus: PropTypes.func.isRequired,
};

SyncProgress.whyDidYouRender = true;

export default SyncProgress;
