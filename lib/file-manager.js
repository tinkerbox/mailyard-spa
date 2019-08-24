/* global FormData, fetch */

// TODO: turn this into file manager

const uploadFile = (request, file) => {
  const data = new FormData();

  Object.entries(request.fields).forEach(([k, v]) => {
    data.append(k, v);
  });

  data.append('file', file);

  return fetch(request.url, {
    method: 'POST',
    body: data,
  });
};

const downloadPayload = async (request) => {
  const response = await fetch(request);
  const reader = response.body.getReader();
  const raw = await reader.read();
  const value = new TextDecoder('utf-8').decode(raw.value);
  return value;
};

module.exports = {
  uploadFile,
  downloadPayload,
};
