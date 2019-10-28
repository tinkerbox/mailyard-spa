/* globals window */

const TAG_LENGTH = 128;

const KeyEncryptionKey = (rawKey, salt) => {
  const encoder = new TextEncoder();
  const additionalData = encoder.encode(salt);

  const wrapKey = async (dek) => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const wrappedKey = await window.crypto.subtle.wrapKey(
      'jwk',
      dek, // the key you want to wrap, must be able to export to above format
      rawKey, // the AES-GCM key with "wrapKey" usage flag
      {
        name: 'AES-GCM',
        iv,
        additionalData,
        tagLength: TAG_LENGTH,
      },
    );

    return { iv, wrappedKey };
  };

  const unwrapKey = async ({ iv, wrappedKey }) => window.crypto.subtle.unwrapKey(
    'jwk', // "jwk", "raw", "spki", or "pkcs8" (whatever was used in wrapping)
    wrappedKey, // the key you want to unwrap
    rawKey, // the AES-GCM key with "unwrapKey" usage flag
    {
      name: 'AES-GCM',
      iv,
      additionalData,
      tagLength: TAG_LENGTH,
    },
    {
      name: 'AES-GCM',
      length: TAG_LENGTH,
    },
    false,
    ['encrypt', 'decrypt'], // the usages you want the unwrapped key to have
  );

  const exportKey = async () => window.crypto.subtle.exportKey(
    'jwk', // can be "jwk" or "raw"
    rawKey, // extractable must be true
  );

  return { wrapKey, unwrapKey, exportKey };
};

// TODO: remove this, and use key derivation protocol
KeyEncryptionKey.createKey = async () => {
  const rawKey = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256, // can be  128, 192, or 256
    },
    true, // whether the key is extractable (i.e. can be used in exportKey)
    ['wrapKey', 'unwrapKey'], // can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  );

  return new KeyEncryptionKey(rawKey);
};

KeyEncryptionKey.importKey = async (payload) => {
  const rawKey = await window.crypto.subtle.importKey(
    'jwk', // can be "jwk" or "raw"
    payload,
    { name: 'AES-GCM' },
    true, // whether the key is extractable (i.e. can be used in exportKey)
    ['wrapKey', 'unwrapKey'], // can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  );

  return new KeyEncryptionKey(rawKey);
};

export default KeyEncryptionKey;
