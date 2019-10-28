/* globals localStorage */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Lanyard from '../lib/lanyard';

const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');

const LanyardContext = React.createContext();

const LanyardProvider = ({ children }) => {
  const lanyard = useRef();
  const [vault, setVault] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (!lanyard.current) {
        const muk = await Lanyard.generateMasterUnlockKey('123123123', 'salt-123');
        lanyard.current = new Lanyard(muk);
      }

      if (loaded || !lanyard.current) return;

      if (vault && !('vault' in localStorage)) {
        // save new vault to local storage
        (async () => {
          const exportedVault = await vault.exportVault();
          localStorage.setItem('vault', JSON.stringify(exportedVault));
          if (!didCancel) setLoaded(true);
        })();
      }

      if (!vault && ('vault' in localStorage)) {
        // retrieve vault from local storage
        (async () => {
          const _vault = await lanyard.current.importVault(JSON.parse(localStorage.getItem('vault')));
          setVault(_vault.vault);
          if (!didCancel) setLoaded(true);
        })();
      }

      if (vault && ('vault' in localStorage)) {
        // update existing vault in local storage
        (async () => {
          const exportedVault = await vault.exportVault();
          localStorage.setItem('vault', JSON.stringify(exportedVault));
          if (!didCancel) setLoaded(true);
        })();
      }

      if (!vault && !('vault' in localStorage)) {
        // vault not ready
        if (!didCancel) setLoaded(true);
      }
    })();

    return () => { didCancel = false; };
  }, [vault, loaded]);

  const registerVault = async () => {
    const _vault = await lanyard.current.createVault();
    setVault(_vault.vault);
  };

  const importVault = async (muk, payload) => {
    const _vault = await lanyard.current.importVault(muk, payload);
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
