import { find, reverse } from 'lodash';
import { useState, useEffect, useContext, useCallback } from 'react';
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

function useScrollWindow() {
  const { labels, selectedMailboxPos, selectedLabelSlug } = useMailSelector();
  const { client } = useContext(ApolloContext);
  const [query, setQuery] = useState({});
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ edges: [], page: { cursorStart: null, cursorEnd: null } });

  const labelId = labels.length > 0 ? find(labels, { slug: selectedLabelSlug }).id : null;

  useEffect(() => {
    let didCancel = false;

    (async () => {
      const variables =  {
        position: selectedMailboxPos,
        labelId,
        ...query,
      };

      const results = await client.query({
        query: MESSAGES_QUERY,
        variables,
        fetchPolicy: 'no-cache',
      });

      if (!didCancel) {
        const next = results.data.mailbox.label.threads;

        if (next.edges.length !== 0) {
          if (query.before) {
            setData((prev) => {
              prev.edges.push(...next.edges);
              prev.edges.splice(0, prev.edges.length - WINDOW_SIZE);
              const { hasNextPage } = next.page;
              const page = {
                ...prev.page,
                hasNextPage,
                hasPreviousPage: true,
                cursorStart: prev.edges.length > 0 ? prev.edges[0].cursor : null,
                cursorEnd: prev.edges.length > 0 ? prev.edges[prev.edges.length - 1].cursor : null,
              };
              return { ...prev, page };
            });
          } else if (query.after) {
            setData((prev) => {
              prev.edges.unshift(...reverse(next.edges));
              prev.edges.splice(-PER_PAGE, prev.edges.length - WINDOW_SIZE);
              const { hasPreviousPage } = next.page;
              const page = {
                ...prev.page,
                hasNextPage: true,
                hasPreviousPage,
                cursorStart: prev.edges.length > 0 ? prev.edges[0].cursor : null,
                cursorEnd: prev.edges.length > 0 ? prev.edges[prev.edges.length - 1].cursor : null,
              };
              return { ...prev, page };
            });
          } else {
            setData(next);
          }
        } else {
          setData(prev => ({ ...prev, page: next.page }));
        }

        setLoading(false);
      }
    })();

    return () => { didCancel = true; };
  }, [client, labelId, query, selectedMailboxPos]);

  const { edges, page } = data;

  return {
    loading,
    edges,
    page,
    before: useCallback((cursor) => {
      if (loading) return;
      setLoading(true);
      setQuery({ before: cursor, first: PER_PAGE });
    }, [loading]),
    after: useCallback((cursor) => {
      if (loading) return;
      setLoading(true);
      setQuery({ after: cursor, last: PER_PAGE });
    }, [loading]),
  };
}

export { useScrollWindow };

export default useScrollWindow;
