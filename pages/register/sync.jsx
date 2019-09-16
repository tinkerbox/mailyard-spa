import React from 'react';
import { Card } from 'antd';

import Layout from '../../components/Layout';
import Wizard from '../../components/pages/register/Wizard';

import SyncComponent from '../../components/pages/register/sync';

const SyncScreen = () => {
  return (
    <Layout.SimpleWide>
      <Card title="Get started in 3 easy steps">
        <Wizard current={2} />
        <SyncComponent />
      </Card>
    </Layout.SimpleWide>
  );
};

SyncScreen.whyDidYouRender = true;

export default SyncScreen;
