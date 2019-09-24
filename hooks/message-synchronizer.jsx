import { map } from 'lodash';
import { useReducer, useContext, useEffect, useRef } from 'react';
import { ApolloContext } from 'react-apollo';
import PromiseThrottle from 'promise-throttle';
import gql from 'graphql-tag';

import { useGoogle } from './google-context';
import { useEmailParser } from './email-parser';
import { retry } from '../lib/promise-retry';
import { uploadFile } from '../lib/file-manager';
import EmailUploader from '../lib/email-uploader';
import EmailExtractor from '../lib/email-extractor';

const THROTTLE_LIMIT = 5;

const START_SYNC_MUTATION = gql`
  mutation ($mailboxId: ID!) {
    startSync(mailboxId: $mailboxId) {
      id
    }
  }
`;

const sync = async (token, dispatch, api, parse, uploader, syncSessionId) => {
  const params = token ? { pageToken: token } : {};
  const { result: batchQuery } = await api.getAllMessages(params);
  const { messages, nextPageToken } = batchQuery;

  const perform = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { result: detailQuery } = await retry(() => api.getMessage(id));
        const parsed = await parse(detailQuery.raw);
        const extractor = new EmailExtractor(parsed);

        const { data } = await uploader.sync(detailQuery, extractor, syncSessionId);
        const { putRequest } = data.sync;

        const response = await uploadFile(putRequest, detailQuery.raw);
        if (!response.ok) {
          // TODO: error handling, retries, etc
          console.log(detailQuery);
        }

        dispatch({
          type: 'tick',
          payload: { messages: 1 },
        });

        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  const throttle = new PromiseThrottle({
    requestsPerSecond: THROTTLE_LIMIT,
    promiseImplementation: Promise,
  });

  await Promise.all(map(messages, ({ id }) => throttle.add(perform.bind(this, id))));

  if (!nextPageToken) {
    dispatch({ type: 'stop' });
  } else {
    dispatch({ type: 'next', payload: { nextPageToken } });
  }
};

const reducer = (state, action) => {
  const { payload } = action;

  switch (action.type) {
    case 'start':
      return {
        messages: 0,
        nextPageToken: 'first-query',
        status: 'running',
        syncSessionId: payload.syncSessionId,
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

const useMessageSynchronizer = (mailboxId) => {
  const [status, dispatch] = useReducer(reducer, initialState);
  const { client } = useContext(ApolloContext);
  const { parse } = useEmailParser();
  const { api } = useGoogle();

  const uploader = useRef();
  useEffect(() => {
    if (!uploader.current && mailboxId) uploader.current = new EmailUploader(mailboxId, client);
    return () => { uploader.current = undefined; };
  }, [client, mailboxId]);

  useEffect(() => {
    let didCancel = false;

    if (status.nextPageToken && status.status === 'running' && !didCancel) {
      if (status.nextPageToken === 'first-query') {
        sync(null, dispatch, api, parse, uploader.current, status.syncSessionId);
      } else {
        sync(status.nextPageToken, dispatch, api, parse, uploader.current, status.syncSessionId);
      }
    }

    return () => { didCancel = true; };
  }, [api, parse, status.nextPageToken, status.status, status.syncSessionId]);

  const start = () => {
    client.mutate({
      mutation: START_SYNC_MUTATION,
      variables: { mailboxId },
    }).then((results) => {
      dispatch({ type: 'start', payload: { syncSessionId: results.data.startSync.id } });
    });
  };

  return {
    status: status.status,
    count: status.messages,
    start,
  };
};

export { useMessageSynchronizer };

export default useMessageSynchronizer;
