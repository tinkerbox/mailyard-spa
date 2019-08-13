/* eslint-disable arrow-body-style */

import { map, join } from 'lodash';

const GOOGLE_API_BASE = 'https://www.googleapis.com/gmail/v1';

function GoogleApi(client) {
  // private interface

  const baseParams = {
    prettyPrint: false,
  };

  const formatParams = (params = {}) => {
    const combined = { ...baseParams, ...params };
    const parts = map(combined, (val, id) => { return `${id}=${val}` });
    return join(parts, '&');
  };

  // public interface

  this.client = client;

  this.getAllLabels = () => {
    return client.request({ path: `${GOOGLE_API_BASE}/users/me/labels?${formatParams()}` });
  };

  this.getProfile = () => {
    return client.request({ path: `${GOOGLE_API_BASE}/users/me/profile?${formatParams()}` });
  };

  this.getAllMessages = (params) => {
    const defaultParams = { maxResults: 32 };
    return client.request({ path: `${GOOGLE_API_BASE}/users/me/messages?${formatParams({ ...defaultParams, ...params })}` });
  };

  this.getMessage = (id) => {
    const params = { format: 'raw' };
    return client.request({ path: `${GOOGLE_API_BASE}/users/me/messages/${id}?${formatParams(params)}` });
  };
}

export default GoogleApi;
