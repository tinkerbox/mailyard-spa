import { useState, useEffect } from 'react';

// TODO: rewrite this to simply take in the function
function useGoogleQuery(api, query) {
  const [result, setResult] = useState({});
  const [status, setStatus] = useState('waiting');

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (!api) return;

      setStatus('running');
      const results = await query();

      if (!didCancel) {
        setResult(results.result);
        setStatus('done');
      }
    })();

    return () => { didCancel = true; };
  }, [api, query]);

  return [result, status];
}

export { useGoogleQuery };

export default useGoogleQuery;
