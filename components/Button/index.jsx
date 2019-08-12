import React from 'react';
import PropTypes from 'prop-types';

import { useRouter } from 'next/router'

import { Button as AntButton } from 'antd';

const Button = ({ href, children, ...props }) => {
  const router = useRouter();

  const clickHandler = () => router.push(href);

  return (
    <AntButton onClick={clickHandler} {...props}>
      {children}
    </AntButton>
  );
};

Button.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default Button;
