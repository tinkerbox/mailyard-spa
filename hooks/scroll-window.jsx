import { reverse, isEqual } from 'lodash';
import { useReducer, useEffect, useContext, useCallback, useRef } from 'react';
import gql from 'graphql-tag';
import { ApolloContext } from 'react-apollo';

import { useMailSelector } from './mail-selector-context';

const PER_PAGE = 50;
const WINDOW_SIZE = 200;

const MESSAGES_QUERY = gql`
  query ($position: Int!, $labelId: ID!, $before: String, $after: String, $first: Int, $last: Int) {
    mailbox(position: $position) {
      id
      label(id: $labelId) {
        id
        threads(before: $before, after: $after, first: $first, last: $last) {
          page {
            hasNextPage
            hasPreviousPage
            cursorStart
            cursorEnd
          }
          edges {
            cursor
            node {
              id
              message {
                id
                threadId
                receivedAt
                snippet
                headers
              }
            }
          }
        }
      }
    }
  }
`;

const initialState = {
  loading: true,
  query: {},
  edges: [],
  page: {},
};

const processResults = (state, action) => {
  const { threads, reset } = action.payload;
  let { hasNextPage, hasPreviousPage } = state.page;

  if (reset || (!state.query.before && !state.query.after)) return threads;
  if (threads.edges.length === 0) return { ...state, page: threads.page };

  if (state.query.before) {
    state.edges.push(...threads.edges);
    state.edges.splice(0, state.edges.length - WINDOW_SIZE);
    hasPreviousPage = true;
  } else if (state.query.after) {
    state.edges.unshift(...reverse(threads.edges));
    state.edges.splice(-PER_PAGE, state.edges.length - WINDOW_SIZE);
    hasNextPage = true;
  }

  return {
    edges: state.edges,
    page: {
      hasNextPage,
      hasPreviousPage,
      cursorStart: state.edges.length > 0 ? state.edges[0].cursor : null,
      cursorEnd: state.edges.length > 0 ? state.edges[state.edges.length - 1].cursor : null,
    },
  };
};

const reducer = (state, action) => {
  const newState = (() => {
    switch (action.type) {
      case 'reload':
        return { ...state, loading: true };

      case 'query': {
        const next = { ...state, loading: true };
        if (isEqual(action.payload, state.query)) return { ...next, query: state.query };
        return { ...next, query: action.payload };
      }

      case 'process':
        return { ...state, loading: false, ...processResults(state, action) };

      default:
        throw new Error();
    }
  })();

  if (isEqual(state, newState)) return state;
  return newState;
};

function useScrollWindow() {
  const { labels, selectedLabel, selectedMailboxPos } = useMailSelector();
  const { client } = useContext(ApolloContext);
  const lastLabelId = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const labelId = selectedLabel ? selectedLabel.id : null;

  useEffect(() => dispatch({ type: 'reload' }), [selectedMailboxPos]);

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (!didCancel && labelId && lastLabelId.current !== labelId && !state.loading) {
        dispatch({ type: 'query', payload: { loading: true } });
        return;
      }

      if (!state.loading || !labelId) return;

      const variables = {
        position: selectedMailboxPos,
        labelId,
        ...state.query,
      };

      const results = await client.query({
        query: MESSAGES_QUERY,
        variables,
        fetchPolicy: 'no-cache',
      });

      if (!didCancel) {
        const payload = {
          threads: results.data.mailbox.label.threads,
          reset: lastLabelId.current !== labelId,
        };

        dispatch({ type: 'process', payload });
        lastLabelId.current = labelId;
      }
    })();

    return () => { didCancel = true; };
  }, [client, labelId, labels, selectedMailboxPos, state.loading, state.query]);

  const before = useCallback(cursor => dispatch({ type: 'query', payload: { before: cursor, first: PER_PAGE } }), []);
  const after = useCallback(cursor => dispatch({ type: 'query', payload: { after: cursor, last: PER_PAGE } }), []);

  const { loading, edges, page } = state;

  return {
    loading,
    edges,
    page,
    before,
    after,
  };
}

export { useScrollWindow };

export default useScrollWindow;
