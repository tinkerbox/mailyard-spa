import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { Typography } from 'antd';

import { useGoogle } from '../hooks/google-context';

const { Text } = Typography;

const Login = (props) => {
  const { clientId, scope, login } = useGoogle();
  const { render } = props;

  const GoogleLogin = React.memo(dynamic(
    () => import('react-google-login').then(mod => mod.GoogleLogin),
    { ssr: false, loading: render || (() => <Text>Please wait...</Text>) },
  ));

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Sign in with Google"
      scope={scope}
      onSuccess={login}
      onFailure={login}
      cookiePolicy="single_host_origin"
      theme="dark"
      prompt="consent"
      isSignedIn
      {...props}
    />
  );
};

Login.propTypes = { render: PropTypes.func };
Login.defaultProps = { render: null };
Login.whyDidYouRender = true;

const Logout = (props) => {
  const { clientId, logout } = useGoogle();
  const { render } = props;

  const GoogleLogout = React.memo(dynamic(
    () => import('react-google-login').then(mod => mod.GoogleLogout),
    { ssr: false, loading: render || (() => <Text>Please wait...</Text>) },
  ));

  return (
    <GoogleLogout
      clientId={clientId}
      buttonText="Logout"
      onLogoutSuccess={logout}
      {...props}
    />
  );
};

Logout.propTypes = { render: PropTypes.func };
Logout.defaultProps = { render: null };
Logout.whyDidYouRender = true;

const Google = {};

Google.Login = React.memo(Login);
Google.Logout = React.memo(Logout);

export default Google;
