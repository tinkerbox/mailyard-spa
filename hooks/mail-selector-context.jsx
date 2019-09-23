import { find, isEqual } from 'lodash';
import React, { useReducer, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { useGraphQLQuery } from './graphql-query';
import { useAuth } from './auth-context';

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

const reducer = (state, { type, payload }) => {
  const newState = (() => {
    switch (type) {
      case 'select-mailbox': {
        const mailbox = find(payload.account.mailboxes, { position: payload.position });
        return {
          selectedMailboxPos: mailbox.position,
          selectedLabelSlug: mailbox.defaultLabel.slug,
          selectedThreadId: null,
        };
      }

      case 'select-label': {
        return {
          ...state,
          selectedLabelSlug: payload.slug,
          selectedThreadId: null,
        };
      }

      case 'select-thread': {
        return {
          ...state,
          selectedThreadId: payload.id,
        };
      }

      default:
        throw new Error();
    }
  })();

  if (isEqual(state, newState)) return state;
  return newState;
};

const MailSelectorContext = React.createContext();

const MailSelectorProvider = (props) => {
  const { initialMailboxPos, initialLabelSlug, initialThreadId, ...rest } = props;
  const { account } = useAuth();

  const initialState = {
    selectedMailboxPos: initialMailboxPos,
    selectedLabelSlug: initialLabelSlug,
    selectedThreadId: initialThreadId,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const { data, execute } = useGraphQLQuery(LABELS_QUERY, {
    variables: {
      position: state.selectedMailboxPos,
    },
  }, { auto: false });

  useEffect(() => {
    let didCancel = false;
    if (!didCancel) execute();
    return () => { didCancel = true; };
  }, [execute]);

  const selectMailbox = useCallback(position => dispatch({ type: 'select-mailbox', payload: { account, position } }), [account]);
  const selectLabel = useCallback(slug => dispatch({ type: 'select-label', payload: { account, slug } }), [account]);
  const selectThread = useCallback(id => dispatch({ type: 'select-thread', payload: { account, id } }), [account]);

  const labels = useMemo(() => (data ? data.mailbox.labels : []), [data]);
  const selectedLabel = useMemo(() => find(labels, { slug: state.selectedLabelSlug }), [labels, state.selectedLabelSlug]);

  const values = useMemo(() => ({
    labels,
    ...state,
    selectMailbox,
    selectLabel,
    selectThread,
    selectedLabel,
  }), [labels, selectLabel, selectMailbox, selectThread, selectedLabel, state]);

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
