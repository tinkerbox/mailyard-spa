/* globals localStorage */

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { Card, Divider } from 'antd';
import Layout from '../components/layout';

import { LanyardProvider, useLanyard } from '../hooks/lanyard-vault';

const decoder = new TextDecoder('utf-8');

const CryptoGymScene = dynamic(() => Promise.resolve(() => {
  const { vault, createKey, loaded, registerVault, encryptString, decryptString } = useLanyard();

  const [keyId, setKeyId] = useState(localStorage.getItem('keyId'));
  const [encrypted, setEncrypted] = useState();
  const [decrypted, setDecrypted] = useState();

  const raw = 'Hello World';

  useEffect(() => {
    let didCancel = false;

    (async () => {
      if (!loaded) return;
      if (!vault) {
        const muk = await registerVault();
      } else if (!keyId) {
        const _keyId = await createKey();
        localStorage.setItem('keyId', _keyId);
        setKeyId(_keyId);
      } else if (!encrypted) {
        encryptString(keyId, raw).then((value) => {
          if (!didCancel) setEncrypted(value);
        });
      } else if (!decrypted) {
        decryptString(keyId, encrypted).then((value) => {
          if (!didCancel) setDecrypted(value);
        });
      }
    })();

    return () => { didCancel = true; };
  }, [createKey, decryptString, decrypted, encryptString, encrypted, keyId, loaded, registerVault, vault]);

  return (
    <React.Fragment>
      <p>{raw}</p>
      <Divider />
      <p>{encrypted && decoder.decode(encrypted.cipher)}</p>
      <Divider />
      <p>{decrypted}</p>
    </React.Fragment>
  );
}), { ssr: false });

const CryptoGym = () => {
  return (
    <Layout.Simple>
      <Card title="CryptoGym">
        <LanyardProvider existing="hello">
          <CryptoGymScene />
        </LanyardProvider>
      </Card>
    </Layout.Simple>
  );
};

CryptoGym.whyDidYouRender = true;

export default CryptoGym;
