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
    const defaultParams = { maxResults: 100 };
    return new Promise((resolve, reject) => {
      try {
        const response = client.request({ path: `${GOOGLE_API_BASE}/users/me/messages?${formatParams({ ...defaultParams, ...params })}` });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };

  this.getMessage = (id) => {
    const params = { format: 'raw' };
    return new Promise((resolve, reject) => {
      try {
        const response = client.request({ path: `${GOOGLE_API_BASE}/users/me/messages/${id}?${formatParams(params)}` });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };
}

export default GoogleApi;
