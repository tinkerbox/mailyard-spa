import { useRef, useReducer, useEffect, useCallback } from 'react';
import uuid from 'uuid/v4';

import EmailExtractor from '../lib/email-extractor.worker';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

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
      state[id].resolve(decoder.decode(email));
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

const initialState = {
  jobs: {},
};

function useEmailExtractor() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const worker = useRef();
  useEffect(() => {
    let didCancel = false;
    worker.current = new EmailExtractor();

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

  const extract = useCallback((raw) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const id = uuid();
        const utf8 = new Uint8Array(raw.length);
        encoder.encodeInto(raw, utf8);
        const message = { id, raw: utf8.buffer };
        worker.current.postMessage(message, [message.raw]);
        dispatch({
          type: 'start',
          payload: { id, raw, resolve, reject },
        });
      }, 0);
    });
  }, []);

  return {
    extract,
    outstanding: Object.keys(state).length,
  };
}

export { useEmailExtractor };

export default useEmailExtractor;
