import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MailSelectorContext = React.createContext();

const MailSelectorProvider = ({ initialMailboxPos, initialLabelId, initialThreadId, ...props }) => {
  const [selectedMailboxPos, selectMailboxByPos] = useState(initialMailboxPos);
  const [selectedLabelId, selectLabelById] = useState(initialLabelId);
  const [selectedThreadId, selectThreadById] = useState(initialThreadId);

  const values = {
    selectedMailboxPos,
    selectMailboxByPos,
    selectedLabelId,
    selectLabelById,
    selectedThreadId,
    selectThreadById,
  };

  return <MailSelectorContext.Provider value={values} {...props} />;
};

MailSelectorProvider.propTypes = {
  initialMailboxPos: PropTypes.number.isRequired,
  initialLabelId: PropTypes.string.isRequired,
  initialThreadId: PropTypes.string,
};

MailSelectorProvider.defaultProps = {
  initialThreadId: null,
};

const useMailSelector = () => React.useContext(MailSelectorContext);

export { MailSelectorProvider, useMailSelector };
