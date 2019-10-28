/* globals localStorage */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Lanyard from '../lib/lanyard';

const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');

const LanyardContext = React.createContext();

const LanyardProvider = ({ children }) => {
  const [vault, setVault] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;

    if (vault && !('vault' in localStorage)) {
      // save new vault to local storage
      (async () => {
        const exportedVault = await vault.exportVault();
        localStorage.setItem('vault', JSON.stringify(exportedVault));
        setLoaded(true);
      })();
    }

    if (!vault && ('vault' in localStorage)) {
      // retrieve vault from local storage
      (async () => {
        const _vault = await Lanyard.importVault(JSON.parse(localStorage.getItem('vault')));
        setVault(_vault.vault);
        setLoaded(true);
      })();
    }

    if (vault && ('vault' in localStorage)) {
      // update existing vault in local storage
      (async () => {
        const exportedVault = await vault.exportVault();
        localStorage.setItem('vault', JSON.stringify(exportedVault));
        setLoaded(true);
      })();
    }

    if (!vault && !('vault' in localStorage)) {
      // vault not ready
      setLoaded(true);
    }
  }, [vault, loaded]);

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

  const createKey = async () => {
    const keyId = await vault.createKey();
    setLoaded(false);
    return keyId;
  };

  const values = {
    loaded,
    vault,
    createKey,
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
