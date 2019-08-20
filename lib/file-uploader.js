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

module.exports = {
  uploadFile,
};
