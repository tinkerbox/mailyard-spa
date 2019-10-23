/* globals window */

const TAG_LENGTH = 128;

const DataEncryptionKey = (rawKey, salt) => {
  const encoder = new TextEncoder();
  const additionalData = encoder.encode(salt);

  const getRawKey = () => rawKey;

  const encrypt = async (data) => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const cipher = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        additionalData,
        tagLength: TAG_LENGTH,
      },
      rawKey,
      data,
    );

    return { iv, cipher };
  };

  const decrypt = async ({ iv, cipher }) => {
    return window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        additionalData,
        tagLength: TAG_LENGTH,
      },
      rawKey,
      cipher,
    );
  };

  return { getRawKey, encrypt, decrypt };
};

DataEncryptionKey.createKey = async () => {
  const rawKey = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256, // can be  128, 192, or 256
    },
    true, // whether the key is extractable (i.e. can be used in exportKey)
    ['encrypt', 'decrypt'], // can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  );

  return new DataEncryptionKey(rawKey);
};

DataEncryptionKey.importKey = async (payload) => {
  const rawKey = window.crypto.subtle.importKey(
    'jwk', // can be "jwk" or "raw"
    payload,
    { name: 'AES-GCM' },
    true, // whether the key is extractable (i.e. can be used in exportKey)
    ['encrypt', 'decrypt'], // can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  );

  return new DataEncryptionKey(rawKey);
};

export default DataEncryptionKey;
