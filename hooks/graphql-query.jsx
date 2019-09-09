import { some, isEqual } from 'lodash';
import { useState, useEffect, useContext, useCallback } from 'react';
import { ApolloContext } from 'react-apollo';
import { useRouter } from 'next/router';

import { useAuth } from './auth-context';

function useGraphQLQuery(query, options, { auto = true, validate = () => true } = {}) {
  const router = useRouter();
  const { client } = useContext(ApolloContext);
  const { logout } = useAuth();
  const [results, setResults] = useState({ loading: auto, data: null, errors: [] });

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (results.loading && !validate()) return;

      try {
        const resultset = await client.query({ query, ...options });
        if (didCancel || isEqual(resultset.data, results.data)) return;
        setResults({ loading: false, data: resultset.data, errors: [] });
      } catch (error) {
        if (!error.graphQLErrors || error.graphQLErrors.length === 0) return;

        const formattedErrors = error.graphQLErrors.map(e => ({ name: e.extensions.exception.name, message: e.message }));
        setResults({ loading: false, data: null, errors: formattedErrors });

        if (formattedErrors.length > 0 && some(formattedErrors, ['name', 'ForbiddenError'])) {
          logout();
          router.push('/login');
        }
      }
    })();

    return () => { didCancel = true; };
  }, [client, logout, options, query, results.data, results.loading, router, validate]);

  const execute = useCallback(() => setResults(prev => ({ ...prev, loading: true })), []);

  return {
    execute,
    ...results,
  };
}

export { useGraphQLQuery };

export default useGraphQLQuery;
