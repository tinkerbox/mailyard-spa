import common from './common.css';
import containers from './containers.css';
import spacing from './spacing.css';

const css = {
  ...common,
  ...containers,
  ...spacing,
};

const makeStyles = component => ({
  ...css,
  ...component,
});

export { makeStyles };

export default css;
