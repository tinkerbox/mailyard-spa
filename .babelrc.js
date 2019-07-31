module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
  ],
  plugins: [
    ["@babel/plugin-transform-runtime", {
      helpers: true,
      regenerator: true,
    }],
  ],
};
