import React from 'react';

import Link from 'next/link';
import { Divider, Row, Col, Layout as NextLayout } from 'antd';

import config from '../../config/runtime';

import { makeStyles } from '../../utils/styles';
import custom from './styles.css';

const { Header, Footer } = NextLayout;

const styles = makeStyles(custom);

const COPYRIGHT_NOTICE = 'Mailyard, by Tinkerbox Studios Pte Ltd &copy; 2019';

const Simple = (props) => {
  return (
    <NextLayout className={styles.layout}>
      <div className={styles.container}>

        <Header className={styles.header}>
          <Link href={config.MAILYARD_WEB_URL}><a>Mailyard</a></Link>
        </Header>

        <Row>
          <Col xs={0} sm={2} md={4} lg={6} />
          <Col xs={24} sm={20} md={16} lg={12}>
            {props.children}
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

const SimpleWide = (props) => {
  return (
    <NextLayout className={styles.layout}>
      <div className={styles.container}>

        <Header className={styles.header}>
          <Link href={config.MAILYARD_WEB_URL}><a>Mailyard</a></Link>
        </Header>

        <Row>
          <Col lg={3} />
          <Col lg={18}>
            {props.children}
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

const Layout = {};

Layout.Simple = Simple;
Layout.SimpleWide = SimpleWide;

export default Layout;
