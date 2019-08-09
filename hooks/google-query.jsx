import { useState, useEffect } from 'react';

function useGoogleQuery(api, query) {
  const [result, setResult] = useState({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let didCancel = false;
    (async () => {
      if (!api) return;
      const results = await query();
      if (!didCancel) {
        setResult(results.result);
        setFinished(true);
      }
    })();
    return () => { didCancel = true; };
  }, [api, query]);

  return [result, finished];
}

export { useGoogleQuery };

export default useGoogleQuery;
