import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Head from 'next/head';
import { Divider, Row, Col, Layout as NextLayout } from 'antd';

import config from '../config/runtime';

const { Header, Footer } = NextLayout;

const StyledLayout = styled(NextLayout)`
  &&& { min-height: 100vh; }
`;

const StyledContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 480px;
  @media (min-width: 576px) { & { max-width: 480px; } }
  @media (min-width: 768px) { & { max-width: 720px; } }
  @media (min-width: 992px) { & { max-width: 960px; } }
  @media (min-width: 1200px) { & { max-width: 1024px; } }
`;

const StyledHeader = styled(Header)`
  &&& {
    background-color: transparent;
    text-align: center;
  }
`;

const StyledFooter = styled(Footer)`
  text-align: center;
`;

const COPYRIGHT_NOTICE = 'Mailyard, by Tinkerbox Studios Pte Ltd © 2019';

const Simple = ({ children }) => {
  return (
    <StyledLayout>
      <Head />
      <StyledContainer>

        <StyledHeader>
          <a href={config.MAILYARD_WEB_URL}>Mailyard</a>
        </StyledHeader>

        <Row>
          <Col xs={0} sm={2} md={4} lg={6} />
          <Col xs={24} sm={20} md={16} lg={12}>
            {children}
          </Col>
          <Col xs={0} sm={2} md={4} lg={6} />
        </Row>

        <StyledFooter>
          <Divider />
          <small>{COPYRIGHT_NOTICE}</small>
        </StyledFooter>

      </StyledContainer>
    </StyledLayout>
  );
};

Simple.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const SimpleWide = ({ children }) => {
  return (
    <StyledLayout>
      <StyledContainer>

        <StyledHeader>
          <a href={config.MAILYARD_WEB_URL}>Mailyard</a>
        </StyledHeader>

        <Row>
          <Col lg={3} />
          <Col lg={18}>
            {children}
          </Col>
          <Col lg={3} />
        </Row>

        <StyledFooter>
          <Divider />
          <small>{COPYRIGHT_NOTICE}</small>
        </StyledFooter>

      </StyledContainer>
    </StyledLayout>
  );
};

SimpleWide.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const FullScreen = ({ children }) => {
  return (
    <StyledLayout>
      <StyledContainer>
        {children}
      </StyledContainer>
    </StyledLayout>
  );
};

FullScreen.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const Layout = {};

Layout.Simple = React.memo(Simple);
Layout.SimpleWide = React.memo(SimpleWide);
Layout.FullScreen = React.memo(FullScreen);

Simple.whyDidYouRender = true;
SimpleWide.whyDidYouRender = true;
FullScreen.whyDidYouRender = true;

export default Layout;
