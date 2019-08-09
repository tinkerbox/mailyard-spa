import { useState, useEffect } from 'react';

function useGoogleQuery(api, query) {
  const [result, setResult] = useState({});

  useEffect(() => {
    let didCancel = false;
    (async () => {
      if (api) {
        const results = await query();
        if (!didCancel) setResult(results.result);
      }
    })();
    return () => { didCancel = true; };
  }, [api, query]);

  return result;
}

export { useGoogleQuery };

export default useGoogleQuery;
