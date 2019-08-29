/* global FormData, fetch */

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

const downloadFile = async (request) => {
  const response = await fetch(request);
  const raw = await response.body.getReader().read();
  return new TextDecoder('utf-8').decode(raw.value);
};

module.exports = {
  uploadFile,
  downloadFile,
};
