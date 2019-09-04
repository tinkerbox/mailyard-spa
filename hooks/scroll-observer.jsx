/* globals IntersectionObserver */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const THRESHOLD = 1.0;

const ScrollObserver = React.createContext();

const ScrollProvider = ({ targetRef, children, ...props }) => {
  const observer = useRef(null);
  const callback = useRef(null);
  const [targets, setTargets] = useState([]);

  const handler = useCallback((entries) => {
    if (!callback.current) return;
    entries.forEach((entry) => {
      if (entry.isIntersecting) callback.current(entry);
    });
  }, []);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handler, {
      root: targetRef.current,
      threshold: THRESHOLD,
    });

    targets.forEach(target => observer.current.observe(target.current));

    const { current: currentObserver } = observer;
    return () => currentObserver.disconnect();
  }, [handler, targetRef, targets]);

  const observe = useCallback((_targets) => {
    if (observer.current) setTargets(_targets);
  }, []);

  const register = useCallback((_listener) => { callback.current = _listener; }, []);

  const values = useMemo(() => ({
    observe,
    register,
  }), [observe, register]);

  return (
    <ScrollObserver.Provider value={values} {...props}>
      {children}
    </ScrollObserver.Provider>
  );
};

ScrollProvider.propTypes = {
  targetRef: PropTypes.shape({
    current: PropTypes.object,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

const useScrollObserver = () => React.useContext(ScrollObserver);

export { ScrollProvider, useScrollObserver };
