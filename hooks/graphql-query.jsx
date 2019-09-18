import { some, isEqual } from 'lodash';
import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { ApolloContext } from 'react-apollo';
import { useRouter } from 'next/router';

import { useAuth } from './auth-context';

function useGraphQLQuery(query, options, { auto = true, validate = () => true } = {}) {
  const router = useRouter();
  const { client } = useContext(ApolloContext);
  const { logout } = useAuth();
  const loading = useRef(false);
  const [results, setResults] = useState({
    pending: auto,
    data: null,
    errors: [],
  });

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (loading.current) return; // skip if already loading
      if (!results.pending) return; // skip if don't need to execute
      if (!validate()) return; // skip if validation failed

      loading.current = true;

      try {
        const resultset = await client.query({
          query,
          ...options,
          fetchPolicy: 'no-cache',
        });

        if (didCancel) return;
        loading.current = false;
        setResults((prev) => {
          if (isEqual(resultset.data, results.data)) return { ...prev, pending: false };
          return { pending: false, data: resultset.data, errors: [] };
        });
      } catch (error) {
        if (!error.graphQLErrors || error.graphQLErrors.length === 0) return;

        const formattedErrors = error.graphQLErrors.map(e => ({ name: e.extensions.exception.name, message: e.message }));
        loading.current = false;
        setResults({ pending: false, data: null, errors: formattedErrors });

        if (formattedErrors.length > 0 && some(formattedErrors, ['name', 'ForbiddenError'])) {
          logout();
          router.push('/login');
        }
      }
    })();

    return () => { didCancel = true; };
  }, [client, logout, options, query, results, results.data, results.execute, router, validate]);

  const execute = useCallback(() => {
    if (!loading.current) setResults(prev => ({ ...prev, pending: true }));
  }, []);

  return {
    execute,
    ...results,
  };
}

export { useGraphQLQuery };

export default useGraphQLQuery;
