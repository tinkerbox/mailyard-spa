import { map, chunk } from 'lodash';

import { useReducer, useContext, useRef, useEffect } from 'react';

import { ApolloContext } from 'react-apollo';

import { useGoogle } from './google-context';

import { retry } from '../lib/promise-retry';
import EmailUploader from '../lib/email-uploader';
import { useEmailExtractor } from './email-extractor';

const sync = async (token, dispatch, api, extract, uploader) => {
  const params = token ? { pageToken: token } : {};
  const { result: batchQuery } = await api.getAllMessages(params);
  const { messages, nextPageToken } = batchQuery;

  const perform = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { result: detailQuery } = await retry(() => api.getMessage(id));
        const parsed = await extract(detailQuery.raw);

        // const { data } = await uploader.sync(extractor);

        // const { preSignedUrl } = data;
        // console.log(preSignedUrl);

        // TODO: use pre-signed url to upload payload

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

  const promises = map(messages, ({ id }) => perform(id));

  // const batches = chunk(promises, 25); // limit concurrent sync jobs
  // const batchOfPromises = map(batches, async batch => Promise.all(batch));
  // await Promise.all(batchOfPromises);

  await Promise.all(promises);

  if (!nextPageToken) {
    dispatch({ type: 'stop' });
  } else {
    dispatch({
      type: 'next',
      payload: { nextPageToken },
    });
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

const useMessageSynchronizer = (mailboxId) => {
  const [status, dispatch] = useReducer(reducer, initialState);
  const { client } = useContext(ApolloContext);
  const { extract } = useEmailExtractor();
  const { api } = useGoogle();

  const uploader = useRef();
  useEffect(() => {
    if (!uploader.current && mailboxId) uploader.current = new EmailUploader(mailboxId, client);
    return () => { uploader.current = undefined; };
  }, [client, mailboxId]);

  useEffect(() => {
    let didCancel = false;

    if (status.nextPageToken && status.status === 'running' && !didCancel) {
      sync(status.nextPageToken, dispatch, api, extract, uploader.current);
    }

    return () => { didCancel = true; };
  }, [api, extract, status.nextPageToken, status.status]);

  const start = () => {
    dispatch({ type: 'start' });
    sync(null, dispatch, api, extract, uploader.current);
  };

  return {
    status: status.status,
    count: status.messages,
    start,
  };
};

export { useMessageSynchronizer };

export default useMessageSynchronizer;
