import { find } from 'lodash';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
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

  const [selectedMailboxPos, _selectMailboxByPos] = useState(initialMailboxPos);
  const [selectedLabelSlug, _selectLabelBySlug] = useState(initialLabelSlug);
  const [selectedThreadId, _selectThreadById] = useState(initialThreadId);

  const { data, execute } = useGraphQLQuery(LABELS_QUERY, {
    variables: {
      position: selectedMailboxPos,
    },
  }, { auto: false });

  useEffect(() => {
    let didCancel = false;
    if (!didCancel) execute();
    return () => { didCancel = true; };
  }, [execute]);

  const labels = useMemo(() => (data ? data.mailbox.labels : []), [data]);

  const selectMailboxByPos = useCallback(_selectMailboxByPos, []);
  const selectLabelBySlug = useCallback(_selectLabelBySlug, []);
  const selectThreadById = useCallback(_selectThreadById, []);

  const selectedLabel = useMemo(() => find(labels, { slug: selectedLabelSlug }), [labels, selectedLabelSlug]);

  const values = useMemo(() => ({
    labels,
    selectedMailboxPos,
    selectMailboxByPos,
    selectedLabel,
    selectedLabelSlug,
    selectLabelBySlug,
    selectedThreadId,
    selectThreadById,
  }), [labels, selectLabelBySlug, selectMailboxByPos, selectThreadById, selectedLabel, selectedLabelSlug, selectedMailboxPos, selectedThreadId]);

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
