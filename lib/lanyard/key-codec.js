/* globals btoa, atob, parseInt */

const bytesToArrayBuffer = (bytes) => {
  const bytesAsArrayBuffer = new ArrayBuffer(bytes.length);
  const bytesUint8 = new Uint8Array(bytesAsArrayBuffer);
  bytesUint8.set(bytes);
  return bytesAsArrayBuffer;
};

const encodeKey = ({ iv, wrappedKey }) => {
  return { iv: btoa(iv), wrappedKey: btoa(new Uint8Array(wrappedKey)) };
};

const decodeKey = ({ iv, wrappedKey }) => {
  const deserializedIv = new Uint8Array(atob(iv).split(',').map(i => parseInt(i, 10)));
  const deserializedKey = new Uint8Array(atob(wrappedKey).split(',').map(i => parseInt(i, 10)));
  return { iv: deserializedIv, wrappedKey: bytesToArrayBuffer(deserializedKey) };
};

export const encodeVault = keys => Object.keys(keys).reduce((acc, keyId) => {
  acc[keyId] = encodeKey(keys[keyId]);
  return acc;
}, {});

export const decodeVault = keys => Object.keys(keys).reduce((acc, keyId) => {
  acc[keyId] = decodeKey(keys[keyId]);
  return acc;
}, {});
