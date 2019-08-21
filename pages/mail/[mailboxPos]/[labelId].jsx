import React, { useState } from 'react';

import { useRouter } from 'next/router';
import { Layout } from 'antd';

import { makeStyles } from '../../../styles';
import custom from '../../../styles/pages/mail/index.css';

import Navigation from '../../../components/pages/mail/Navigation';
import Message from '../../../components/pages/mail/Message';
import Thread from '../../../components/pages/mail/Thread';

const styles = makeStyles(custom);

const { Content, Sider } = Layout;

const MailView = () => {
  const [collapsed, setCollapsed] = useState(true);

  const { query } = useRouter();

  return (
    <Layout className={styles.layout} hasSider>

      <Sider collapsible className={styles.sider} collapsed={collapsed} onCollapse={() => { setCollapsed(!collapsed); }}>
        <Navigation query={query} />
      </Sider>

      <Content>
        <Layout className={styles.main} hasSider>

          <Sider theme="light" width={320} className={styles.use('listing', 'scrollpane')}>
            <Message.Container query={query} />
          </Sider>

          <Content className={styles.scrollpane}>
            <Thread.Container query={query} />
          </Content>

        </Layout>
      </Content>

    </Layout>
  );
};

MailView.whyDidYouRender = true;

export default MailView;
