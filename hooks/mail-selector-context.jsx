import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { useGraphQLQuery } from './graphql-query';

const LABELS_QUERY = gql`
  query ($position: Int!) {
    mailbox(position: $position) {
      id
      labels {
        id
        name
        slug
      }
    }
  }
`;

const MailSelectorContext = React.createContext();

const MailSelectorProvider = (props) => {
  const { initialMailboxPos, initialLabelSlug, initialThreadId, ...rest } = props;

  const [selectedMailboxPos, selectMailboxByPos] = useState(initialMailboxPos);
  const [selectedLabelSlug, selectLabelBySlug] = useState(initialLabelSlug);
  const [selectedThreadId, selectThreadById] = useState(initialThreadId);

  const { loading, data } = useGraphQLQuery(LABELS_QUERY, {
    variables: {
      position: selectedMailboxPos,
    },
  });

  const values = {
    labels: loading ? [] : data.mailbox.labels,
    selectedMailboxPos,
    selectMailboxByPos,
    selectedLabelSlug,
    selectLabelBySlug,
    selectedThreadId,
    selectThreadById,
  };

  if (loading) return <p>Loading...</p>;

  return <MailSelectorContext.Provider value={values} {...rest} />;
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
