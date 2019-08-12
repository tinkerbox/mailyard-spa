import { useReducer, useContext } from 'react';

import { ApolloContext } from 'react-apollo';

import { useGoogle } from './google-context';

const sync = async (token, dispatch, api, client, mailbox) => {
  const { result: batchQuery } = await api.getAllMessages(token);
  const { messages, nextPageToken } = batchQuery;

  const batch = messages.map(async ({ id }) => {
    const { result: detailQuery } = await api.getMessage(id);
    // console.log(detailQuery);

    dispatch({
      type: 'tick',
      payload: { messages: 1 },
    });

    return detailQuery.sizeEstimate;
  });

  const results = await Promise.all(batch);

  dispatch({
    type: 'next',
    payload: { nextPageToken },
  });

  if (!nextPageToken) {
    dispatch({ type: 'stop' });
  } else {
    sync(nextPageToken, dispatch, api, client, mailbox);
  }
};

const reducer = (state, action) => {
  const { payload } = action;

  switch (action.type) {
    case 'start':
      return {
        messages: 0,
        nextPageToken: null,
        status: 'running',
      };

    case 'stop':
      return {
        ...state,
        nextPageToken: null,
        status: 'finished',
      };

    case 'tick':
      return {
        ...state,
        messages: state.messages + payload.messages,
      };

    case 'next':
      return {
        ...state,
        nextPageToken: payload.nextPageToken,
      };

    default:
      throw new Error('invalid dispatch type');
  }
};

const initialState = {
  messages: 0,
  nextPageToken: null,
  status: 'waiting',
};

const useMessageSynchronizer = (mailbox) => {
  const [status, dispatch] = useReducer(reducer, initialState);
  const { client } = useContext(ApolloContext);
  const { api } = useGoogle();

  const start = () => {
    dispatch({ type: 'start' });
    sync(null, dispatch, api, client, mailbox);
  };

  return {
    status: status.status,
    count: status.messages,
    start,
  };
};

export { useMessageSynchronizer };

export default useMessageSynchronizer;
