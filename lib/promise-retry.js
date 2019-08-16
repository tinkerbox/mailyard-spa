const DEFAULT_RETRIES = 3;

const retry = (fn, retries = DEFAULT_RETRIES, error = null) => {
  if (retries === 0) return Promise.reject(error);
  return fn().catch(_error => retry(fn, (retries - 1), _error));
};

export { retry };
export default retry;
