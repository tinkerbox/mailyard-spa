import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Lanyard from '../lib/lanyard';

const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');

const LanyardContext = React.createContext();

const LanyardProvider = ({ children }) => {
  const [vault, setVault] = useState();

  const registerVault = async () => {
    const muk = await Lanyard.generateMUK();
    const _vault = await Lanyard.createVault(muk);
    setVault(_vault.vault);
    return muk;
  };

  const importVault = async (muk, payload) => {
    const _vault = await Lanyard.importVault(muk, payload);
    setVault(_vault.vault);
  };

  const exportVault = () => vault.exportVault();

  const encrypt = async (keyId, data) => {
    const key = await vault.getKey(keyId);
    return key.encrypt(data);
  };

  const encryptString = async (keyId, data) => encrypt(keyId, encoder.encode(data));

  const decrypt = async (keyId, data) => {
    const key = await vault.getKey(keyId);
    return key.decrypt(data);
  };

  const decryptString = async (keyId, data) => {
    const decrypted = await decrypt(keyId, data);
    return decoder.decode(decrypted);
  };

  const values = {
    vault,
    registerVault,
    importVault,
    exportVault,
    encrypt,
    encryptString,
    decrypt,
    decryptString,
  };

  return (
    <LanyardContext.Provider value={values}>
      {children}
    </LanyardContext.Provider>
  );
};

const useLanyard = () => React.useContext(LanyardContext);

LanyardProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export { LanyardProvider, useLanyard };
