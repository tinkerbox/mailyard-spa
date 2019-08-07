import React from 'react';

import { useRouter } from 'next/router'

import { Button as AntButton } from 'antd';

const Button = ({ href, ...props }) => {
  const router = useRouter();

  const clickHandler = () => router.push(href);

  return (
    <AntButton onClick={clickHandler} {...props}>
      {props.children}
    </AntButton>
  );
};

export default Button;
