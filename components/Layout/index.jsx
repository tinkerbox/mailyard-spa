import React from 'react';
import PropTypes from 'prop-types';

import { Divider, Row, Col, Layout as NextLayout } from 'antd';

import config from '../../config/runtime';

import { makeStyles } from '../../styles';
import custom from './styles.css';

const { Header, Footer } = NextLayout;

const styles = makeStyles(custom);

const COPYRIGHT_NOTICE = 'Mailyard, by Tinkerbox Studios Pte Ltd © 2019';

const Simple = ({ children }) => {
  return (
    <NextLayout className={styles.layout}>
      <div className={styles.container}>

        <Header className={styles.header}>
          <a href={config.MAILYARD_WEB_URL}>Mailyard</a>
        </Header>

        <Row>
          <Col xs={0} sm={2} md={4} lg={6} />
          <Col xs={24} sm={20} md={16} lg={12}>
            {children}
          </Col>
          <Col xs={0} sm={2} md={4} lg={6} />
        </Row>

        <Footer className={styles.footer}>
          <Divider />
          <small>{COPYRIGHT_NOTICE}</small>
        </Footer>

      </div>
    </NextLayout>
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
    <NextLayout className={styles.layout}>
      <div className={styles.container}>

        <Header className={styles.header}>
          <a href={config.MAILYARD_WEB_URL}>Mailyard</a>
        </Header>

        <Row>
          <Col lg={3} />
          <Col lg={18}>
            {children}
          </Col>
          <Col lg={3} />
        </Row>

        <Footer className={styles.footer}>
          <Divider />
          <small>{COPYRIGHT_NOTICE}</small>
        </Footer>

      </div>
    </NextLayout>
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
    <NextLayout className={styles.layout}>
      <div className={styles.container}>
        {children}
      </div>
    </NextLayout>
  );
};

FullScreen.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const Layout = {};

Layout.Simple = Simple;
Layout.SimpleWide = SimpleWide;
Layout.FullScreen = FullScreen;

Simple.whyDidYouRender = true;
SimpleWide.whyDidYouRender = true;
FullScreen.whyDidYouRender = true;

export default Layout;
