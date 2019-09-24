import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import styled from 'styled-components';

import AuthWrapper from '../../../components/auth-wrapper';
import { ScrollProvider } from '../../../hooks/scroll-observer';
import { MailSelectorProvider } from '../../../hooks/mail-selector-context';
import Navigation from '../../../components/pages/mail/navigation';
import Message from '../../../components/pages/mail/message';
import Conversation from '../../../components/pages/mail/conversation';

const { Content, Sider } = Layout;

const StyledLayout = styled(Layout)`
  &&& { min-height: 100vh; }
`;

const ScrollPane = styled.div`
  overflow: auto;
  overflow-x: hidden;
  height: 100vh;
`;

const Listing = styled(Sider)`
  height: 100%;
  li { padding: 0.75rem; }
`;

const MailView = ({ query }) => {
  const [collapsed, setCollapsed] = useState(true);
  const messagesListingRef = useRef(null);

  return (
    <AuthWrapper.Authenticated>
      <StyledLayout hasSider>
        <MailSelectorProvider initialMailboxPos={query.mailboxPos} initialLabelSlug={query.labelSlug} initialThreadId={null}>

          <Sider collapsible collapsed={collapsed} onCollapse={() => { setCollapsed(!collapsed); }}>
            <Navigation />
          </Sider>

          <Content>
            <Layout hasSider>

              <ScrollProvider targetRef={messagesListingRef}>
                <Listing theme="light" width={320}>
                  <ScrollPane ref={messagesListingRef}>
                    <Message.Container />
                  </ScrollPane>
                </Listing>
              </ScrollProvider>

              <Content>
                <ScrollPane>
                  <Conversation.Container />
                </ScrollPane>
              </Content>

            </Layout>
          </Content>

        </MailSelectorProvider>
      </StyledLayout>
    </AuthWrapper.Authenticated>
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
