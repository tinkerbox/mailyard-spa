import React from 'react';
import App from 'next/app';
import Head from 'next/head';

import { ApolloProvider } from 'react-apollo';
import * as Sentry from '@sentry/browser';

import 'antd/dist/antd.min.css';

import apollo from '../../config/apollo';
import config from '../../config/runtime';

import { makeStyles } from '../../utils/styles';

import { Layout } from 'antd';

import MainNavigation from '../../components/app/MainNavigation';

import custom from './styles.css';
const styles = makeStyles(custom);

Sentry.init({
  dsn: config.SENTRY_FRONTEND_DSN,
  release: `${config.HEROKU_SLUG_COMMIT}@mailyard-spa`,
});

class MailyardSPA extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Mailyard SPA</title>
        </Head>
        <ApolloProvider client={apollo}>
          <Layout className={styles.main}>
            <MainNavigation />
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </React.Fragment>
    );
  }
}

export default MailyardSPA;
