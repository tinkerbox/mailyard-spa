import common from './common.css';
import containers from './containers.css';
import spacing from './spacing.css';

const css = {
  ...common,
  ...containers,
  ...spacing,
};

const makeStyles = (component) => {
  const combined = {
    ...css,
    ...component,
  };

  const use = (...classes) => classes.map(cssClass => combined[cssClass]).join(' ');

  return {
    ...combined,
    use,
  };
};

export { makeStyles };

export default {
  ...css,
  use: (...classes) => classes.map(cssClass => css[cssClass]).join(' '),
};
