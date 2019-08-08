import React, { useState, useReducer, useEffect } from 'react';

import GoogleApi from '../utils/google-api';

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

const GoogleProvider = ({ clientId, scope, ...props }) => {
  const gapi = (typeof window !== 'undefined') ? window.gapi : null;

  const [state, dispatch] = useReducer(reducer, initialState);
  const [api, setApi] = useState();

  useEffect(() => {
    let didCancel = false;
    if (!gapi) return;

    const onApiLoaded = () => {
      if (!didCancel) dispatch({ type: 'load' });
    };
    gapi.load('client', onApiLoaded);
    return () => { didCancel = true; };
  }, [gapi]);

  useEffect(() => {
    let didCancel = false;
    if (state.token) {
      if (!didCancel) setApi(new GoogleApi(gapi.client));
    } else {
      setApi(null);
    }
    return () => { didCancel = true; };
  }, [state.ready]);

  const login = (response) => dispatch({ type: 'login', payload: response });
  const logout = () => dispatch({ type: 'logout' });

  const values = {
    clientId,
    scope,
    login,
    logout,
    api,
    ...state,
  };

  return (
    <GoogleContext.Provider value={values} {...props}>
      {props.children}
    </GoogleContext.Provider>
  );
};

const useGoogle = () => React.useContext(GoogleContext);

export { GoogleProvider, useGoogle };
