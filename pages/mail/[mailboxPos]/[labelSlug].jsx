import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Layout } from 'antd';

import { makeStyles } from '../../../styles';
import custom from '../../../styles/pages/mail/index.css';

import { MailSelectorProvider } from '../../../hooks/mail-selector-context';
import Navigation from '../../../components/pages/mail/Navigation';
import Message from '../../../components/pages/mail/Message';
import Conversation from '../../../components/pages/mail/Conversation';

const styles = makeStyles(custom);

const { Content, Sider } = Layout;

const MailView = ({ query }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout className={styles.layout} hasSider>
      <MailSelectorProvider initialMailboxPos={query.mailboxPos} initialLabelSlug={query.labelSlug} initialThreadId={null}>

        <Sider collapsible className={styles.sider} collapsed={collapsed} onCollapse={() => { setCollapsed(!collapsed); }}>
          <Navigation />
        </Sider>

        <Content>
          <Layout className={styles.main} hasSider>

            <Sider theme="light" width={320} className={styles.use('listing', 'scrollpane')}>
              <Message.Container />
            </Sider>

            <Content className={styles.scrollpane}>
              <Conversation.Container />
            </Content>

          </Layout>
        </Content>

      </MailSelectorProvider>
    </Layout>
  );
};

MailView.getInitialProps = ({ query }) => {
  const { mailboxPos, labelSlug } = query;

  return {
    query: {
      mailboxPos: parseInt(mailboxPos, 10),
      labelSlug,
    },
  };
};

MailView.propTypes = {
  query: PropTypes.shape({
    mailboxPos: PropTypes.number.isRequired,
    labelSlug: PropTypes.string.isRequired,
  }).isRequired,
};

MailView.whyDidYouRender = true;

export default MailView;
