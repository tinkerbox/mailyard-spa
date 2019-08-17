import { useRef, useReducer, useEffect, useCallback } from 'react';
import uuid from 'uuid/v4';

import EmailParser from '../lib/email-parser.worker';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'start': {
      const job = {};
      const { id, ...rest } = payload;
      job[id] = rest;
      return {
        ...state,
        ...job,
      };
    }

    case 'resolve': {
      const { id, email } = payload;
      state[id].resolve(email);
      const newState = { ...state };
      delete newState[id];
      return newState;
    }

    case 'reject': {
      const { id, error } = payload;
      state[id].reject(error);
      const newState = { ...state };
      delete newState[id];
      return newState;
    }

    default:
      throw new Error('invalid dispatch type');
  }
};

function useEmailParser() {
  const [state, dispatch] = useReducer(reducer, {});

  const worker = useRef();
  useEffect(() => {
    let didCancel = false;
    worker.current = new EmailParser();

    worker.current.onmessage = (e) => {
      if (didCancel) return;
      dispatch({
        type: 'resolve',
        payload: e.data,
      });
    };

    worker.current.onerror = (error) => {
      if (didCancel) return;
      const { id, original } = error;
      if (id) {
        dispatch({
          type: 'reject',
          payload: { id, error: original },
        });
      } else {
        console.log(error);
      }
    };

    return () => {
      worker.current.terminate();
      worker.current = undefined;
      didCancel = true;
    };
  }, []);

  const parse = useCallback((raw) => {
    return new Promise((resolve, reject) => {
      const id = uuid();
      const message = { id, raw };
      worker.current.postMessage(message);
      dispatch({
        type: 'start',
        payload: { id, raw, resolve, reject },
      });
    });
  }, []);

  return {
    parse,
    outstanding: Object.keys(state).length,
  };
}

export { useEmailParser };

export default useEmailParser;
