import { useState, useEffect, useContext } from 'react';
import { ApolloContext } from 'react-apollo';

function useGraphQLQuery(query, options, valid = () => true) {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState();

  const { client } = useContext(ApolloContext);

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (!valid()) return;
      try {
        const results = await client.query({ query, ...options });
        if (!didCancel) setData(results.data);
      } catch (error) {
        const formattedErrors = error.graphQLErrors.map(e => ({ name: e.extensions.exception.name, message: e.message }));
        if (!didCancel) setErrors(formattedErrors);
      } finally {
        setLoading(false);
      }
    })();

    return () => { didCancel = true; };
  }, [client, query, options, valid]);

  return { loading, data, errors };
}

export { useGraphQLQuery };

export default useGraphQLQuery;
