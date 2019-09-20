import { some, isEqual } from 'lodash';
import { useEffect, useContext, useCallback, useReducer } from 'react';
import { ApolloContext } from 'react-apollo';
import { useRouter } from 'next/router';

import { useAuth } from './auth-context';

const reducer = (state, action) => {
  switch (action.type) {
    case 'execute':
      return { ...state, loading: true };

    case 'complete':
      if (isEqual(action.payload, state.data)) return { ...state, loading: false };
      return { loading: false, data: action.payload, errors: []};

    case 'error':
      return { loading: false, data: null, errors: action.payload };

    default:
      throw new Error();
  }
};

function useGraphQLQuery(query, options, { auto = true, validate = () => true } = {}) {
  const router = useRouter();
  const { client } = useContext(ApolloContext);
  const { logout } = useAuth();

  const [state, dispatch] = useReducer(reducer, { loading: auto });

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (!state.loading || !validate()) return;
      client.query({
        query,
        ...options,
        fetchPolicy: 'no-cache',
      }).then((resutlset) => {
        if (didCancel) return;
        dispatch({ type: 'complete', payload: resutlset.data });
      }).catch((error) => {
        if (didCancel) return;
        if (!error.graphQLErrors || error.graphQLErrors.length === 0) return;
        const formattedErrors = error.graphQLErrors.map(e => ({ name: e.extensions.exception.name, message: e.message }));
        dispatch({ type: 'error', payload: formattedErrors });
        if (formattedErrors.length > 0 && some(formattedErrors, ['name', 'ForbiddenError'])) {
          logout();
          router.push('/login');
        }
      });
    })();

    return () => { didCancel = true; };
  }, [client, logout, options, query, router, state.loading, validate]);

  const execute = useCallback(() => { dispatch({ type: 'execute' }); }, []);

  return {
    execute,
    ...state,
  };
}

export { useGraphQLQuery };

export default useGraphQLQuery;
