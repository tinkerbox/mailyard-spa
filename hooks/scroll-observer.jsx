/* globals IntersectionObserver */

import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const THRESHOLD = 1.0;

const ScrollObserver = React.createContext();

const ScrollProvider = ({ targetRef, children, ...props }) => {
  const observer = useRef(null);
  const callback = useRef(null);

  const observe = useCallback((target) => {
    if (observer.current) observer.current.observe(target.current);
  }, []);

  const handler = (entries) => {
    if (!callback.current) return;
    entries.forEach((entry) => {
      if (entry.isIntersecting) callback.current(entry);
    });
  };

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handler, {
      root: targetRef.current,
      threshold: THRESHOLD,
    });

    const { current: currentObserver } = observer;
    return () => currentObserver.disconnect();
  });

  const values = {
    observe,
    register: (_listener) => { callback.current = _listener; },
  };

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
