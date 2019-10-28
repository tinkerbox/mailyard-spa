/* globals window */

const PasswordBasedKey = async (password) => {
  // TODO: preprocess password

  const rawKey = await (async () => {
    const encoder = new TextEncoder();
    return window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false, // TODO: is it extractable?
      ['deriveBits', 'deriveKey'],
    );
  })();

  const deriveKeyEncryptionKey = (salt) => {
    const encoder = new TextEncoder();

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256',
      },
      rawKey,
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['wrapKey', 'unwrapKey'],
    );
  };

  return { deriveKeyEncryptionKey };
};

export default PasswordBasedKey;
