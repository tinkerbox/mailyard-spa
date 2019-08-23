import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MailSelectorContext = React.createContext();

const MailSelectorProvider = ({ initialMailboxPos, initialLabelSlug, initialThreadId, ...props }) => {
  const [selectedMailboxPos, selectMailboxByPos] = useState(initialMailboxPos);
  const [selectedLabelSlug, selectLabelBySlug] = useState(initialLabelSlug);
  const [selectedThreadId, selectThreadById] = useState(initialThreadId);

  const values = {
    selectedMailboxPos,
    selectMailboxByPos,
    selectedLabelSlug,
    selectLabelBySlug,
    selectedThreadId,
    selectThreadById,
  };

  return <MailSelectorContext.Provider value={values} {...props} />;
};

MailSelectorProvider.propTypes = {
  initialMailboxPos: PropTypes.number.isRequired,
  initialLabelSlug: PropTypes.string.isRequired,
  initialThreadId: PropTypes.string,
};

MailSelectorProvider.defaultProps = {
  initialThreadId: null,
};

const useMailSelector = () => React.useContext(MailSelectorContext);

export { MailSelectorProvider, useMailSelector };
