import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

import { useAuth } from '../hooks/auth-context';

const LoginPage = dynamic(() => import('../pages/login'));
const LandingPage = dynamic(() => import('../pages'));

const Authenticated = ({ children }) => {
  const { account, loading, refresh } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) refresh();
    else if (!account) router.replace('/login', '/login', { shallow: true });
  }, [account, loading, refresh, router]);

  if (loading) return <Spin />;

  return (
    <React.Fragment>
      {!account && <LoginPage />}
      {account && (typeof children !== 'function') && children}
      {account && (typeof children === 'function') && children(account)}
    </React.Fragment>
  );
};

Authenticated.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};

const NotAuthenticated = ({ children }) => {
  const { account, loading, refresh } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) refresh();
    else if (account) router.replace('/', '/', { shallow: true });
  }, [account, loading, refresh, router]);

  if (loading) return <Spin />;

  return (
    <React.Fragment>
      {account && <LandingPage />}
      {!account && children}
    </React.Fragment>
  );
};

NotAuthenticated.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const AuthWrapper = {
  Authenticated,
  NotAuthenticated,
};

Authenticated.whyDidYouRender = true;
NotAuthenticated.whyDidYouRender = true;

export default AuthWrapper;
