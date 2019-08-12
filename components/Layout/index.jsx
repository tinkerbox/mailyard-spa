import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';
import { Divider, Row, Col, Layout as NextLayout } from 'antd';

import config from '../../config/runtime';

import { makeStyles } from '../../utils/styles';
import custom from './styles.css';

const { Header, Footer } = NextLayout;

const styles = makeStyles(custom);

const COPYRIGHT_NOTICE = 'Mailyard, by Tinkerbox Studios Pte Ltd © 2019';

const Simple = ({ children }) => {
  return (
    <NextLayout className={styles.layout}>
      <div className={styles.container}>

        <Header className={styles.header}>
          <Link href={config.MAILYARD_WEB_URL}><a>Mailyard</a></Link>
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
          <Link href={config.MAILYARD_WEB_URL}><a>Mailyard</a></Link>
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

const Layout = {};

Layout.Simple = Simple;
Layout.SimpleWide = SimpleWide;

export default Layout;
