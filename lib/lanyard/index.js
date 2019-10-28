/* globals btoa, atob, parseInt */

import uuid from 'uuid/v4';

import DataEncryptionKey from './data-encryption-key';
import KeyEncryptionKey from './key-encryption-key';

const Vault = (vaultId, masterUnlockKey, importedKeys = {}) => {
  const keys = { ...importedKeys };

  const createKey = async () => {
    const keyId = uuid();
    const dek = await DataEncryptionKey.createKey();
    const wrappedKey = await masterUnlockKey.wrapKey(dek.getRawKey());

    keys[keyId] = wrappedKey;

    return keyId;
  };

  const getKey = async (keyId) => {
    const rawKey = await masterUnlockKey.unwrapKey(keys[keyId]);
    return new DataEncryptionKey(rawKey);
  };

  const exportVault = async () => {
    const exportedMuk = await masterUnlockKey.exportKey();
    const _keys = Object.keys(keys).reduce((acc, keyId) => {
      const { iv, wrappedKey } = keys[keyId];
      acc[keyId] = { iv: btoa(iv), wrappedKey: btoa(new Uint8Array(wrappedKey)) };
      return acc;
    }, {});
    return { vaultId, masterUnlockKey: exportedMuk, keys: _keys };
  };

  const numKeys = () => keys.length;

  return { createKey, getKey, exportVault, numKeys };
};

// 'static' methods

const generateMUK = () => KeyEncryptionKey.createKey();

const createVault = async (muk) => {
  const vaultId = uuid();

  const vault = new Vault(vaultId, muk);
  const key = await muk.exportKey();

  return { vault, key };
};

function bytesToArrayBuffer(bytes) {
  const bytesAsArrayBuffer = new ArrayBuffer(bytes.length);
  const bytesUint8 = new Uint8Array(bytesAsArrayBuffer);
  bytesUint8.set(bytes);
  return bytesAsArrayBuffer;
}

const importVault = async ({ vaultId, masterUnlockKey, keys }) => {
  const _keys = Object.keys(keys).reduce((acc, keyId) => {
    const { iv, wrappedKey } = keys[keyId];
    const deserializedIv = new Uint8Array(atob(iv).split(',').map(i => parseInt(i, 10)));
    const deserializedKey = new Uint8Array(atob(wrappedKey).split(',').map(i => parseInt(i, 10)));
    acc[keyId] = { iv: deserializedIv, wrappedKey: bytesToArrayBuffer(deserializedKey) };
    return acc;
  }, {});
  const importedMuk = await KeyEncryptionKey.importKey(masterUnlockKey);
  const vault = new Vault(vaultId, importedMuk, _keys);
  return { vault, key: masterUnlockKey };
};

const Lanyard = () => {
  // TODO: allow creation of lanyard 'sessions'
  return {};
};

Lanyard.generateMUK = generateMUK;
Lanyard.createVault = createVault;
Lanyard.importVault = importVault;

export default Lanyard;
