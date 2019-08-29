import { some, isEqual } from 'lodash';
import { useState, useEffect, useContext } from 'react';
import { ApolloContext } from 'react-apollo';
import { useRouter } from 'next/router';

import { useAuth } from './auth-context';

function useGraphQLQuery(query, options, { validate = () => true } = {}) {
  const router = useRouter();
  const { client } = useContext(ApolloContext);
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState();

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (!validate()) return;

      try {
        const results = await client.query({ query, ...options });
        if (!didCancel && !isEqual(data, results.data)) setData(results.data);
      } catch (error) {
        if (!didCancel) {
          if (!error.graphQLErrors) return;

          const formattedErrors = error.graphQLErrors.map(e => ({ name: e.extensions.exception.name, message: e.message }));
          setErrors(formattedErrors);

          if (formattedErrors.length > 0 && some(formattedErrors, ['name', 'ForbiddenError'])) {
            logout();
            router.push('/login');
          }
        }
      } finally {
        if (!didCancel) setLoading(false);
      }
    })();

    return () => { didCancel = true; };
  }, [client, query, options, validate, logout, router, data]);

  return { loading, data, errors };
}

export { useGraphQLQuery };

export default useGraphQLQuery;
