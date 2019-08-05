import css from './common.css';

const makeStyles = (component) => {
  return { ...css, ...component }
};

export { makeStyles, css };

export default css;
