import { useState, useEffect } from 'react';

import { useGoogle } from './google-context';

function useGoogleQuery(query, params = []) {
  const { api } = useGoogle();
  const [state, setState] = useState({ loading: true, data: null });

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (!api || !state.loading) return;
      const results = await api[query](...params);
      if (!didCancel) setState({ loading: false, data: results.result });
    })();

    return () => { didCancel = true; };
  }, [api, params, query, state.loading]);

  return [state.data, state.loading];
}

export { useGoogleQuery };

export default useGoogleQuery;
