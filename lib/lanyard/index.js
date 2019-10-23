import uuid from 'uuid/v4';

import DataEncryptionKey from './data-encryption-key';
import KeyEncryptionKey from './key-encryption-key';

const Vault = (vaultId, masterUnlockKey, importedKeys = {}) => {
  const keys = { ...importedKeys };

  const createKey = async () => {
    const keyId = 'dek-1';
    const dek = await DataEncryptionKey.createKey();
    const wrappedKey = await masterUnlockKey.wrapKey(dek.getRawKey());

    keys[keyId] = wrappedKey;

    return keyId;
  };

  const getKey = async (keyId) => {
    const rawKey = await masterUnlockKey.unwrapKey(keys[keyId]);
    return new DataEncryptionKey(rawKey);
  };

  const exportVault = () => ({ vaultId, keys });

  return { createKey, getKey, exportVault };
};

// 'static' methods

const generateMUK = () => KeyEncryptionKey.createKey();

const createVault = async (muk) => {
  const vaultId = uuid();

  const vault = new Vault(vaultId, muk);
  const key = await muk.exportKey();

  return { vault, key };
};

const importVault = async (muk, { vaultId, keys }) => {
  const vault = new Vault(vaultId, muk, keys);
  const key = await muk.exportKey();
  return { vault, key };
};

const Lanyard = () => {
  // TODO: allow creation of lanyard 'sessions'
  return {};
};

Lanyard.generateMUK = generateMUK;
Lanyard.createVault = createVault;
Lanyard.importVault = importVault;

export default Lanyard;
