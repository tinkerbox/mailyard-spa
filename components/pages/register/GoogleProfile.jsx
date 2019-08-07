import React from 'react';

import Google from '../../Google';

const GoogleProfile = ({ profile }) => {

  return (
    <div>
      <img src={profile.imageUrl} />
      {profile.name}
      <Google.Logout />
    </div>
  );
};

export default GoogleProfile;
