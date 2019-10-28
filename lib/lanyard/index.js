import uuid from 'uuid/v4';

import DataEncryptionKey from './data-encryption-key';
import KeyEncryptionKey from './key-encryption-key';

import { encodeVault, decodeVault } from './key-codec';

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
    const encodedKeys = encodeVault(keys);
    return { vaultId, masterUnlockKey: exportedMuk, keys: encodedKeys };
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

const importVault = async ({ vaultId, masterUnlockKey, keys }) => {
  const decodedKeys = decodeVault(keys);
  const importedMuk = await KeyEncryptionKey.importKey(masterUnlockKey);
  const vault = new Vault(vaultId, importedMuk, decodedKeys);
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
