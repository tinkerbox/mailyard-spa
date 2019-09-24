import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Link from 'next/link';

const LinkButton = React.memo(({ href, children, ...others }) => (
  <Link href={href}>
    <Button onClick={() => { }} {...others}>{children}</Button>
  </Link>
));

LinkButton.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

LinkButton.whyDidYouRender = true;
LinkButton.displayName = 'LinkButton';

export default LinkButton;
