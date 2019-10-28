import uuid from 'uuid/v4';

import PasswordBasedKey from './password-based-key';
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
    const encodedKeys = encodeVault(keys);
    return { vaultId, keys: encodedKeys };
  };

  const numKeys = () => keys.length;

  return { createKey, getKey, exportVault, numKeys };
};

const generateMasterUnlockKey = async (password, salt) => {
  const pbk = await new PasswordBasedKey(password);
  const rawKek = await pbk.deriveKeyEncryptionKey(salt);
  return new KeyEncryptionKey(rawKek);
};

const Lanyard = async (masterUnlockKey) => {
  // TODO: allow creation of lanyard 'sessions'

  const createVault = async () => {
    const vaultId = uuid();
    const vault = new Vault(vaultId, masterUnlockKey);
    return { vault };
  };

  const importVault = async ({ vaultId, keys }) => {
    const decodedKeys = decodeVault(keys);
    const vault = new Vault(vaultId, masterUnlockKey, decodedKeys);
    return { vault };
  };

  return { createVault, importVault };
};

Lanyard.generateMasterUnlockKey = generateMasterUnlockKey;

export default Lanyard;
