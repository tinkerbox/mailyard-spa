/* eslint-disable arrow-body-style */

const GOOGLE_API_BASE = 'https://www.googleapis.com/gmail/v1';

function GoogleApi(client) {
  // private interface

  const baseParams = {
    prettyPrint: false,
  };

  const formatParams = (params = {}) => {
    return { ...baseParams, ...params };
  };

  // public interface

  this.client = client;

  this.getAllLabels = () => {
    return new Promise((resolve, reject) => {
      client.request({
        path: `${GOOGLE_API_BASE}/users/me/labels`,
        params: formatParams(),
      }).then(resolve, reject);
    });
  };

  this.getProfile = () => {
    return new Promise((resolve, reject) => {
      client.request({
        path: `${GOOGLE_API_BASE}/users/me/profile`,
        params: formatParams(),
      }).then(resolve, reject);
    });
  };

  this.getAllMessages = (params) => {
    const defaultParams = { maxResults: 100 };
    return new Promise((resolve, reject) => {
      client.request({
        path: `${GOOGLE_API_BASE}/users/me/messages`,
        params: formatParams({ ...defaultParams, ...params }),
      }).then(resolve, reject);
    });
  };

  this.getMessage = (id, params = {}) => {
    const defaultParams = { format: 'raw' };
    return new Promise((resolve, reject) => {
      client.request({
        path: `${GOOGLE_API_BASE}/users/me/messages/${id}`,
        params: formatParams({ ...defaultParams, ...params }),
      }).then(resolve, reject);
    });
  };
}

export default GoogleApi;
