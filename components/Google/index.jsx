import React from 'react';

import { useGoogle } from '../../hooks/google-context';

import { GoogleLogin, GoogleLogout } from 'react-google-login';

const Login = () => {
  const { clientId, scope, login, profile } = useGoogle();

  const googleRenderlessDisplay = renderProps => <div {...renderProps} />;

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText='Sign in with Google'
      scope={scope}
      onSuccess={login}
      onFailure={login}
      cookiePolicy={'single_host_origin'}
      theme='dark'
      prompt='consent'
      isSignedIn={true}
      render={profile ? googleRenderlessDisplay : null} // TODO: maybe this is not necesasry
    />
  );
};

const Logout = () => {
  const { clientId, logout } = useGoogle();

  return (
    <GoogleLogout
      clientId={clientId}
      buttonText='Logout'
      onLogoutSuccess={logout}
    />
  );
};

const Google = {};

Google.Login = Login;
Google.Logout = Logout;

export default Google;
