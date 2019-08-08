import React from 'react';

import { GoogleLogin, GoogleLogout } from 'react-google-login';

import { useGoogle } from '../../hooks/google-context';

const Login = (props) => {
  const { clientId, scope, login } = useGoogle();

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

const Logout = () => {
  const { clientId, logout } = useGoogle();

  return (
    <GoogleLogout
      clientId={clientId}
      buttonText="Logout"
      onLogoutSuccess={logout}
    />
  );
};

const Google = {};

Google.Login = Login;
Google.Logout = Logout;

export default Google;
