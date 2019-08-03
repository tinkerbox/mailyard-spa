import React from 'react';

import Link from 'next/link';

import config from '../config/runtime';

const Index = () => {
  return (
    <div>
      <Link href='/'><a>Home</a></Link>
      <br />
      <Link href={config.MAILYARD_WEB_URL}><a>Go to Mailyard website</a></Link>
    </div>
  );
};

export default Index;
