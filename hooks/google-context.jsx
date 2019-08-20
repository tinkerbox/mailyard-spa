/* global window */

import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import GoogleApi from '../lib/google-api';

const GoogleContext = React.createContext();

const initialState = {
  token: null,
  profile: null,
  ready: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        token: action.payload.tokenObj,
        profile: action.payload.profileObj,
      };
    case 'logout':
      return {
        ...state,
        token: null,
        profile: null,
      };
    case 'load':
      return {
        ...state,
        ready: true,
      };
    default:
      throw new Error('invalid dispatch');
  }
};

const GoogleProvider = ({ clientId, scope, children, ...props }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [api, setApi] = useState();

  useEffect(() => {
    let didCancel = false;

    const timer = setInterval(() => {
      if (didCancel) return;
      if (window.gapi) {
        window.gapi.load('client', () => {
          clearInterval(timer);
          dispatch({ type: 'load' });
        });
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    let didCancel = false;
    if (state.ready && state.token) {
      if (!didCancel) setApi(new GoogleApi(window.gapi.client));
    } else {
      setApi(null);
    }
    return () => { didCancel = true; };
  }, [state.ready, state.token]);

  const login = useCallback(response => dispatch({ type: 'login', payload: response }), []);
  const logout = useCallback(() => dispatch({ type: 'logout' }), []);

  const values = useMemo(() => ({
    clientId,
    scope,
    login,
    logout,
    api,
    ...state,
  }), [api, clientId, login, logout, scope, state]);

  return (
    <GoogleContext.Provider value={values} {...props}>
      {children}
    </GoogleContext.Provider>
  );
};

GoogleProvider.propTypes = {
  clientId: PropTypes.string.isRequired,
  scope: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const useGoogle = () => React.useContext(GoogleContext);

export { GoogleProvider, useGoogle };
