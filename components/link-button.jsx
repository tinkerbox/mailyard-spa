import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const LinkButton = React.forwardRef(({ onClick, href, children, ...others }, ref) => {
  return <Button onClick={onClick} href={href} ref={ref} {...others}>{children}</Button>;
});

LinkButton.propTypes = {
  onClick: PropTypes.func,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

LinkButton.defaultProps = {
  onClick: () => { },
};

LinkButton.whyDidYouRender = true;
LinkButton.displayName = 'LinkButton';

export default LinkButton;
